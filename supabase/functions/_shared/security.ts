// =========================================
// ENTERPRISE-GRADE SECURITY UTILITIES
// =========================================

import { createClient, SupabaseClient } from 'npm:@supabase/supabase-js@2';

// =========================================
// TYPES & INTERFACES
// =========================================

export interface SecurityIncident {
  incident_type: 'PRICE_TAMPERING' | 'RATE_LIMIT' | 'VALIDATION_FAILURE' | 'XSS_ATTEMPT' | 'SQL_INJECTION' | 'SUSPICIOUS_PATTERN';
  severity: 'low' | 'medium' | 'high' | 'critical';
  ip_address: string;
  user_agent?: string;
  user_id?: string;
  endpoint: string;
  details: Record<string, any>;
}

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  blockDurationMs: number;
}

export interface PriceValidationResult {
  isValid: boolean;
  expectedTotal: number;
  actualTotal: number;
  discrepancy: number;
  tamperedProducts?: string[];
  validatedProducts?: Array<{
    id: string;
    price_after_discount: number;
    quantity: number;
    name: string;
  }>;
}

export interface OrderToken {
  token: string;
  expiresAt: Date;
}

// =========================================
// SECURITY LOGGER
// =========================================

export class SecurityLogger {
  private supabase: SupabaseClient;

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  async logIncident(incident: SecurityIncident): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('security_incidents')
        .insert({
          incident_type: incident.incident_type,
          severity: incident.severity,
          ip_address: incident.ip_address,
          user_agent: incident.user_agent,
          user_id: incident.user_id,
          endpoint: incident.endpoint,
          details: incident.details,
          created_at: new Date().toISOString()
        });

      if (error) {
        console.error('[SECURITY LOG ERROR]', error);
      }

      // Log crítico também no console para visibilidade imediata
      if (incident.severity === 'critical') {
        console.error('🚨 CRITICAL SECURITY INCIDENT:', {
          type: incident.incident_type,
          ip: incident.ip_address,
          endpoint: incident.endpoint,
          details: incident.details
        });
      }
    } catch (error) {
      console.error('[SECURITY LOGGER EXCEPTION]', error);
    }
  }
}

// =========================================
// ADVANCED RATE LIMITER
// =========================================

export class AdvancedRateLimiter {
  private supabase: SupabaseClient;
  private logger: SecurityLogger;
  
  private readonly configs: Record<string, RateLimitConfig> = {
    'create-order': {
      windowMs: 900000,      // 15 minutos
      maxRequests: 5,        // 5 pedidos
      blockDurationMs: 3600000 // 1 hora de bloqueio
    },
    'create-order-guest': {
      windowMs: 1800000,     // 30 minutos
      maxRequests: 2,        // 2 pedidos para não autenticados
      blockDurationMs: 7200000 // 2 horas de bloqueio
    },
    'process-mpesa-payment': {
      windowMs: 300000,      // 5 minutos
      maxRequests: 5,
      blockDurationMs: 1800000 // 30 minutos
    }
  };

  constructor(supabase: SupabaseClient, logger: SecurityLogger) {
    this.supabase = supabase;
    this.logger = logger;
  }

