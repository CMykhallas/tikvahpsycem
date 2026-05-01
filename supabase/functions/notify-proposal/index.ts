import { serve } from "npm:std/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// === Roteamento Multi-Email Tikvah Psycem ===
const EMAIL_PRIMARY = "suporte.oficina.psicologo@proton.me";
const EMAIL_CLINICA = "geral.consultoriotekvah@gmail.com";
const EMAIL_EXECUTIVO = "ceo.consultoriotekvah@gmail.com";
const EMAIL_FORMACAO = "recrutamento.tikvahpsycem@proton.me";

// FROM: trocar para notify@tikvahpsycem.com quando domínio estiver verificado
const FROM_EMAIL = "Tikvah Psycem <onboarding@resend.dev>";

// Áreas Clínicas (1-5), Executivas (6-9), Formação (10-12)
function resolveCC(areaCode?: string | null): { cc: string[]; priority: string } {
  const code = (areaCode || "").toUpperCase();
  // Executivos / Empresarial / Financeira / TI / Jurídico
  if (/^(EMP|EXE|FIN|TI|JUR|CONS|COACH)/.test(code)) {
    return { cc: [EMAIL_EXECUTIVO], priority: "PREMIUM" };
  }
  // Formação / Voluntariado / Social / PSP / PEP
  if (/^(FOR|VOL|SOC|PSP|PEP|REC)/.test(code)) {
    return { cc: [EMAIL_FORMACAO], priority: "FORMACAO" };
  }
  // Default: Clínica
  return { cc: [EMAIL_CLINICA], priority: "CLINICA" };
}

function buildWhatsAppText(p: any, protocol: string): string {
  const phone = (p.phone || "").replace(/\D/g, "");
  const lines = [
    `🔔 *NOVA PROPOSTA — ${protocol}*`,
    ``,
    `👤 *Cliente:* ${p.full_name}`,
    `📱 ${p.phone}`,
    `📧 ${p.email}`,
    ``,
    `🎯 *Serviço:* ${p.service_title}`,
    p.area_name ? `🗂️ Área: ${p.area_name}` : null,
    `📍 Modalidade: ${p.modality}`,
    `👥 Público: ${p.audience}`,
    p.message ? `\n💬 _${p.message.slice(0, 200)}${p.message.length > 200 ? "..." : ""}_` : null,
    ``,
    `⚡ *Responder em 60min*`,
    phone ? `wa.me/${phone}?text=${encodeURIComponent(`Olá ${p.full_name}, falamos da Tikvah Psycem sobre o pedido ${protocol}.`)}` : null,
  ].filter(Boolean);
  return lines.join("\n");
}

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
    const { cc, priority } = resolveCC(proposal.area_code);
    const whatsappText = buildWhatsAppText(proposal, protocol);

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;padding:20px;color:#1a1a1a">
        <div style="background:#1e3a8a;color:#fff;padding:18px;border-radius:8px 8px 0 0">
          <div style="display:inline-block;background:#f59e0b;color:#1a1a1a;padding:3px 10px;border-radius:4px;font-size:11px;font-weight:bold;letter-spacing:1px">${priority}</div>
          <h2 style="margin:8px 0 0">📋 Nova Proposta — ${protocol}</h2>
          <p style="margin:4px 0 0;opacity:.9;font-size:13px">Tikvah Psycem · Sistema de Propostas</p>
        </div>
        <div style="border:1px solid #e5e7eb;border-top:0;padding:20px;border-radius:0 0 8px 8px">
          <h3 style="margin-top:0;color:#1e3a8a">Serviço solicitado</h3>
          <p><strong>${escapeHtml(proposal.service_title)}</strong><br/>
          <small style="color:#64748b">${escapeHtml(proposal.area_name || "")} · ${escapeHtml(proposal.area_code || "")}</small></p>

          <h3 style="color:#1e3a8a">Cliente</h3>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:6px 0;color:#64748b;width:120px">Nome</td><td><strong>${escapeHtml(proposal.full_name)}</strong></td></tr>
            <tr><td style="padding:6px 0;color:#64748b">Email</td><td><a href="mailto:${escapeHtml(proposal.email)}">${escapeHtml(proposal.email)}</a></td></tr>
            <tr><td style="padding:6px 0;color:#64748b">Telefone</td><td><a href="tel:${escapeHtml(proposal.phone)}">${escapeHtml(proposal.phone)}</a></td></tr>
            <tr><td style="padding:6px 0;color:#64748b">WhatsApp</td><td><a href="https://wa.me/${escapeHtml((proposal.phone||"").replace(/\D/g,""))}" style="color:#10b981;font-weight:bold">Abrir conversa →</a></td></tr>
            <tr><td style="padding:6px 0;color:#64748b">Modalidade</td><td>${escapeHtml(proposal.modality)}</td></tr>
            <tr><td style="padding:6px 0;color:#64748b">Público</td><td>${escapeHtml(proposal.audience)}</td></tr>
          </table>

          ${proposal.message ? `<h3 style="color:#1e3a8a">Mensagem</h3><p style="background:#f8fafc;padding:12px;border-left:3px solid #f59e0b;border-radius:4px">${escapeHtml(proposal.message)}</p>` : ""}

          <div style="margin-top:20px;padding:14px;background:#fef3c7;border-radius:6px;border-left:4px solid #f59e0b">
            <p style="margin:0;font-weight:bold;color:#92400e">⚡ ACÇÃO IMEDIATA: Responder em 60 minutos</p>
          </div>

          <h3 style="color:#1e3a8a;margin-top:24px">📲 Texto pronto para WhatsApp interno</h3>
          <pre style="background:#0f172a;color:#e2e8f0;padding:14px;border-radius:6px;font-size:12px;white-space:pre-wrap;font-family:monospace">${escapeHtml(whatsappText)}</pre>

          <p style="margin-top:24px;color:#64748b;font-size:12px">
            Recebido em ${new Date(proposal.created_at).toLocaleString("pt-MZ", { timeZone: "Africa/Maputo" })} (Maputo)<br/>
            Protocolo: <code>${protocol}</code> · ID: <code>${proposal.id}</code> · Prioridade: <code>${priority}</code>
          </p>
        </div>
      </div>
    `;

    let sent = false;
    let resendResult: any = null;

    if (resendKey) {
      const resp = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: [EMAIL_PRIMARY],
          cc,
          reply_to: proposal.email,
          subject: `🔔 [${priority}] Proposta ${protocol} — ${proposal.service_title} — ${proposal.full_name}`,
          html,
        }),
      });
      resendResult = await resp.json();
      sent = resp.ok;
      if (!resp.ok) console.error("Resend error:", resendResult);
    } else {
      console.warn("RESEND_API_KEY not set; skipping email send");
    }

    // Audit trail
    await supabase.from("proposal_audit_trail").insert({
      proposal_id: proposal.id,
      event: "notificada",
      actor: "system",
      notes: sent ? `Email enviado para ${EMAIL_PRIMARY} (CC: ${cc.join(", ")})` : "Email não enviado (RESEND_API_KEY ausente ou erro)",
      metadata: { protocol, priority, cc, sent, resend_id: resendResult?.id },
    });

    return new Response(JSON.stringify({ ok: true, sent, protocol, priority, cc }), {
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
