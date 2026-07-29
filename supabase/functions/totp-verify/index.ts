import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { TotpService } from "../_shared/totp.ts";
import { buildCorsHeaders } from "../_shared/cors.ts";
import { validateRequiredJWT, SecurityLogger, AdvancedRateLimiter } from "../_shared/security.ts";

serve(async (req) => {
  const corsHeaders = buildCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validar JWT
    const jwtCheck = await validateRequiredJWT(req, corsHeaders);
    if (jwtCheck.error) {
      return jwtCheck.error;
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const logger = new SecurityLogger(supabase);
    const userId = jwtCheck.user?.id;

    if (!userId) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    // CORREÇÃO (Descoberta Média E): rate limiting contra brute-force do código TOTP.
    // Sem isto, um JWT válido permitia testar as 10^6 combinações do código sem travão.
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
    const rateLimiter = new AdvancedRateLimiter(supabase, logger);
    const rateCheck = await rateLimiter.checkRateLimit(clientIp, "totp-verify", userId);

    if (!rateCheck.allowed) {
      await logger.log({
        event_type: "2fa_verification_rate_limited",
        user_id: userId,
        details: { reason: rateCheck.reason, ip: clientIp },
        severity: "warning",
      });

      return new Response(
        JSON.stringify({
          error: "Demasiadas tentativas. Tente novamente mais tarde.",
          retryAfter: rateCheck.retryAfter,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 429,
        }
      );
    }

    // Parse request body
    const requestData = await req.json();
    const { secret, token, backupCodes } = requestData;

    if (!secret || !token) {
      return new Response(
        JSON.stringify({ error: "Missing secret or token" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    console.log("[TOTP-VERIFY] Verificando token para usuário:", userId);

    // Verificar token TOTP
    const isValidToken = await TotpService.verifyToken(secret, token);

    if (!isValidToken) {
      // Log falha
      await logger.log({
        event_type: "2fa_verification_failed",
        user_id: userId,
        details: { reason: "Invalid TOTP token" },
        severity: "warning",
      });

      console.log("[TOTP-VERIFY] Token inválido para usuário:", userId);

      return new Response(
        JSON.stringify({ error: "Invalid TOTP token" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401,
        }
      );
    }

    // Token válido - salvar no banco de dados
    const { error: upsertError } = await supabase
      .from("user_totp")
      .upsert({
        user_id: userId,
        secret: secret,
        backup_codes: backupCodes || [],
        enabled: true,
        enabled_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

    if (upsertError) {
      console.error("[TOTP-VERIFY] Erro ao salvar TOTP:", upsertError);

      await logger.log({
        event_type: "2fa_enable_failed",
        user_id: userId,
        details: { error: upsertError.message },
        severity: "error",
      });

      return new Response(
        JSON.stringify({ error: "Failed to enable 2FA" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    // Log sucesso
    await logger.log({
      event_type: "2fa_enabled",
      user_id: userId,
      details: { method: "TOTP", codes_issued: backupCodes?.length || 0 },
      severity: "info",
    });

    console.log("[TOTP-VERIFY] 2FA ativado com sucesso para usuário:", userId);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Autenticação de dois fatores ativada com sucesso!",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("[TOTP-VERIFY] Error:", error);

    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