  async checkRateLimit(
    ip: string,
    endpoint: string,
    userId?: string
  ): Promise<{ allowed: boolean; retryAfter?: number; reason?: string }> {
    try {
      // 1. Verificar blacklist permanente
      const { data: blacklisted } = await this.supabase
        .from('ip_blacklist')
        .select('*')
        .eq('ip_address', ip)
        .maybeSingle();
        
      if (blacklisted && (!blacklisted.expires_at || new Date(blacklisted.expires_at) > new Date())) {
        await this.logger.logIncident({
          incident_type: 'RATE_LIMIT',
          severity: 'high',
          ip_address: ip,
          endpoint,
          details: { reason: 'IP_BLACKLISTED', blacklist_reason: blacklisted.reason }
        });
        
        return { 
          allowed: false, 
          reason: 'IP_BLACKLISTED',
          retryAfter: 86400 // 24h
        };
      }
      
      const key = userId ? `${endpoint}:user:${userId}` : `${endpoint}:ip:${ip}`;
      const config = this.configs[userId ? endpoint : `${endpoint}-guest`] || this.configs[endpoint];
      
      if (!config) {
        console.warn(`No rate limit config for endpoint: ${endpoint}`);
        return { allowed: true };
      }

      // 2. Buscar rate limit atual
      const { data: rateLimit } = await this.supabase
        .from('rate_limits')
        .select('*')
        .eq('key', key)
        .maybeSingle();
      
      const now = Date.now();
      
      // 3. Verificar se está em período de bloqueio
      if (rateLimit?.blocked_until && now < new Date(rateLimit.blocked_until).getTime()) {
        const retryAfter = Math.ceil((new Date(rateLimit.blocked_until).getTime() - now) / 1000);
        return {
          allowed: false,
          retryAfter,
          reason: 'RATE_LIMIT_BLOCKED'
        };
      }
      
      // 4. Resetar janela se expirou
      if (!rateLimit || now > new Date(rateLimit.reset_time).getTime()) {
        await this.supabase.from('rate_limits').upsert({
          key,
          count: 1,
          reset_time: new Date(now + config.windowMs).toISOString(),
          blocked_until: null,
          first_request_at: new Date(now).toISOString()
        });
        return { allowed: true };
      }
      
      // 5. Incrementar contador
      const newCount = rateLimit.count + 1;
      
      if (newCount > config.maxRequests) {
        // BLOQUEIO ATIVADO
        const blockedUntil = new Date(now + config.blockDurationMs).toISOString();
        
        await this.supabase.from('rate_limits').update({
          count: newCount,
          blocked_until: blockedUntil
        }).eq('key', key);
        
        // Log de abuso
        await this.logger.logIncident({
          incident_type: 'RATE_LIMIT',
          severity: 'high',
          ip_address: ip,
          user_id: userId,
          endpoint,
          details: {
            key,
            attempts: newCount,
            limit: config.maxRequests,
            blockDuration: config.blockDurationMs
          }
        });
        
        return {
          allowed: false,
          retryAfter: Math.ceil(config.blockDurationMs / 1000),
          reason: 'RATE_LIMIT_EXCEEDED'
        };
      }
      
      // 6. Atualizar contador
      await this.supabase.from('rate_limits').update({
        count: newCount
      }).eq('key', key);
      
      return { allowed: true };
      
    } catch (error) {
      console.error('[RATE LIMITER ERROR]', error);
      // Falhar aberto em caso de erro (permitir requisição)
      return { allowed: true };
    }
  }
  
  async detectSuspiciousPattern(ip: string): Promise<boolean> {
    try {
      const oneHourAgo = new Date(Date.now() - 3600000).toISOString();
      
      const { data: incidents } = await this.supabase
        .from('security_incidents')
        .select('*')
        .eq('ip_address', ip)
        .gte('created_at', oneHourAgo);
      
      if (!incidents) return false;
      
      const priceManipulations = incidents.filter(i => 
        i.incident_type === 'PRICE_TAMPERING'
      ).length;
      
      const rateLimitViolations = incidents.filter(i => 
        i.incident_type === 'RATE_LIMIT'
      ).length;
      
      // Se detectar 3+ tentativas de manipulação OU 5+ violações de rate limit
      if (priceManipulations >= 3 || rateLimitViolations >= 5) {
        // Blacklist automático
        await this.supabase.from('ip_blacklist').insert({
          ip_address: ip,
          reason: 'AUTOMATED_ATTACK_PATTERN',
          expires_at: new Date(Date.now() + 86400000).toISOString(), // 24h
          metadata: {
            priceManipulations,
            rateLimitViolations,
            detectedAt: new Date().toISOString()
          }
        });
        
        await this.logger.logIncident({
          incident_type: 'SUSPICIOUS_PATTERN',
          severity: 'critical',
          ip_address: ip,
          endpoint: 'auto-detection',
          details: {
            priceManipulations,
            rateLimitViolations,
            action: 'IP_BLACKLISTED'
          }
        });
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('[PATTERN DETECTION ERROR]', error);
      return false;
    }
  }
}

// =========================================
// PRICE VALIDATOR
// =========================================

export class PriceValidator {
  private readonly TOLERANCE = 0.01; // 1 centavo de tolerância
  private supabase: SupabaseClient;
  private logger: SecurityLogger;
  
