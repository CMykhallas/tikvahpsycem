import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2";
import { validateOptionalJWT } from "../_shared/security.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

// Validation utilities
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
};

const sanitizeString = (input: string, maxLength: number = 1000): string => {
  if (!input || typeof input !== 'string') return '';
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .trim()
    .slice(0, maxLength);
};

const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\d\s\-\+\(\)]{8,20}$/;
  return phoneRegex.test(phone);
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
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    // Server-side JWT validation (optional — guest checkout allowed).
    // If an Authorization header is provided, it MUST be a valid Supabase JWT.
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

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

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

    logStep("Input validation passed", { email: sanitizedData.email });

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    logStep("Stripe client initialized");

    // Verificar se já existe um cliente Stripe
    const customers = await stripe.customers.list({ 
      email: sanitizedData.email, 
      limit: 1 
    });
    
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Existing customer found", { customerId });
    }

    // Criar sessão de checkout com dados sanitizados
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : sanitizedData.email,
      line_items: [
        {
          price: serviceConfig.priceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/obrigado?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/appointment`,
      metadata: {
        client_name: sanitizedData.client_name,
        phone: sanitizedData.phone,
        email: sanitizedData.email,
        service_type: serviceType,
        preferred_date: sanitizedData.preferred_date,
      },
    });

    logStep("Checkout session created", { 
      sessionId: session.id, 
      customerId: session.customer 
    });

    // Salvar agendamento no banco com status pending_payment (dados sanitizados)
    const { error: appointmentError } = await supabaseClient
      .from("appointments")
      .insert({
        client_name: sanitizedData.client_name,
        email: sanitizedData.email,
        phone: sanitizedData.phone,
        service_type: serviceType,
        preferred_date: sanitizedData.preferred_date,
        message: sanitizedData.message,
        status: "pending_payment",
      });

    if (appointmentError) {
      logStep("Error saving appointment", { error: appointmentError.message });
      // Não bloquear o checkout se houver erro ao salvar
    } else {
      logStep("Appointment saved successfully");
    }

    return new Response(
      JSON.stringify({ 
        url: session.url,
        sessionId: session.id 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in create-checkout", { message: errorMessage });
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
