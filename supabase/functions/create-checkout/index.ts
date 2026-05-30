import { serve } from "https://deno.land";
import Stripe from "https://esm.sh";
import { createClient } from "npm:@supabase/supabase-js@2";
import { validateOptionalJWT } from "../_shared/security.ts";
import { buildCorsHeaders, isAllowedOrigin } from "../_shared/cors.ts";

const TRUSTED_FALLBACK_ORIGIN = "https://lovable.app";

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] \${step}\${detailsStr}`);
};

// Validation utilities
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+\$/;
  return emailRegex.test(email) && email.length <= 255;
};

// CORREÇÃO AUXILIAR: Evita evasão de filtros através de limpeza recursiva
const sanitizeString = (input: string, maxLength: number = 1000): string => {
  if (!input || typeof input !== 'string') return '';
  let sanitized = input;
  let previous: string;
  do {
    previous = sanitized;
    sanitized = sanitized
      .replace(/[<>]/g, '')
      .replace(/javascript:/gi, '');
  } while (sanitized !== previous);
  return sanitized.trim().slice(0, maxLength);
};

const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\d\s\-\+\(\)]{8,20}\$/;
  return phoneRegex.test(phone);
};

// CORREÇÃO ALERTA #2: Validador de URL estrito para garantir esquemas HTTP/HTTPS seguros
const validateRedirectUrl = (urlStr: string): string => {
  try {
    const parsed = new URL(urlStr);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      throw new Error("Protocolo inválido");
    }
    return parsed.toString();
  } catch (_e) {
    return TRUSTED_FALLBACK_ORIGIN;
  }
};

// Rate limiting store
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const checkRateLimit = (identifier: string, maxRequests: number = 5, windowMs: number = 15 * 60 * 1000): boolean => {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);
  
  if (!record || now > record.resetTime) {
    rateLimitStore.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (record.count >= maxRequests) {
    logStep("Rate limit exceeded", { identifier, count: record.count });
    return false;
  }
  
  record.count++;
  return true;
};

// Cleanup old rate limit entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 60000);

// Mapeamento dos tipos de serviço para os price_ids do Stripe
const SERVICE_PRICES: Record<string, { priceId: string; name: string }> = {
  "individual": { 
    priceId: "price_1SQNJv2EoHHPABdIGNldgDeZ", 
    name: "Terapia Individual" 
  },
  "casal": { 
    priceId: "price_1SQNS72EoHHPABdIKxkd37Pr", 
    name: "Terapia de Casal" 
  },
  "familiar": { 
    priceId: "price_1SQNcY2EoHHPABdIo4PFDe34", 
    name: "Terapia Familiar" 
  },
  "consultoria": { 
    priceId: "price_1S4Kgv2EoHHPABdItORxIuRB", 
    name: "Consultoria Organizacional" 
  }
};

serve(async (req) => {
  const corsHeaders = buildCorsHeaders(req);
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const jwtCheck = await validateOptionalJWT(req, corsHeaders);
    if (jwtCheck.error) {
      logStep("Rejected: invalid JWT");
      return jwtCheck.error;
    }

    // Validate content-type
    const contentType = req.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      logStep("Invalid content-type", { contentType });
      return new Response(
        JSON.stringify({ error: "Content-Type deve ser application/json" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Check payload size
    const contentLength = req.headers.get("content-length");
    if (contentLength && parseInt(contentLength) > 10240) {
      logStep("Payload too large", { contentLength });
      return new Response(
        JSON.stringify({ error: "Requisição muito grande" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 413,
        }
      );
    }

    // Rate limiting - use IP address as identifier
    const clientIp = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    if (!checkRateLimit(clientIp, 5, 15 * 60 * 1000)) {
      return new Response(
        JSON.stringify({ error: "Muitas requisições. Tente novamente em 15 minutos." }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 429,
        }
      );
    }

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    const requestData = await req.json();
    logStep("Request data received", { 
      serviceType: requestData.serviceType,
      hasAppointmentData: !!requestData.appointmentData 
    });

    // Validar tipo de serviço
    const serviceType = requestData.serviceType;
    const serviceConfig = SERVICE_PRICES[serviceType];
    
    if (!serviceConfig) {
      logStep("Invalid service type", { serviceType });
      return new Response(
        JSON.stringify({ error: "Tipo de serviço inválido" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Extrair e validar dados do agendamento
    const appointmentData = requestData.appointmentData;
    if (!appointmentData || typeof appointmentData !== 'object') {
      return new Response(
        JSON.stringify({ error: "Dados de agendamento inválidos" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Validate required fields
    if (!appointmentData.email || !validateEmail(appointmentData.email)) {
      logStep("Invalid email", { email: appointmentData.email });
      return new Response(
        JSON.stringify({ error: "Email inválido" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    if (!appointmentData.client_name || appointmentData.client_name.length < 2) {
      logStep("Invalid client name");
      return new Response(
        JSON.stringify({ error: "Nome do cliente inválido" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    if (!appointmentData.phone || !validatePhone(appointmentData.phone)) {
      logStep("Invalid phone", { phone: appointmentData.phone });
      return new Response(
        JSON.stringify({ error: "Telefone inválido" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    if (!appointmentData.preferred_date) {
      logStep("Missing preferred date");
      return new Response(
        JSON.stringify({ error: "Data preferida é obrigatória" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Sanitize all input fields
    const sanitizedData = {
      client_name: sanitizeString(appointmentData.client_name, 100),
      email: appointmentData.email.trim().toLowerCase(),
      phone: sanitizeString(appointmentData.phone, 20),
      preferred_date: appointmentData.preferred_date,
      message: sanitizeString(appointmentData.message || "", 2000),
    };

    // Proteção das URLs de redirecionamento vindas do cliente
    const successUrl = validateRedirectUrl(requestData.successUrl || `${TRUSTED_FALLBACK_ORIGIN}/checkout/success`);
    const cancelUrl = validateRedirectUrl(requestData.cancelUrl || `${TRUSTED_FALLBACK_ORIGIN}/checkout/cancel`);

    logStep("Input validation passed", { email: sanitizedData.email });
    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    logStep("Stripe client initialized");

    const customers = await stripe.customers.list({ 
      email: sanitizedData.email, 
      limit: 1 
    });
    
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Existing customer found", { customerId });
    } else {
      const customer = await stripe.customers.create({
        email: sanitizedData.email,
        name: sanitizedData.client_name,
        phone: sanitizedData.phone
      });
      customerId = customer.id;
      logStep("New customer created", { customerId });
    }

    // Criar sessão de checkout com dados sanitizados e URLs validadas
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: serviceConfig.priceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        client_name: sanitizedData.client_name,
        client_email: sanitizedData.email,
        client_phone: sanitizedData.phone,
        preferred_date: sanitizedData.preferred_date,
        message: sanitizedData.message,
        service_type: serviceType
      }
    });

    logStep("Stripe session created successfully", { sessionId: session.id });

    return new Response(
      JSON.stringify({ sessionId: session.id, url: session.url }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error: any) {
    // CORREÇÃO DEFINTIVA: Logs detalhados no servidor, resposta HTTP genérica e limpa para o utilizador
