// Shared CORS helper for Tikvah edge functions.
// Restricts Access-Control-Allow-Origin to a whitelist (production + previews + localhost).
// Webhooks (Stripe, M-Pesa, Google Ads) should keep "*" since they are server-to-server.

const ALLOWED_ORIGINS: ReadonlyArray<string> = [
  "https://tikvahpsycem.lovable.app",
  "https://tikvahpsycem-mz.lovable.app",
  "https://tikvahpsycem.com",
  "https://www.tikvahpsycem.com",
];

const ALLOWED_PATTERNS: ReadonlyArray<RegExp> = [
  /^https:\/\/[a-z0-9-]+\.lovable\.app$/i,
  /^https:\/\/[a-z0-9-]+\.lovable\.dev$/i,
  /^https:\/\/[a-z0-9-]+--[a-z0-9-]+\.lovable\.app$/i,
  /^http:\/\/localhost(:\d+)?$/i,
  /^http:\/\/127\.0\.0\.1(:\d+)?$/i,
];

const BASE_HEADERS = {
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Max-Age": "86400",
  Vary: "Origin",
};

export function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  return ALLOWED_PATTERNS.some((re) => re.test(origin));
}

export function buildCorsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get("origin");
  const allowed = isAllowedOrigin(origin);
  return {
    ...BASE_HEADERS,
    "Access-Control-Allow-Origin": allowed && origin ? origin : ALLOWED_ORIGINS[0],
  };
}