  constructor(supabase: SupabaseClient, logger: SecurityLogger) {
    this.supabase = supabase;
    this.logger = logger;
  }

  async validateOrder(
    clientProducts: Array<{id: string; price_after_discount: number; quantity: number}>,
    ip: string,
    endpoint: string
  ): Promise<PriceValidationResult> {
    try {
      const productIds = clientProducts.map(p => p.id);
      
      // Buscar preços reais do banco
      const { data: dbProducts, error } = await this.supabase
        .from('products')
        .select('id, name, price_after_discount, active, stock_quantity')
        .in('id', productIds);

      if (error) {
        console.error('[PRICE VALIDATION ERROR]', error);
        throw new Error('Cannot validate prices');
      }

      if (!dbProducts || dbProducts.length === 0) {
        await this.logger.logIncident({
          incident_type: 'PRICE_TAMPERING',
          severity: 'critical',
          ip_address: ip,
          endpoint,
          details: {
            reason: 'NO_PRODUCTS_FOUND',
            requestedIds: productIds
          }
        });
        
        return {
          isValid: false,
          expectedTotal: 0,
          actualTotal: 0,
          discrepancy: 0,
          tamperedProducts: ['No products found in database']
        };
      }

      const dbProductMap = new Map(dbProducts.map(p => [p.id, p]));
      const tamperedProducts: string[] = [];
      const validatedProducts: Array<any> = [];
      
      for (const clientProduct of clientProducts) {
        const dbProduct = dbProductMap.get(clientProduct.id);
        
        // Validações de existência e status
        if (!dbProduct) {
          tamperedProducts.push(`${clientProduct.id}: Product not found`);
          continue;
        }
        
        // Verificar se produto está ativo (considerar null como ativo)
        if (dbProduct.active === false) {
          tamperedProducts.push(`${clientProduct.id}: Product inactive`);
          continue;
        }
        
        // Verificar stock (considerar null como estoque ilimitado)
        if (dbProduct.stock_quantity !== null && dbProduct.stock_quantity < clientProduct.quantity) {
          tamperedProducts.push(`${clientProduct.id}: Insufficient stock (${dbProduct.stock_quantity} available, ${clientProduct.quantity} requested)`);
          continue;
        }
        
        // Comparar preços
        const priceDiff = Math.abs(
          dbProduct.price_after_discount - clientProduct.price_after_discount
        );
        
        if (priceDiff > this.TOLERANCE) {
          tamperedProducts.push(
            `${clientProduct.id}: Price mismatch - Expected ${dbProduct.price_after_discount} MZN, Got ${clientProduct.price_after_discount} MZN`
          );
        } else {
          // Produto válido
          validatedProducts.push({
            id: dbProduct.id,
            name: dbProduct.name,
            price_after_discount: dbProduct.price_after_discount,
            quantity: clientProduct.quantity
          });
        }
      }

      // Calcular totais
      const expectedTotal = validatedProducts.reduce((sum, p) => 
        sum + (p.price_after_discount * p.quantity), 0
      );

      const actualTotal = clientProducts.reduce((sum, p) => 
        sum + (p.price_after_discount * p.quantity), 0
      );

      const discrepancy = Math.abs(expectedTotal - actualTotal);
      const isValid = tamperedProducts.length === 0 && discrepancy <= this.TOLERANCE;

      // Log tentativa de fraude
      if (!isValid) {
        await this.logger.logIncident({
          incident_type: 'PRICE_TAMPERING',
          severity: 'critical',
          ip_address: ip,
          endpoint,
          details: {
            tamperedProducts,
            expectedTotal,
            attemptedTotal: actualTotal,
            discrepancy,
            clientProducts: clientProducts.map(p => ({
              id: p.id,
              attemptedPrice: p.price_after_discount,
              quantity: p.quantity
            }))
          }
        });
      }

      return {
        isValid,
        expectedTotal,
        actualTotal,
        discrepancy,
        tamperedProducts: tamperedProducts.length > 0 ? tamperedProducts : undefined,
        validatedProducts: isValid ? validatedProducts : undefined
      };
      
    } catch (error) {
      console.error('[PRICE VALIDATOR EXCEPTION]', error);
      throw error;
    }
  }
}

// =========================================
// INPUT SANITIZER & VALIDATOR
// =========================================

export class InputValidator {
  private logger: SecurityLogger;
  
