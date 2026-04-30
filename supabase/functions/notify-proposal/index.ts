import { serve } from "npm:std/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const TEAM_EMAIL = "suporte.oficina.psicologo@proton.me";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { proposal_id } = await req.json();
    if (!proposal_id || typeof proposal_id !== "string") {
      return new Response(JSON.stringify({ error: "proposal_id required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendKey = Deno.env.get("RESEND_API_KEY");

    const supabase = createClient(supabaseUrl, serviceKey);

    const { data: proposal, error } = await supabase
      .from("service_proposals")
      .select("*")
      .eq("id", proposal_id)
      .maybeSingle();

    if (error || !proposal) {
      return new Response(JSON.stringify({ error: "Proposta não encontrada" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const protocol = (proposal.metadata as any)?.protocol || `TKV-${proposal.id.slice(0, 8).toUpperCase()}`;

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;color:#1a1a1a">
        <div style="background:#1e3a8a;color:#fff;padding:16px;border-radius:8px 8px 0 0">
          <h2 style="margin:0">📋 Nova Proposta — ${protocol}</h2>
          <p style="margin:4px 0 0;opacity:.9">Tikvah Psycem · Sistema de Propostas</p>
        </div>
        <div style="border:1px solid #e5e7eb;border-top:0;padding:20px;border-radius:0 0 8px 8px">
          <h3 style="margin-top:0;color:#1e3a8a">Serviço solicitado</h3>
          <p><strong>${escapeHtml(proposal.service_title)}</strong><br/>
          <small style="color:#64748b">${escapeHtml(proposal.area_name || "")} · ${escapeHtml(proposal.area_code || "")}</small></p>

          <h3 style="color:#1e3a8a">Cliente</h3>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:6px 0;color:#64748b">Nome</td><td><strong>${escapeHtml(proposal.full_name)}</strong></td></tr>
            <tr><td style="padding:6px 0;color:#64748b">Email</td><td><a href="mailto:${escapeHtml(proposal.email)}">${escapeHtml(proposal.email)}</a></td></tr>
            <tr><td style="padding:6px 0;color:#64748b">Telefone</td><td><a href="tel:${escapeHtml(proposal.phone)}">${escapeHtml(proposal.phone)}</a></td></tr>
            <tr><td style="padding:6px 0;color:#64748b">Modalidade</td><td>${escapeHtml(proposal.modality)}</td></tr>
            <tr><td style="padding:6px 0;color:#64748b">Público</td><td>${escapeHtml(proposal.audience)}</td></tr>
          </table>

          ${proposal.message ? `<h3 style="color:#1e3a8a">Mensagem</h3><p style="background:#f8fafc;padding:12px;border-left:3px solid #f59e0b;border-radius:4px">${escapeHtml(proposal.message)}</p>` : ""}

          <p style="margin-top:24px;color:#64748b;font-size:12px">
            Recebido em ${new Date(proposal.created_at).toLocaleString("pt-MZ", { timeZone: "Africa/Maputo" })} (Maputo)<br/>
            Protocolo: <code>${protocol}</code> · ID: <code>${proposal.id}</code>
          </p>
        </div>
      </div>
    `;

    if (!resendKey) {
      console.warn("RESEND_API_KEY not set; logging only");
      return new Response(JSON.stringify({ ok: true, sent: false, protocol }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Tikvah Psycem <onboarding@resend.dev>",
        to: [TEAM_EMAIL],
        reply_to: proposal.email,
        subject: `[Proposta ${protocol}] ${proposal.service_title} — ${proposal.full_name}`,
        html,
      }),
    });

    const result = await resp.json();
    if (!resp.ok) {
      console.error("Resend error:", result);
      return new Response(JSON.stringify({ ok: false, error: result, protocol }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true, sent: true, protocol }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    console.error("notify-proposal error:", e);
    return new Response(JSON.stringify({ error: e?.message || "internal" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function escapeHtml(s: string) {
  return String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!)
  );
}
