// =========================================
// SECURE ORDER CREATION ENDPOINT
// Enterprise-grade security implementation
// With field-level encryption for sensitive data
// =========================================

import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@18.5.0';

import { 
  SecurityLogger,
  PriceValidator,
  InputValidator,
  TokenGenerator,
  securityMiddleware,
  validateOptionalJWT
} from '../_shared/security.ts';

import { encryptField } from '../_shared/encryption.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    { auth: { persistSession: false } }
  );

  const logger = new SecurityLogger(supabase);
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
  const userAgent = req.headers.get('user-agent') || 'unknown';

  try {
    console.log('🔒 [CREATE-ORDER] Starting secure order creation');

    // =========================================
    // FASE 0: JWT VALIDATION (optional — allows guest checkout)
    // =========================================
    const jwtCheck = await validateOptionalJWT(req, corsHeaders);
    if (jwtCheck.error) {
      await logger.logIncident({
        incident_type: 'VALIDATION_FAILURE',
        severity: 'high',
        ip_address: ip,
        user_agent: userAgent,
        endpoint: 'create-order',
        details: { reason: 'INVALID_JWT' }
      });
      return jwtCheck.error;
    }
    const authenticatedUserId = jwtCheck.userId;

    // =========================================
    // FASE 1: SECURITY MIDDLEWARE
    // =========================================
    const securityCheck = await securityMiddleware(req, 'create-order', supabase);
    if (securityCheck) {
      console.warn('⚠️ [SECURITY] Request blocked by middleware');
      return new Response(securityCheck.body, {
        status: securityCheck.status,
        headers: { ...corsHeaders, ...Object.fromEntries(securityCheck.headers) }
      });
    }

    // =========================================
    // FASE 2: INPUT VALIDATION & SANITIZATION
    // =========================================
    const requestBody = await req.json();
    const { products, userInfo, paymentMethod } = requestBody;

    console.log('📦 [VALIDATION] Validating order data');

    // Validar estrutura básica
    if (!products || !Array.isArray(products) || products.length === 0) {
      await logger.logIncident({
        incident_type: 'VALIDATION_FAILURE',
        severity: 'medium',
        ip_address: ip,
        user_agent: userAgent,
        endpoint: 'create-order',
        details: { reason: 'INVALID_PRODUCTS_ARRAY' }
      });

      return new Response(JSON.stringify({
        error: 'Invalid products data'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (products.length > 50) {
      await logger.logIncident({
        incident_type: 'VALIDATION_FAILURE',
        severity: 'medium',
        ip_address: ip,
        endpoint: 'create-order',
        details: { reason: 'TOO_MANY_PRODUCTS', count: products.length }
      });

      return new Response(JSON.stringify({
        error: 'Maximum 50 products per order'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Validar e sanitizar informações do usuário
    const validator = new InputValidator(logger);
    
    if (!userInfo || !userInfo.name || !userInfo.email || !userInfo.phone) {
      return new Response(JSON.stringify({
        error: 'Missing required user information'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    let sanitizedName: string;
    try {
      sanitizedName = validator.sanitizeString(userInfo.name, 100, ip, 'create-order');
    } catch (error) {
      return new Response(JSON.stringify({
        error: 'Invalid name format'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (!validator.validateName(sanitizedName)) {
      return new Response(JSON.stringify({
        error: 'Name must be between 2-100 characters and contain only letters'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const email = userInfo.email.toLowerCase().trim();
    if (!validator.validateEmail(email)) {
      await logger.logIncident({
        incident_type: 'VALIDATION_FAILURE',
        severity: 'medium',
        ip_address: ip,
        endpoint: 'create-order',
        details: { reason: 'INVALID_EMAIL', email: email.slice(0, 10) + '***' }
      });

      return new Response(JSON.stringify({
        error: 'Invalid email address'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const phone = userInfo.phone.replace(/[^\d+()-\s]/g, '');
    if (!validator.validatePhone(phone)) {
      return new Response(JSON.stringify({
        error: 'Invalid phone number format'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (!['mpesa', 'stripe', 'bank_transfer'].includes(paymentMethod)) {
      return new Response(JSON.stringify({
        error: 'Invalid payment method'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // =========================================
    // FASE 3: PRICE VALIDATION (CRÍTICO!)
    // =========================================
    console.log('💰 [SECURITY] Validating prices server-side');

    const priceValidator = new PriceValidator(supabase, logger);
    const priceValidation = await priceValidator.validateOrder(products, ip, 'create-order');

    if (!priceValidation.isValid) {
      console.error('🚨 [FRAUD ATTEMPT] Price manipulation detected!', {
        ip,
        tamperedProducts: priceValidation.tamperedProducts,
        expectedTotal: priceValidation.expectedTotal,
        attemptedTotal: priceValidation.actualTotal
      });

      return new Response(JSON.stringify({
        error: 'Price validation failed',
        code: 'PRICE_MISMATCH',
        details: priceValidation.tamperedProducts
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log('✅ [VALIDATION] Price validation passed', {
      total: priceValidation.expectedTotal,
      productsCount: priceValidation.validatedProducts?.length
    });

    // =========================================
    // FASE 4: TOKEN GENERATION (Pedidos Anônimos)
    // =========================================
    const orderToken = TokenGenerator.generateOrderToken();

    // =========================================
    // FASE 5: ENCRYPT SENSITIVE FIELDS
    // =========================================
    console.log('🔐 [SECURITY] Encrypting sensitive fields');

    // Encrypt phone number and access token
    const encryptedPhone = await encryptField(phone);
    const encryptedToken = await encryptField(orderToken.token);

    // =========================================
    // FASE 6: ORDER CREATION
    // =========================================
    console.log('📝 [DATABASE] Creating order with validated data');

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        amount: Math.round(priceValidation.expectedTotal * 100), // Centavos - SEMPRE usar preço validado!
        status: 'pending',
        payment_method: paymentMethod,
        products: priceValidation.validatedProducts, // Produtos validados
        metadata: {
          customer_name: sanitizedName,
          customer_email: email,
          // Phone stored encrypted in dedicated field
          ip_address: ip,
          user_agent: userAgent,
          validated: true,
          validation_timestamp: new Date().toISOString(),
          encryption_version: 1
        },
        order_access_token: JSON.stringify(encryptedToken),
        token_expires_at: orderToken.expiresAt.toISOString(),
        phone_number: JSON.stringify(encryptedPhone),
        user_id: authenticatedUserId // Null for guest, bound to auth user when logged in
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error('❌ [DATABASE ERROR]', orderError);
      throw new Error('Failed to create order');
    }

    console.log('✅ [SUCCESS] Order created', { orderId: order.id, total: order.amount });

    // =========================================
    // FASE 7: PAYMENT PROCESSING
    // =========================================
    let checkoutUrl: string | null = null;

    if (paymentMethod === 'stripe') {
      console.log('💳 [STRIPE] Creating checkout session');

      const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
        apiVersion: '2025-08-27.basil',
      });

      const lineItems = priceValidation.validatedProducts!.map(product => ({
        price_data: {
          currency: 'mzn',
          product_data: {
            name: product.name,
          },
          unit_amount: Math.round(product.price_after_discount * 100), // Centavos
        },
        quantity: product.quantity,
      }));

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${req.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`,
        cancel_url: `${req.headers.get('origin')}/loja`,
        metadata: {
          order_id: order.id,
        },
      });

      // Atualizar order com session ID
      await supabase
        .from('orders')
        .update({ stripe_session_id: session.id })
        .eq('id', order.id);

      checkoutUrl = session.url;
    }

    // Log de sucesso
    await logger.logIncident({
      incident_type: 'VALIDATION_FAILURE', // Reutilizar tipo existente
      severity: 'low',
      ip_address: ip,
      endpoint: 'create-order',
      details: {
        orderId: order.id,
        amount: order.amount,
        paymentMethod,
        productsCount: priceValidation.validatedProducts!.length,
        event: 'ORDER_CREATED_SUCCESSFULLY'
      }
    });

    return new Response(JSON.stringify({
      success: true,
      orderId: order.id,
      total: priceValidation.expectedTotal,
      order: {
        id: order.id,
        amount: order.amount,
        status: order.status,
        accessToken: orderToken.token // Para rastreamento anônimo
      },
      checkoutUrl
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ [EXCEPTION]', error);

    await logger.logIncident({
      incident_type: 'VALIDATION_FAILURE',
      severity: 'high',
      ip_address: ip,
      user_agent: userAgent,
      endpoint: 'create-order',
      details: {
        error: error.message,
        stack: error.stack
      }
    });

    return new Response(JSON.stringify({
      success: false,
      error: 'Erro ao criar pedido',
      code: 'INTERNAL_ERROR'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
