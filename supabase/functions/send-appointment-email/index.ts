import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "npm:@supabase/supabase-js@2";
import { buildCorsHeaders } from "../_shared/cors.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const supabaseAdmin = () =>
  createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

// Per-IP rate limit using the rate_limits table (max 3 / 10 min).
// Columns: key (PK), count, reset_time, blocked_until.
async function checkRateLimit(ip: string): Promise<boolean> {
  try {
    const admin = supabaseAdmin();
    const windowMs = 10 * 60 * 1000;
    const max = 3;
    const key = `send-appointment-email:${ip}`;
    const now = new Date();
    const { data } = await admin
      .from("rate_limits")
      .select("key, count, reset_time, blocked_until")
      .eq("key", key)
      .maybeSingle();

    if (data?.blocked_until && new Date(data.blocked_until) > now) return false;

    if (!data || new Date(data.reset_time) < now) {
      await admin.from("rate_limits").upsert(
        {
          key,
          count: 1,
          reset_time: new Date(now.getTime() + windowMs).toISOString(),
          blocked_until: null,
        },
        { onConflict: "key" }
      );
      return true;
    }
    if (data.count >= max) {
      await admin
        .from("rate_limits")
        .update({ blocked_until: new Date(now.getTime() + windowMs).toISOString() })
        .eq("key", key);
      return false;
    }
    await admin
      .from("rate_limits")
      .update({ count: data.count + 1 })
      .eq("key", key);
    return true;
  } catch (e) {
    console.warn("rate limit check failed (denying):", (e as Error).message);
    // Fail closed to prevent abuse.
    return false;
  }
}

serve(async (req) => {
  const corsHeaders = buildCorsHeaders(req);
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const clientIP =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const allowed = await checkRateLimit(clientIP);
    if (!allowed) {
      return new Response(JSON.stringify({ error: "Too many requests" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 429,
      });
    }

    const contentType = req.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return new Response(JSON.stringify({ error: "Invalid content type" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    const contentLength = req.headers.get("content-length");
    if (contentLength && parseInt(contentLength) > 2048) {
      return new Response(JSON.stringify({ error: "Request too large" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 413,
      });
    }

    const body = await req.json().catch(() => null);
    const appointmentId: string | undefined = body?.appointment_id;

    if (!appointmentId || typeof appointmentId !== "string" ||
        !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(appointmentId)) {
      return new Response(JSON.stringify({ error: "appointment_id (uuid) required" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Fetch the appointment from DB — NEVER trust caller-supplied email/PII.
    const admin = supabaseAdmin();
    const { data: appt, error: fetchErr } = await admin
      .from("appointments")
      .select("id, client_name, email, phone, service_type, preferred_date, message, created_at")
      .eq("id", appointmentId)
      .maybeSingle();

    if (fetchErr || !appt) {
      return new Response(JSON.stringify({ error: "Appointment not found" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 404,
      });
    }

    // Only allow sending for very recently created appointments (anti-replay).
    const createdAt = new Date(appt.created_at as string).getTime();
    if (Date.now() - createdAt > 10 * 60 * 1000) {
      return new Response(JSON.stringify({ error: "Appointment too old to notify" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 410,
      });
    }

    const data = {
      client_name: String(appt.client_name ?? ""),
      email: String(appt.email ?? ""),
      phone: String(appt.phone ?? ""),
      service_type: String(appt.service_type ?? ""),
      preferred_date: appt.preferred_date as string,
      message: appt.message ? String(appt.message) : "",
    };

    console.log("Sending appointment email", {
      id: appt.id,
      service_type: data.service_type,
    });

    const adminEmailResponse = await resend.emails.send({
      from: "Sistema de Agendamentos <onboarding@resend.dev>",
      to: ["suporte.oficina.psicologo@proton.me"],
      subject: `Novo agendamento solicitado - ${data.service_type}`,
      html: `
        <h2>Novo agendamento solicitado</h2>
        <div style="background:#f5f5f5;padding:20px;border-radius:8px;margin:20px 0">
          <p><strong>Cliente:</strong> ${data.client_name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Telefone:</strong> ${data.phone}</p>
          <p><strong>Serviço:</strong> ${data.service_type}</p>
          <p><strong>Data Preferida:</strong> ${new Date(data.preferred_date).toLocaleString("pt-PT")}</p>
        </div>
        ${data.message ? `<h3>Observações:</h3><div style="background:#fff;padding:20px;border:1px solid #ddd;border-radius:8px">${data.message.replace(/\n/g, "<br>")}</div>` : ""}
      `,
    });

    const clientEmailResponse = await resend.emails.send({
      from: "Atendimento <onboarding@resend.dev>",
      to: [data.email],
      subject: "Agendamento recebido - Confirmação pendente",
      html: `
        <h2>Olá, ${data.client_name}!</h2>
        <p>Recebemos sua solicitação de agendamento e entraremos em contato em breve para confirmar.</p>
        <div style="background:#f5f5f5;padding:20px;border-radius:8px;margin:20px 0">
          <h3>Detalhes do seu agendamento:</h3>
          <p><strong>Serviço:</strong> ${data.service_type}</p>
          <p><strong>Data Preferida:</strong> ${new Date(data.preferred_date).toLocaleString("pt-PT")}</p>
          <p><strong>Telefone de contato:</strong> ${data.phone}</p>
        </div>
        <p>Nossa equipe analisará sua solicitação e entrará em contato em até 24 horas.</p>
      `,
    });

    return new Response(
      JSON.stringify({
        success: true,
        adminEmailId: adminEmailResponse.data?.id,
        clientEmailId: clientEmailResponse.data?.id,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("Error in send-appointment-email:", (error as Error).message);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
