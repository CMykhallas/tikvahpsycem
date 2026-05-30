import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Lista de IPs suspiciosos ou rotas privadas que exigem cabeçalhos limpos
export function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') || '';
  
  // Bloqueia bots de varrimento agressivo automatizado (Scrapers agressivos)
  if (/headless|python|crawl|spider/i.test(userAgent)) {
    return new Response(JSON.stringify({ error: "Acesso automatizado não autorizado." }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const response = NextResponse.next();

  // Injeta proteção adicional de segurança de frames em tempo de execução
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  
  return response;
}

// Configura o middleware para rodar apenas nas rotas críticas (Checkout, Agendamentos e APIs)
export const config = {
  matcher: ['/api/:path*', '/checkout/:path*', '/supabase/:path*'],
};