  private static readonly XSS_PATTERNS = [
    /<script\b[^<]*(?:(?!<\/script\b[^>]*>)<[^<]*)*<\/script\b[^>]*>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe/gi,
    /<object/gi,
    /<embed/gi,
    /data:text\/html/gi
  ];
  
  private static readonly SQL_PATTERNS = [
    /(\bUNION\b|\bSELECT\b|\bINSERT\b|\bUPDATE\b|\bDELETE\b|\bDROP\b)/gi,
    /(--|;|\/\*|\*\/)/g
  ];

  constructor(logger: SecurityLogger) {
    this.logger = logger;
  }

  sanitizeString(input: string, maxLength: number = 1000, ip: string = 'unknown', endpoint: string = 'unknown'): string {
    const original = input;
    
    let sanitized = input
      .trim()
      .slice(0, maxLength)
      .replace(/[<>]/g, '') // Remove < e >
      .replace(/[^\x20-\x7E\u00C0-\u024F\s]/g, ''); // Remove caracteres especiais exceto latinos e espaços
    
    // Verificar padrões maliciosos
    for (const pattern of InputValidator.XSS_PATTERNS) {
      if (pattern.test(original)) {
        this.logger.logIncident({
          incident_type: 'XSS_ATTEMPT',
          severity: 'critical',
          ip_address: ip,
          endpoint,
          details: {
            input: original.slice(0, 100),
            pattern: pattern.toString()
          }
        });
        throw new Error('Malicious input detected: XSS attempt');
      }
    }
    
    for (const pattern of InputValidator.SQL_PATTERNS) {
      if (pattern.test(original)) {
        this.logger.logIncident({
          incident_type: 'SQL_INJECTION',
          severity: 'critical',
          ip_address: ip,
          endpoint,
          details: {
            input: original.slice(0, 100),
            pattern: pattern.toString()
          }
        });
        throw new Error('Malicious input detected: SQL injection attempt');
      }
    }
    
    return sanitized;
  }
  
  validateEmail(email: string): boolean {
    if (!email || email.length > 255) return false;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return false;
    
    // Blacklist emails descartáveis
    const disposableDomains = [
      'tempmail.com', '10minutemail.com', 'guerrillamail.com',
      'throwaway.email', 'temp-mail.org', 'mailinator.com'
    ];
    const domain = email.split('@')[1]?.toLowerCase();
    
    return domain ? !disposableDomains.includes(domain) : false;
  }
  
  validatePhone(phone: string): boolean {
    const phoneRegex = /^\+?[0-9\s()-]{7,20}$/;
    return phoneRegex.test(phone);
  }
  
