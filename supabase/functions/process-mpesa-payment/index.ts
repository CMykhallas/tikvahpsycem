// =========================================
// SECURE M-PESA PAYMENT PROCESSING
// Enterprise-grade security implementation
// =========================================

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { SecurityLogger, securityMiddleware, validateOptionalJWT } from '../_shared/security.ts';
import { buildCorsHeaders } from '../_shared/cors.ts';

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[MPESA-PAYMENT] ${step}${detailsStr}`);
};

serve(async (req) => {
  const corsHeaders = buildCorsHeaders(req);
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  const logger = new SecurityLogger(supabase);
  const ip = req.headers.get("x-forwarded-for")?.split(',')[0].trim() || "unknown";
  const userAgent = req.headers.get('user-agent') || 'unknown';

  try {
    logStep("🔒 Starting secure M-Pesa payment processing");

    // =========================================
    // FASE 0: JWT VALIDATION (optional — guest payments allowed)
    // =========================================
    const jwtCheck = await validateOptionalJWT(req, corsHeaders);
    if (jwtCheck.error) {
      await logger.logIncident({
        incident_type: 'VALIDATION_FAILURE',
        severity: 'high',
        ip_address: ip,
        user_agent: userAgent,
        endpoint: 'process-mpesa-payment',
        details: { reason: 'INVALID_JWT' }
      });
      return jwtCheck.error;
    }

    // =========================================
    // FASE 1: SECURITY MIDDLEWARE
    // =========================================
    const securityCheck = await securityMiddleware(req, 'process-mpesa-payment', supabase);
    if (securityCheck) {
      logStep('⚠️ Request blocked by security middleware');
      return new Response(securityCheck.body, {
        status: securityCheck.status,
        headers: { ...corsHeaders, ...Object.fromEntries(securityCheck.headers) }
      });
    }

    // =========================================
    // FASE 2: INPUT VALIDATION
    // =========================================
    const body = await req.json().catch(() => ({}));
    const { phoneNumber, orderId, orderToken } = body ?? {};

    // Validar configuração M-Pesa
    const consumerKey = Deno.env.get("MPESA_CONSUMER_KEY");
    const consumerSecret = Deno.env.get("MPESA_CONSUMER_SECRET");
    
    if (!consumerKey || !consumerSecret) {
      await logger.logIncident({
        incident_type: 'VALIDATION_FAILURE',
        severity: 'critical',
        ip_address: ip,
        endpoint: 'process-mpesa-payment',
        details: { reason: 'MISSING_MPESA_CREDENTIALS' }
      });
      throw new Error("Configuração M-Pesa incompleta");
    }

    // Validar inputs (o valor NUNCA vem do cliente — é derivado do pedido)
    const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!orderId || typeof orderId !== 'string' || !UUID_RE.test(orderId) || !phoneNumber) {
      await logger.logIncident({
        incident_type: 'VALIDATION_FAILURE',
        severity: 'medium',
        ip_address: ip,
        endpoint: 'process-mpesa-payment',
        details: { reason: 'MISSING_REQUIRED_FIELDS' }
      });
      
      return new Response(JSON.stringify({
        success: false,
        error: "Dados de pagamento incompletos"
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Validar telefone M-Pesa
    const validPhone = String(phoneNumber).replace(/\D/g, '');
    if (!/^258(8[2345]|8[67])\d{7}$/.test(validPhone)) {
      await logger.logIncident({
        incident_type: 'VALIDATION_FAILURE',
        severity: 'medium',
        ip_address: ip,
        endpoint: 'process-mpesa-payment',
        details: { 
          reason: 'INVALID_PHONE_FORMAT',
          phone: validPhone.slice(0, 6) + '***'
        }
      });
      
      return new Response(JSON.stringify({
        success: false,
        error: "Número de telefone M-Pesa inválido"
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // =========================================
    // FASE 2B: OWNERSHIP / AUTHORIZATION
    // O pedido tem de pertencer ao utilizador autenticado ou
    // o chamador tem de apresentar o token de acesso do pedido (convidado).
    // =========================================
    const { data: order, error: orderLoadError } = await supabase
      .from('orders')
      .select('id, amount, status, user_id, order_access_token, token_expires_at')
      .eq('id', orderId)
      .maybeSingle();

    const denyAccess = async (reason: string) => {
      await logger.logIncident({
        incident_type: 'VALIDATION_FAILURE',
        severity: 'high',
        ip_address: ip,
        user_agent: userAgent,
        endpoint: 'process-mpesa-payment',
        details: { reason, orderId }
      });
      return new Response(JSON.stringify({
        success: false,
        error: "Pedido não encontrado ou acesso não autorizado"
      }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    };

    if (orderLoadError || !order) {
      return await denyAccess('ORDER_NOT_FOUND');
    }

    if (order.user_id) {
      // Pedido de utilizador autenticado: exige JWT do próprio dono
      if (!jwtCheck.userId || jwtCheck.userId !== order.user_id) {
        return await denyAccess('ORDER_OWNERSHIP_MISMATCH');
      }
    } else {
      // Pedido de convidado: exige token de acesso válido e não expirado
      if (!orderToken || typeof orderToken !== 'string') {
        return await denyAccess('MISSING_ORDER_TOKEN');
      }
      if (!order.token_expires_at || new Date(order.token_expires_at) < new Date()) {
        return await denyAccess('ORDER_TOKEN_EXPIRED');
      }
      let storedToken: string | null = null;
      try {
        const parsed = JSON.parse(order.order_access_token ?? 'null');
        storedToken = isEncrypted(parsed) ? await decryptField(parsed) : null;
      } catch (_e) {
        storedToken = null;
      }
      if (!storedToken || storedToken !== orderToken) {
        return await denyAccess('INVALID_ORDER_TOKEN');
      }
    }

    // Só pedidos pendentes podem ser pagos
    if (order.status !== 'pending') {
      return await denyAccess('ORDER_NOT_PAYABLE');
    }

    // =========================================
    // VALOR DERIVADO DO SERVIDOR (nunca do cliente)
    // orders.amount está em centavos
    // =========================================
    const validAmount = Math.round(Number(order.amount)) / 100;
    if (!isFinite(validAmount) || validAmount <= 0 || validAmount > 100000) {
      await logger.logIncident({
        incident_type: 'VALIDATION_FAILURE',
        severity: 'high',
        ip_address: ip,
        endpoint: 'process-mpesa-payment',
        details: { reason: 'INVALID_SERVER_AMOUNT', orderId }
      });
      return new Response(JSON.stringify({
        success: false,
        error: "Valor do pedido inválido"
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    logStep("✅ Validation passed", { 
      phone: `${validPhone.slice(0, 6)}****`, 
      amount: validAmount,
      orderId 
    });


    // =========================================
    // FASE 3: M-PESA OAUTH TOKEN
    // =========================================
    logStep("🔐 Requesting M-Pesa OAuth token");

    const authString = btoa(`${consumerKey}:${consumerSecret}`);
    const tokenResponse = await fetch("https://api.vm.co.mz:18352/ipg/v1x/oauth/token", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${authString}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    if (!tokenResponse.ok) {
      await logger.logIncident({
        incident_type: 'VALIDATION_FAILURE',
        severity: 'high',
        ip_address: ip,
        endpoint: 'process-mpesa-payment',
        details: { 
          reason: 'MPESA_AUTH_FAILED',
          status: tokenResponse.status 
        }
      });
      throw new Error("Falha na autenticação M-Pesa");
    }

    const { access_token } = await tokenResponse.json();
    logStep("✅ M-Pesa token obtained");

    // =========================================
    // FASE 4: C2B PAYMENT TRANSACTION
    // =========================================
    logStep("💳 Initiating C2B payment transaction");

    const transactionRef = `TKV${Date.now()}`;
    const c2bPayload = {
      input_TransactionReference: transactionRef,
      input_CustomerMSISDN: validPhone,
      input_Amount: validAmount.toString(),
      input_ThirdPartyReference: orderId,
      input_ServiceProviderCode: "258855487746", // Tikvah business number
    };

    const c2bResponse = await fetch("https://api.vm.co.mz:18352/ipg/v1x/c2bPayment/singleStage/", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(c2bPayload),
    });

    const c2bData = await c2bResponse.json();
    logStep("📨 M-Pesa response received", { 
      status: c2bResponse.status, 
      code: c2bData.output_ResponseCode 
    });

    // =========================================
    // FASE 5: PROCESS RESULT
    // =========================================
    if (c2bData.output_ResponseCode === "INS-0") {
      // ✅ SUCESSO - Atualizar pedido
      logStep("✅ Payment successful, updating order");

      const { error: updateError } = await supabase
        .from("orders")
        .update({
          status: "processing",
          payment_method: "mpesa",
          mpesa_reference: c2bData.output_TransactionID,
          phone_number: validPhone,
        })
        .eq("id", orderId);

      if (updateError) {
        logStep("⚠️ Order update failed", updateError);
      }

      // Log sucesso
      await logger.logIncident({
        incident_type: 'VALIDATION_FAILURE',
        severity: 'low',
        ip_address: ip,
        user_agent: userAgent,
        endpoint: 'process-mpesa-payment',
        details: {
          event: 'MPESA_PAYMENT_SUCCESS',
          orderId,
          transactionId: c2bData.output_TransactionID,
          amount: validAmount
        }
      });

      return new Response(JSON.stringify({
        success: true,
        transactionId: c2bData.output_TransactionID,
        message: "Pagamento processado com sucesso",
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });

    } else {
      // ❌ FALHA no pagamento
      await logger.logIncident({
        incident_type: 'VALIDATION_FAILURE',
        severity: 'medium',
        ip_address: ip,
        endpoint: 'process-mpesa-payment',
        details: {
          event: 'MPESA_PAYMENT_FAILED',
          orderId,
          responseCode: c2bData.output_ResponseCode,
          responseDesc: c2bData.output_ResponseDesc
        }
      });

      throw new Error(c2bData.output_ResponseDesc || "Pagamento M-Pesa falhou");
    }

  } catch (error) {
    logStep("❌ ERROR", { message: error.message });

    await logger.logIncident({
      incident_type: 'VALIDATION_FAILURE',
      severity: 'high',
      ip_address: ip,
      user_agent: userAgent,
      endpoint: 'process-mpesa-payment',
      details: {
        error: error.message,
        stack: error.stack
      }
    });

    return new Response(JSON.stringify({
      success: false,
      error: "Erro ao processar pagamento M-Pesa",
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
