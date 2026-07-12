/**
 * send-contact-email
 * ------------------
 * Contact form → admin notification + user confirmation via Resend.
 *
 * Hardening applied (senior review):
 *  - Zod strict input validation (extra fields rejected; `to` field IGNORED).
 *  - Header-injection defense: subject/reply_to scrubbed of CR/LF.
 *  - Recipient is HARDCODED (ADMIN_RECIPIENT); endpoint cannot be used as an
 *    open email relay under any body payload.
 *  - Persistent per-IP rate limiting via `public.rate_limits` (10 min window,
 *    3 requests, 1 h block). Survives cold starts and is shared across
 *    multiple edge-function instances.
 *  - Structured JSON logs on every branch: request_received, validation_failed,
 *    rate_limit_blocked, sent, error.
 *  - Correlation via `X-Request-Id` header (echoed back).
 *  - Bot abuse recorded in `public.security_incidents` (severity=medium) so
 *    existing alert triggers can escalate.
 */
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient, type SupabaseClient } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod@3.23.8";
import { buildCorsHeaders } from "../_shared/cors.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------
const ADMIN_RECIPIENT = "suporte.oficina.psicologo@proton.me";
const MAX_PAYLOAD_SIZE = 10_240; // 10 KB
const RATE_WINDOW_MS = 10 * 60 * 1000; // 10 min
const RATE_MAX = 3;
const RATE_BLOCK_MS = 60 * 60 * 1000; // 1 h

// ---------------------------------------------------------------------------
// Structured logger
// ---------------------------------------------------------------------------
type LogEvent =
  | "request_received"
  | "validation_failed"
  | "rate_limit_blocked"
  | "sent"
  | "error";

function log(event: LogEvent, ctx: Record<string, unknown>) {
  // Single-line JSON is greppable in Deno/Deploy logs and safe for log
  // aggregators (Datadog, Grafana Loki, Better Stack).
  console.log(JSON.stringify({ ts: new Date().toISOString(), fn: "send-contact-email", event, ...ctx }));
}

async function hashUa(ua: string | null): Promise<string> {
  if (!ua) return "none";
  const buf = new TextEncoder().encode(ua);
  const digest = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(digest.slice(0, 8))).map((b) => b.toString(16).padStart(2, "0")).join("");
}

// ---------------------------------------------------------------------------
// Zod schema — strict; unknown keys REJECTED (defense against `to` overrides).
// ---------------------------------------------------------------------------
const CRLF = /[\r\n\u2028\u2029]+/g;
const strip = (v: string) => v.replace(/[<>]/g, "").replace(CRLF, " ").trim();

const ContactSchema = z
  .object({
    name: z.string().trim().min(2).max(100).transform(strip),
    email: z.string().trim().toLowerCase().email().max(255),
    phone: z.string().trim().max(30).optional().or(z.literal("")).transform((v) => (v ? v : undefined)),
    subject: z.string().trim().min(1).max(200).transform(strip),
    message: z.string().trim().min(1).max(2000),
  })
  .strict();

type ContactData = z.infer<typeof ContactSchema>;

// ---------------------------------------------------------------------------
// Persistent rate limit
// ---------------------------------------------------------------------------
interface RateResult { allowed: boolean; retryAfter: number; reason?: string; hits?: number }