  validateName(name: string): boolean {
    return name.length >= 2 && name.length <= 100 && /^[a-zA-ZÀ-ÿ\s'-]+$/.test(name);
  }
}

// =========================================
// TOKEN GENERATOR
// =========================================

export class TokenGenerator {
  static generateOrderToken(): OrderToken {
    const token = crypto.randomUUID() + '-' + Date.now().toString(36);
    
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 dias
    
    return { token, expiresAt };
  }
}

// =========================================
// SECURITY MIDDLEWARE
// =========================================

export async function securityMiddleware(
  req: Request,
  endpoint: string,
  supabase: SupabaseClient
): Promise<Response | null> {
  
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 
             req.headers.get('x-real-ip') || 
             'unknown';
  const userAgent = req.headers.get('user-agent') || 'unknown';
  
  const logger = new SecurityLogger(supabase);
  
  // 1. Validar User-Agent (detectar bots)
  if (!userAgent || userAgent.length < 10 || 
      /bot|crawler|spider|scraper/i.test(userAgent)) {
    
    await logger.logIncident({
      incident_type: 'VALIDATION_FAILURE',
      severity: 'medium',
      ip_address: ip,
      user_agent: userAgent,
      endpoint,
      details: { reason: 'INVALID_USER_AGENT' }
    });
    
    return new Response(JSON.stringify({
      error: 'Invalid request'
    }), { 
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // 2. Rate limiting
  const rateLimiter = new AdvancedRateLimiter(supabase, logger);
  const rateCheck = await rateLimiter.checkRateLimit(ip, endpoint);
  
  if (!rateCheck.allowed) {
    return new Response(JSON.stringify({
      error: 'Rate limit exceeded',
      retryAfter: rateCheck.retryAfter,
      reason: rateCheck.reason
    }), { 
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(rateCheck.retryAfter || 3600),
        'X-RateLimit-Limit': '5',
        'X-RateLimit-Remaining': '0'
      }
    });
  }
  
  // 3. Detecção de padrões suspeitos
  const isSuspicious = await rateLimiter.detectSuspiciousPattern(ip);
  
  if (isSuspicious) {
    return new Response(JSON.stringify({
      error: 'Access denied',
      reason: 'SUSPICIOUS_ACTIVITY_DETECTED'
    }), { 
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  return null; // Permitir requisição
}

// =========================================
// JWT VALIDATION (Server-side)
// =========================================
// Validates the Authorization bearer token when present.
// - If header is missing/empty → returns { userId: null } (allows guest flows).
// - If header is present but invalid/expired → returns { error: Response }
//   and the caller must short-circuit with a 401.
// Uses the anon client + getClaims() to verify the JWT signature server-side.
export async function validateOptionalJWT(
  req: Request,
  corsHeaders: Record<string, string>
): Promise<{ userId: string | null; email: string | null; error: Response | null }> {
  const authHeader = req.headers.get('Authorization') || req.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { userId: null, email: null, error: null };
  }

  const token = authHeader.replace('Bearer ', '').trim();

  // Treat common public/anon sentinels as "no user"
  if (!token || token.length < 20) {
    return { userId: null, email: null, error: null };
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { data, error } = await supabase.auth.getClaims(token);

    if (error || !data?.claims) {
      // Header provided but invalid → reject
      return {
        userId: null,
        email: null,
        error: new Response(
          JSON.stringify({ error: 'Unauthorized: invalid or expired token' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        ),
      };
    }

    return {
      userId: (data.claims.sub as string) ?? null,
      email: (data.claims.email as string) ?? null,
      error: null,
    };
  } catch (_e) {
    // If it looks like a JWT but verification threw, reject
    if (token.split('.').length === 3) {
      return {
        userId: null,
        email: null,
        error: new Response(
          JSON.stringify({ error: 'Unauthorized: token verification failed' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        ),
      };
    }
    // Non-JWT (e.g. anon publishable key) → treat as guest
    return { userId: null, email: null, error: null };
  }
}

