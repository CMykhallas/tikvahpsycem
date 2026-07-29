// Health check público para monitorização externa de disponibilidade
// (Descoberta Baixa C — "Sem Monitoramento de Disponibilidade").
//
// Uso recomendado: apontar uma ferramenta externa (UptimeRobot, Better Uptime,
// Vercel Monitoring, etc.) a
//   https://<project-ref>.supabase.co/functions/v1/health-check
// com verificação a cada 1-5 minutos e alerta se status != "ok" ou HTTP != 200.
//
// Propositadamente NÃO expõe versões de dependências, stack traces, nem
// detalhes internos — apenas confirma que a camada de edge functions e a
// ligação à base de dados estão operacionais.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { buildCorsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  const corsHeaders = buildCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const startedAt = Date.now();
  const checks: Record<string, "ok" | "fail"> = {};

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Query mínima, sem expor dados: apenas confirma que a BD responde.
    const { error } = await supabase
      .from("contacts")
      .select("id", { count: "exact", head: true })
      .limit(1);

    checks.database = error ? "fail" : "ok";
  } catch {
    checks.database = "fail";
  }

  const allOk = Object.values(checks).every((v) => v === "ok");
  const status = allOk ? "ok" : "degraded";

  return new Response(
    JSON.stringify({
      status,
      checks,
      latency_ms: Date.now() - startedAt,
      timestamp: new Date().toISOString(),
    }),
    {
      status: allOk ? 200 : 503,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    }
  );
});
