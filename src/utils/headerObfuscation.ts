/**
 * HEADER OBFUSCATION MIDDLEWARE
 * Remove/Mask fingerprinting headers que revelam stack
 * Implementar no Nginx/Edge ou como middleware Node
 */

// =========================================
// SERVER HEADERS OBFUSCATION (Vite Config)
// =========================================
export const headerObfuscationMiddleware = (req, res, next) => {
  // Remove headers que revelam a stack
  res.removeHeader('X-Powered-By');
  res.removeHeader('Server');
  
  // Definir headers genéricos/falsos para enganar scanners
  res.setHeader('Server', 'Apache/2.4.41 (Ubuntu)'); // Falso, enganar scanners
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Remover headers que revelam versões
  res.removeHeader('X-AspNet-Version');
  res.removeHeader('X-Runtime');
  
  // CSP ultra-restritivo
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net; " +
    "img-src 'self' data: https:; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "connect-src 'self' https://*.supabase.co https://api.stripe.com https://api.resend.com; " +
    "media-src 'self'; " +
    "object-src 'none'; " +
    "base-uri 'self'; " +
    "form-action 'self'; " +
    "frame-ancestors 'none'; " +
    "upgrade-insecure-requests;"
  );
  
  // Permissões restritivas
  res.setHeader(
    'Permissions-Policy',
    'accelerometer=(), camera=(), geolocation=(), gyroscope=(), ' +
    'magnetometer=(), microphone=(), payment=(), usb=(), ' +
    'interest-cohort=(), sync-xhr=(self), fullscreen=(self)'
  );
  
  // HSTS - Força HTTPS
  res.setHeader(
    'Strict-Transport-Security',
    'max-age=63072000; includeSubDomains; preload'
  );
  
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Referrer Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Mascarar informações de erro
  res.setHeader('X-Error-Detail', 'hidden');
  
  next();
};

// =========================================
// ERROR MASKING MIDDLEWARE
// Não expor stack traces em produção
// =========================================
export const errorMaskingMiddleware = (err, req, res, next) => {
  const isDevelopment = import.meta.env.DEV;
  
  const errorResponse = {
    error: 'Internal Server Error',
    code: err.code || 'INTERNAL_ERROR',
    ...(isDevelopment && {
      // Em dev, mostrar detalhes (mas NUNCA em produção)
      message: err.message,
      stack: err.stack
    })
  };
  
  // Log real do erro internamente
  console.error('🚨 ERROR OCCURRED:', {
    message: err.message,
    stack: err.stack,
    timestamp: new Date().toISOString(),
    ip: req.ip,
    path: req.path
  });
  
  res.status(500).json(errorResponse);
};

// =========================================
// RESPONSE TIME RANDOMIZATION
// Evitar timing attacks
// =========================================
export const responseTimeRandomizer = (req, res, next) => {
  // Adicionar delay aleatório (10-100ms) para mascarar padrões
  const randomDelay = Math.random() * 90 + 10;
  
  const originalSend = res.send;
  res.send = function(data) {
    setTimeout(() => {
      originalSend.call(res, data);
    }, randomDelay);
  };
  
  next();
};

// =========================================
// FAKE HEADER INJECTION
// Simular softwares que você NÃO usa
// =========================================
export const fakeHeaderInjection = (req, res, next) => {
  // Fake headers para enganar fingerprinting automático
  res.setHeader('X-Git-Commit', 'a1b2c3d4e5f6g7h8i9j0');
  res.setHeader('X-Build-Time', new Date().toISOString());
  res.setHeader('X-Cache-Control', 'max-age=3600, public');
  res.setHeader('X-API-Gateway', 'cloudflare-enterprise');
  res.setHeader('X-CDN-Provider', 'akamai');
  res.setHeader('X-Protection-System', 'imperva');
  
  // Versões falsas
  res.setHeader('X-Framework-Version', '3.14.159'); // Fake version
  res.setHeader('X-API-Version', 'v2.7.1');
  
  next();
};

// =========================================
// NGINX CONFIGURATION (para implementar)
// =========================================
/*
# nginx.conf

# Hide nginx version
server_tokens off;

# Custom error pages (não expor versão)
error_page 404 /404.html;
error_page 500 502 503 504 /50x.html;

# Mascarar headers padrão
proxy_hide_header X-Powered-By;
proxy_hide_header X-AspNet-Version;
proxy_hide_header X-AspNetMvc-Version;
proxy_hide_header X-Runtime;

# Adicionar headers custom
add_header Server "Apache/2.4.41 (Ubuntu)" always;
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;

# CSP Headers
add_header Content-Security-Policy "default-src 'self'; script-src 'self'" always;

# HSTS
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;

# Limpar headers que revelam a stack
map $http_user_agent $block_agent {
  default 0;
  "~*bot|crawler|spider" 1;
  "~*scanner|nikto|nmap" 1;
}

if ($block_agent) {
  return 403;
}
*/

export default {
  headerObfuscationMiddleware,
  errorMaskingMiddleware,
  responseTimeRandomizer,
  fakeHeaderInjection
};