async function enforceRateLimit(supabase: SupabaseClient, ip: string): Promise<RateResult> {
  const key = `send-contact-email:ip:${ip}`;
  const now = new Date();

  const { data: row } = await supabase
    .from("rate_limits")
    .select("count, reset_time, blocked_until")
    .eq("key", key)
    .maybeSingle();

  // Blocked window still active
  if (row?.blocked_until && new Date(row.blocked_until) > now) {
    const retryAfter = Math.max(1, Math.ceil((new Date(row.blocked_until).getTime() - now.getTime()) / 1000));
    return { allowed: false, retryAfter, reason: "blocked", hits: row.count };
  }

  // Window expired → reset
  if (!row || new Date(row.reset_time) < now) {
    await supabase.from("rate_limits").upsert({
      key,
      count: 1,
      reset_time: new Date(now.getTime() + RATE_WINDOW_MS).toISOString(),
      blocked_until: null,
      first_request_at: now.toISOString(),
    });
    return { allowed: true, retryAfter: 0, hits: 1 };
  }

  const nextCount = row.count + 1;
  if (nextCount > RATE_MAX) {
    const blockedUntil = new Date(now.getTime() + RATE_BLOCK_MS);
    await supabase.from("rate_limits").update({
      count: nextCount,
      blocked_until: blockedUntil.toISOString(),
    }).eq("key", key);
    const retryAfter = Math.ceil(RATE_BLOCK_MS / 1000);
    return { allowed: false, retryAfter, reason: "exceeded", hits: nextCount };
  }

  await supabase.from("rate_limits").update({ count: nextCount }).eq("key", key);
  return { allowed: true, retryAfter: 0, hits: nextCount };
}

async function logSecurityIncident(
  supabase: SupabaseClient,
  args: { ip: string; ua: string | null; reason: string; retryAfter: number; hits?: number },
) {
  await supabase.from("security_incidents").insert({
    incident_type: "RATE_LIMIT",
    severity: "medium",
    ip_address: args.ip,
    user_agent: args.ua ?? undefined,
    endpoint: "/functions/v1/send-contact-email",
    details: { reason: args.reason, retry_after_s: args.retryAfter, hits: args.hits },
  }).then(() => undefined, () => undefined);
}

