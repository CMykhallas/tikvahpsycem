import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-google-ads-signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
}

const logStep = (step: string, details?: Record<string, unknown>) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : ''
  console.log(`[GOOGLE-ADS-WEBHOOK] ${step}${detailsStr}`)
}

// Enhanced rate limiting store
const rateLimitStore = new Map<string, { count: number; resetTime: number; blocked: boolean }>()

function isRateLimited(ip: string, limit: number = 100, windowMs: number = 900000): boolean {
  const now = Date.now()
  const record = rateLimitStore.get(ip)
  
  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs, blocked: false })
    return false
  }
  
  if (record.count >= limit) {
    record.blocked = true
    return true
  }
  
  record.count++
  return false
}

async function verifyWebhookSignature(payload: string, signature: string, secret: string): Promise<boolean> {
  try {
    if (!signature || !secret || !payload) {
      return false
    }

    const cleanSignature = signature.replace(/^sha256=/, '')
    
    const encoder = new TextEncoder()
    const keyData = encoder.encode(secret)
    const messageData = encoder.encode(payload)
    
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )
    
    const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, messageData)
    const computedSignature = Array.from(new Uint8Array(signatureBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
    
    // Constant-time comparison to prevent timing attacks
    if (cleanSignature.length !== computedSignature.length) {
      return false
    }
    
    let result = 0
    for (let i = 0; i < cleanSignature.length; i++) {
      result |= cleanSignature.charCodeAt(i) ^ computedSignature.charCodeAt(i)
    }
    
    return result === 0
  } catch (error) {
    logStep('Signature verification error', { error: String(error) })
    return false
  }
}

function sanitizeInput(input: unknown): string {
  if (typeof input === 'string') {
    let sanitized = input
      .replace(/[<>]/g, '')
      .replace(/javascript:/gi, '')

    let previous: string
    do {
      previous = sanitized
      sanitized = sanitized.replace(/on\w+=/gi, '')
    } while (sanitized !== previous)

    return sanitized
      .trim()
      .slice(0, 500)
  }
  return ''
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 254
}

serve(async (req) => {
  const startTime = Date.now()
  const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0] || req.headers.get('x-real-ip') || 'unknown'
  
  // Initialize Supabase client with service_role for secure operations
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: { ...corsHeaders, ...securityHeaders } 
    })
  }

  let responseStatus = 200
  let errorMessage = ''
  let payload: Record<string, unknown> | null = null

  try {
    logStep('Request received', { ip: clientIP, method: req.method })

    // Enhanced rate limiting
    if (isRateLimited(clientIP)) {
      responseStatus = 429
      errorMessage = 'Rate limit exceeded'
      logStep('Rate limit exceeded', { ip: clientIP })
      throw new Error(errorMessage)
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
      responseStatus = 405
      errorMessage = 'Method not allowed'
      throw new Error(errorMessage)
    }

    // Parse and validate payload
    const body = await req.text()
    if (!body) {
      responseStatus = 400
      errorMessage = 'Empty payload'
      throw new Error(errorMessage)
    }

    try {
      payload = JSON.parse(body)
    } catch {
      responseStatus = 400
      errorMessage = 'Invalid JSON payload'
      throw new Error(errorMessage)
    }

    // Enhanced webhook signature verification - MANDATORY (fail closed)
    const signature = req.headers.get('x-google-ads-signature') || ''
    const webhookSecret = Deno.env.get('GOOGLE_ADS_WEBHOOK_SECRET') || ''

    if (!webhookSecret) {
      console.error('GOOGLE_ADS_WEBHOOK_SECRET not configured — refusing all requests')
      responseStatus = 503
      errorMessage = 'Webhook not configured'
      throw new Error(errorMessage)
    }

    const isValidSignature = await verifyWebhookSignature(body, signature, webhookSecret)
    if (!isValidSignature) {
      responseStatus = 401
      errorMessage = 'Invalid webhook signature'
      logStep('Invalid signature', { ip: clientIP })

      await supabase.from('security_incidents').insert({
        incident_type: 'INVALID_WEBHOOK_SIGNATURE',
        severity: 'high',
        ip_address: clientIP,
        user_agent: req.headers.get('user-agent') || '',
        endpoint: '/google-ads-webhook',
        details: { signature_present: !!signature }
      })

      throw new Error(errorMessage)
    }

    // Sanitize and validate lead data
    const leadData = {
      email: sanitizeInput(payload?.email),
      name: sanitizeInput(payload?.name) || 'Lead Google Ads',
      phone: sanitizeInput(payload?.phone) || null,
      campaign_id: sanitizeInput(payload?.campaign_id) || null,
      ad_group_id: sanitizeInput(payload?.ad_group_id) || null,
      keyword: sanitizeInput(payload?.keyword) || null,
      status: 'new',
      metadata: { source: 'google_ads', received_at: new Date().toISOString() }
    }

    // Enhanced validation
    if (!leadData.email || !validateEmail(leadData.email)) {
      responseStatus = 400
      errorMessage = 'Valid email is required'
      throw new Error(errorMessage)
    }

    logStep('Lead data validated', { email: leadData.email })

    // Insert lead into database
    const { error: insertError } = await supabase
      .from('leads')
      .insert(leadData)

    if (insertError) {
      logStep('Database insertion error', { error: insertError.message })
      responseStatus = 500
      errorMessage = 'Failed to save lead data'
      throw new Error(errorMessage)
    }

    // Log successful webhook
    await supabase.from('webhook_logs').insert({
      source: 'google_ads',
      event_type: 'lead_received',
      payload: payload,
      status: 'success'
    })

    logStep('Lead processed successfully', { email: leadData.email, processingTime: Date.now() - startTime })

    return new Response(
      JSON.stringify({ success: true, message: 'Lead processed successfully' }),
      {
        headers: { 'Content-Type': 'application/json', ...corsHeaders, ...securityHeaders },
        status: 200
      }
    )

  } catch (error) {
    logStep('Error processing webhook', { error: String(error), status: responseStatus })
    
    // Log failed webhook
    await supabase.from('webhook_logs').insert({
      source: 'google_ads',
      event_type: 'lead_error',
      payload: payload || {},
      status: 'error'
    }).catch(() => {})

    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Processing failed',
        timestamp: new Date().toISOString()
      }),
      {
        headers: { 'Content-Type': 'application/json', ...corsHeaders, ...securityHeaders },
        status: responseStatus || 500
      }
    )
  }
})
