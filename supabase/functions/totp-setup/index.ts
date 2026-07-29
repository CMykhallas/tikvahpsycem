import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { TotpService } from "../_shared/totp.ts";
import { buildCorsHeaders } from "../_shared/cors.ts";
import { validateRequiredJWT, SecurityLogger } from "../_shared/security.ts";

serve(async (req) => {
  const corsHeaders = buildCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validar JWT - requer autenticação
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

    console.log("[TOTP-SETUP] Iniciando setup para usuário:", userId);

    // Gerar novo secret + QR code
    const { secret, qrCode } = await TotpService.generateSecret(userId);

    // Gerar backup codes
    const backupCodes = TotpService.generateBackupCodes();

    // Log do evento
    await logger.log({
      event_type: "2fa_setup_initiated",
      user_id: userId,
      details: { has_secret: true },
      severity: "info",
    });

    return new Response(
      JSON.stringify({
        secret: secret,
        qrCode: qrCode,
        backupCodes: backupCodes,
        message: "Configure seu autenticador e confirme com o código de 6 dígitos",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("[TOTP-SETUP] Error:", error);

    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
