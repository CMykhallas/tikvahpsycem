// =========================================
// MONITOR ABUSE SPIKES
// Cron-invoked function that detects spikes in security_incidents
// and dispatches deduplicated Slack/Email/Discord alerts.
// =========================================
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { Resend } from "npm:resend@4.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const WINDOW_MIN = 15;
const DEDUPE_TTL_MIN = 60;
const RATE_LIMIT_THRESHOLD = Number(Deno.env.get("SPIKE_RATE_LIMIT_THRESHOLD") ?? 10);
const CRITICAL_THRESHOLD = Number(Deno.env.get("SPIKE_CRITICAL_THRESHOLD") ?? 3);
const ADMIN_EMAIL = "suporte.oficina.psicologo@proton.me";

interface Incident {
  id: string;
  incident_type: string;
  severity: string;
  ip_address: string;
  details: Record<string, unknown> | null;
  created_at: string;
}

interface SpikeGroup {
  key: string;
  incident_type: string;
  reason: string;
  count: number;
  threshold: number;
  severity: "high" | "critical";
  topIps: Array<{ ip: string; count: number }>;
}

const authOk = (req: Request): boolean => {
  const expected = `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""}`;
  return req.headers.get("authorization") === expected;
};

const groupSpikes = (incidents: Incident[]): SpikeGroup[] => {
  const buckets = new Map<string, { type: string; reason: string; ips: Map<string, number>; critical: number }>();
  for (const i of incidents) {
    const reason = String(i.details?.["reason"] ?? "unknown");
    const key = `${i.incident_type}:${reason}`;
    const b = buckets.get(key) ?? { type: i.incident_type, reason, ips: new Map(), critical: 0 };
    b.ips.set(i.ip_address, (b.ips.get(i.ip_address) ?? 0) + 1);
    if (i.severity === "critical") b.critical += 1;
    buckets.set(key, b);
  }
  const spikes: SpikeGroup[] = [];
  for (const [key, b] of buckets) {
    const total = Array.from(b.ips.values()).reduce((a, c) => a + c, 0);
    const isRateLimit = b.type.toLowerCase().includes("rate");
    const threshold = isRateLimit ? RATE_LIMIT_THRESHOLD : CRITICAL_THRESHOLD;
    const trigger = isRateLimit ? total >= threshold : b.critical >= threshold;
    if (!trigger) continue;
    spikes.push({
      key,
      incident_type: b.type,
      reason: b.reason,
      count: total,
      threshold,
      severity: b.critical > 0 ? "critical" : "high",
      topIps: Array.from(b.ips.entries())
        .sort((a, z) => z[1] - a[1])
        .slice(0, 5)
        .map(([ip, count]) => ({ ip, count })),
    });
  }
  return spikes;
};

const dispatchSlack = async (s: SpikeGroup): Promise<void> => {
  const url = Deno.env.get("SLACK_WEBHOOK_URL");
  if (!url) return;
  const body = {
    blocks: [
      { type: "header", text: { type: "plain_text", text: `🚨 Pico: ${s.incident_type}` } },
      {
        type: "section",
        fields: [
          { type: "mrkdwn", text: `*Reason:*\n${s.reason}` },
          { type: "mrkdwn", text: `*Count (15min):*\n${s.count}` },
          { type: "mrkdwn", text: `*Threshold:*\n${s.threshold}` },
          { type: "mrkdwn", text: `*Severidade:*\n${s.severity}` },
          { type: "mrkdwn", text: `*Top IPs:*\n${s.topIps.map((x) => `\`${x.ip}\` (${x.count})`).join(", ")}` },
        ],
      },
    ],
  };
  await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
};

const dispatchDiscord = async (s: SpikeGroup): Promise<void> => {
  const url = Deno.env.get("DISCORD_WEBHOOK_URL");
  if (!url) return;
  const body = {
    username: "Abuse Monitor",
    embeds: [
      {
        title: `🚨 Pico detectado: ${s.incident_type}`,
        color: s.severity === "critical" ? 0xff0000 : 0xff8800,
        fields: [
          { name: "Reason", value: s.reason, inline: true },
          { name: "Count", value: String(s.count), inline: true },
          { name: "Threshold", value: String(s.threshold), inline: true },
          { name: "Top IPs", value: s.topIps.map((x) => `${x.ip} (${x.count})`).join("\n") || "n/a" },
        ],
        timestamp: new Date().toISOString(),
      },
    ],
  };
  await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
};

const dispatchEmail = async (s: SpikeGroup): Promise<void> => {
  const key = Deno.env.get("RESEND_API_KEY");
  if (!key) return;
  const resend = new Resend(key);
  const esc = (v: unknown) =>
    String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
  const rows = s.topIps.map((x) => `<tr><td>${esc(x.ip)}</td><td>${x.count}</td></tr>`).join("");
  const html = `
    <h2 style="font-family:sans-serif">Pico de segurança: ${esc(s.incident_type)}</h2>
    <p><b>Reason:</b> ${esc(s.reason)}<br/>
       <b>Count (15min):</b> ${s.count} — <b>Threshold:</b> ${s.threshold}<br/>
       <b>Severidade:</b> ${esc(s.severity)}</p>
    <table border="1" cellpadding="6" style="border-collapse:collapse;font-family:monospace">
      <tr><th>IP</th><th>Count</th></tr>${rows}
    </table>
  `;
  await resend.emails.send({
    from: "Tikvah Security <onboarding@resend.dev>",
    to: [ADMIN_EMAIL],
    subject: `🚨 [${s.severity.toUpperCase()}] Pico ${s.incident_type} — ${s.count} eventos/15min`,
    html,
  });
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (!authOk(req)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  const supabase = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "", {
    auth: { persistSession: false },
  });

  try {
    const since = new Date(Date.now() - WINDOW_MIN * 60_000).toISOString();
    const { data: incidents, error } = await supabase
      .from("security_incidents")
      .select("id,incident_type,severity,ip_address,details,created_at")
      .gte("created_at", since);
    if (error) throw error;

    const spikes = groupSpikes((incidents ?? []) as Incident[]);
    const dispatched: string[] = [];
    const skipped: string[] = [];

    for (const spike of spikes) {
      // Dedupe check
      const { data: existing } = await supabase
        .from("alert_dedupe")
        .select("key,notified_at")
        .eq("key", spike.key)
        .maybeSingle();

      if (existing && Date.now() - new Date(existing.notified_at).getTime() < DEDUPE_TTL_MIN * 60_000) {
        skipped.push(spike.key);
        continue;
      }

      await Promise.allSettled([dispatchSlack(spike), dispatchDiscord(spike), dispatchEmail(spike)]);

      await supabase.from("alert_dedupe").upsert({
        key: spike.key,
        notified_at: new Date().toISOString(),
        count: spike.count,
        metadata: { top_ips: spike.topIps, threshold: spike.threshold },
      });
      dispatched.push(spike.key);
    }

    return new Response(JSON.stringify({ ok: true, spikes: spikes.length, dispatched, skipped }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[monitor-abuse-spikes] error", err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