// ---------------------------------------------------------------------------
// HTML escaping (email body)
// ---------------------------------------------------------------------------
const escapeHtml = (s: string) => s
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;").replace(/'/g, "&#039;");

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------
serve(async (req) => {
  const cors = buildCorsHeaders(req);
  const started = Date.now();
  const requestId = crypto.randomUUID();
  const baseHeaders = { ...cors, "Content-Type": "application/json", "X-Request-Id": requestId };

  if (req.method === "OPTIONS") return new Response(null, { headers: cors });

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: baseHeaders });
  }

  const ip = (req.headers.get("x-forwarded-for")?.split(",")[0].trim())
    || req.headers.get("cf-connecting-ip")
    || "unknown";
  const ua = req.headers.get("user-agent");
  const uaHash = await hashUa(ua);

  log("request_received", { request_id: requestId, ip, ua_hash: uaHash });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );

  // Rate limit BEFORE parsing body (deny cheap for bots).
  const rl = await enforceRateLimit(supabase, ip);
  if (!rl.allowed) {
    log("rate_limit_blocked", { request_id: requestId, ip, retry_after: rl.retryAfter, reason: rl.reason, hits: rl.hits });
    await logSecurityIncident(supabase, { ip, ua, reason: rl.reason ?? "blocked", retryAfter: rl.retryAfter, hits: rl.hits });
    return new Response(
      JSON.stringify({ error: "Too many requests", retryAfter: rl.retryAfter, requestId }),
      { status: 429, headers: { ...baseHeaders, "Retry-After": String(rl.retryAfter) } },
    );
  }

  try {
    // Content-Type guard
    const ctype = req.headers.get("content-type") ?? "";
    if (!ctype.includes("application/json")) {
      log("validation_failed", { request_id: requestId, reason: "bad_content_type" });
      return new Response(JSON.stringify({ error: "Content-Type must be application/json" }), { status: 400, headers: baseHeaders });
    }

    // Payload size guard
    const cl = Number(req.headers.get("content-length") ?? 0);
    if (cl > MAX_PAYLOAD_SIZE) {
      log("validation_failed", { request_id: requestId, reason: "payload_too_large", size: cl });
      return new Response(JSON.stringify({ error: "Payload too large" }), { status: 413, headers: baseHeaders });
    }

    let raw: unknown;
    try {
      raw = await req.json();
    } catch {
      log("validation_failed", { request_id: requestId, reason: "invalid_json" });
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), { status: 400, headers: baseHeaders });
    }

    const parsed = ContactSchema.safeParse(raw);
    if (!parsed.success) {
      const issues = parsed.error.flatten();
      log("validation_failed", { request_id: requestId, reason: "schema", issues: issues.fieldErrors });
      return new Response(
        JSON.stringify({ error: "Invalid payload", details: issues.fieldErrors, requestId }),
        { status: 400, headers: baseHeaders },
      );
    }
    const data: ContactData = parsed.data;

    // Reply-to must ALWAYS derive from the validated email (never from body).
    const replyTo = data.email;
    const safeSubject = strip(data.subject).slice(0, 200);

    const safeName = escapeHtml(data.name);
    const safeSubjectHtml = escapeHtml(safeSubject);
    const safePhone = escapeHtml(data.phone ?? "Não informado");
    const safeMessageHtml = escapeHtml(data.message).replace(/\n/g, "<br>");

    // Send admin notification
    const adminResp = await resend.emails.send({
      from: "Tikvah Psycem <onboarding@resend.dev>",
      to: [ADMIN_RECIPIENT],
      reply_to: replyTo,
      subject: `Nova mensagem de contato: ${safeSubject}`,
      html: `<!DOCTYPE html><html lang="pt"><head><meta charset="UTF-8"></head>
        <body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;padding:20px">
          <h2 style="color:#1a365d">Nova mensagem de contato</h2>
          <div style="background:#f7fafc;padding:20px;border-radius:8px;border-left:4px solid #3182ce">
            <p><strong>Nome:</strong> ${safeName}</p>
            <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
            <p><strong>Telefone:</strong> ${safePhone}</p>
            <p><strong>Assunto:</strong> ${safeSubjectHtml}</p>
          </div>
          <h3 style="color:#2d3748">Mensagem</h3>
          <div style="background:#fff;padding:20px;border:1px solid #e2e8f0;border-radius:8px">${safeMessageHtml}</div>
          <p style="color:#718096;font-size:12px;margin-top:20px">Request-Id: ${requestId}</p>
        </body></html>`,
    });

    // Send user confirmation
    const userResp = await resend.emails.send({
      from: "Tikvah Psycem <onboarding@resend.dev>",
      to: [data.email],
      subject: "Mensagem recebida - Obrigado pelo contato!",
      html: `<!DOCTYPE html><html lang="pt"><head><meta charset="UTF-8"></head>
        <body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;padding:20px">
          <h2 style="color:#1a365d">Olá, ${safeName}!</h2>
          <p>Recebemos a sua mensagem e responderemos em até 24h úteis.</p>
          <div style="background:#f7fafc;padding:20px;border-radius:8px">
            <p><strong>Assunto:</strong> ${safeSubjectHtml}</p>
            <div style="background:#fff;padding:15px;border:1px solid #e2e8f0;border-radius:4px">${safeMessageHtml}</div>
          </div>
          <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0">
          <p style="color:#718096;font-size:12px">Tikvah Psychological Center · Maputo</p>
        </body></html>`,
    });

    await supabase.from("audit_logs").insert({
      action: "CONTACT_EMAIL_SENT",
      table_name: "contacts",
      new_data: { email: data.email, subject: safeSubject, request_id: requestId },
    }).then(() => undefined, () => undefined);

    log("sent", {
      request_id: requestId,
      ip,
      ua_hash: uaHash,
      duration_ms: Date.now() - started,
      admin_id: adminResp.data?.id,
      user_id: userResp.data?.id,
    });

    return new Response(
      JSON.stringify({ success: true, requestId }),
      { status: 200, headers: baseHeaders },
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    log("error", { request_id: requestId, ip, duration_ms: Date.now() - started, message: msg });
    return new Response(
      JSON.stringify({ error: "Failed to send message", code: "EMAIL_SEND_ERROR", requestId }),
      { status: 500, headers: baseHeaders },
    );
  }
});
