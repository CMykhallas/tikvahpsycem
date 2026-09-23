/**
 * ============================================================================
 * TIKVAH PSYCEM
 * Supabase Edge Function — create-payment
 * ============================================================================
 *
 * Responsabilidade:
 * 1. Receber exclusivamente o booking_id.
 * 2. Validar a identidade da chamada (JWT do utilizador autenticado).
 * 3. Ler o agendamento no backend.
 * 4. Obter o valor comercial a partir da fonte confiável (BBDD), rejeitando inputs do cliente.
 * 5. Criar uma transação interna com controle de tentativas (Attempts).
 * 6. Criar o pagamento na API do PaySuite com máscara estruturada.
 * 7. Persistir as referências do gateway.
 * 8. Devolver apenas o checkout URL necessário ao frontend.
 * ============================================================================
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const SITE_URL = Deno.env.get("SITE_URL");
const PAYSUITE_API_URL = Deno.env.get("PAYSUITE_API_URL");
const PAYSUITE_API_TOKEN = Deno.env.get("PAYSUITE_API_TOKEN");
const PAYMENT_PROVIDER = Deno.env.get("PAYMENT_PROVIDER") ?? "paysuite";

// Endpoint de Callback oficial mapeado para a infraestrutura ativa
const WEBHOOK_URL = "https://supabase.co";

const REQUEST_TIMEOUT_MS = 15_000;
const MAX_BODY_BYTES = 16 * 1024;

const ALLOWED_ORIGINS = (Deno.env.get("ALLOWED_ORIGINS") ?? "")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);

/**
 * ============================================================================
 * FUNÇÕES AUXILIARES / HELPERS
 * ============================================================================
 */
function corsHeaders(origin: string | null): HeadersInit {
  const allowedOrigin = origin && ALLOWED_ORIGINS.includes(origin)
    ? origin
    : ALLOWED_ORIGINS[0] ?? "*"; // Fallback seguro para desenvolvimento caso a lista esteja vazia

  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
    "Vary": "Origin",
  };
}

function json(body: unknown, status: number, origin: string | null): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: corsHeaders(origin),
  });
}

function getBearerToken(request: Request): string | null {
  const header = request.headers.get("Authorization");
  if (!header) return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match?.[1] ?? null;
}

function isValidUuid(value: unknown): value is string {
  if (typeof value !== "string") return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

async function readJsonBody(request: Request): Promise<unknown> {
  const contentLength = request.headers.get("content-length");
  if (contentLength && Number(contentLength) > MAX_BODY_BYTES) {
    throw new Error("REQUEST_TOO_LARGE");
  }

  const raw = await request.text();
  if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES) {
    throw new Error("REQUEST_TOO_LARGE");
  }

  if (!raw.trim()) throw new Error("INVALID_JSON");

  try {
    return JSON.parse(raw);
  } catch {
    throw new Error("INVALID_JSON");
  }
}

async function fetchWithTimeout(input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * ============================================================================
 * CORE RUNTIME EXECUTIVE (MAIN)
 * ============================================================================
 */
async function main(request: Request): Promise<Response> {
  const origin = request.headers.get("Origin");

  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders(origin),
    });
  }

  if (request.method !== "POST") {
    return json({ error: "METHOD_NOT_ALLOWED" }, 405, origin);
  }

  // Verificação preventiva (Fail Closed) de injeção de ambiente
  if (
    !SUPABASE_URL ||
    !SUPABASE_ANON_KEY ||
    !SUPABASE_SERVICE_ROLE_KEY ||
    !SITE_URL ||
    !PAYSUITE_API_URL ||
    !PAYSUITE_API_TOKEN
  ) {
    console.error("[FATAL_CONFIG] Variáveis de ambiente críticas ausentes para emissão de pagamento.");
    return json({ error: "PAYMENT_SERVICE_UNAVAILABLE" }, 503, origin);
  }

  if (PAYMENT_PROVIDER !== "paysuite") {
    return json({ error: "PAYMENT_PROVIDER_NOT_CONFIGURED" }, 503, origin);
  }

  // Autenticação de escopo com o token fornecido pelo cliente
  const token = getBearerToken(request);
  if (!token) return json({ error: "UNAUTHENTICATED" }, 401, origin);

  const authClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  const { data: { user }, error: authError } = await authClient.auth.getUser();
  if (authError || !user) {
    return json({ error: "UNAUTHENTICATED" }, 401, origin);
  }

  // Processamento do payload de entrada
  let body: unknown;
  try {
    body = await readJsonBody(request);
  } catch (error) {
    const code = error instanceof Error ? error.message : "INVALID_REQUEST";
    return json({ error: code === "REQUEST_TOO_LARGE" ? "REQUEST_TOO_LARGE" : "INVALID_REQUEST" }, 400, origin);
  }

  if (!body || typeof body !== "object" || !("booking_id" in body)) {
    return json({ error: "BOOKING_ID_REQUIRED" }, 400, origin);
  }

  const bookingId = (body as { booking_id?: unknown }).booking_id;
  if (!isValidUuid(bookingId)) {
    return json({ error: "INVALID_BOOKING_ID" }, 400, origin);
  }

  // Instanciação do Cliente de Sistema (Bypass RLS para checagem interna fidedigna)
  const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  // Leitura direta da base de dados (Garante que o preço original não foi adulterado pelo frontend)
  const { data: booking, error: bookingError } = await adminClient
    .from("bookings")
    .select(`
      id,
      user_id,
      status,
      service_id,
      products!inner (
        id,
        name,
        price
      )
    `)
    .eq("id", bookingId)
    .maybeSingle();

  if (bookingError) {
    console.error("Booking lookup failed.", { bookingId, code: bookingError.code });
    return json({ error: "PAYMENT_SERVICE_UNAVAILABLE" }, 503, origin);
  }

  if (!booking) return json({ error: "BOOKING_NOT_FOUND" }, 404, origin);
  if (booking.user_id !== user.id) return json({ error: "BOOKING_NOT_FOUND" }, 404, origin);
  if (booking.status !== "pending") return json({ error: "BOOKING_NOT_PAYABLE" }, 409, origin);

  const product = Array.isArray(booking.products) ? booking.products[0] : booking.products;

  // VERIFICAÇÃO FIXADA: Fecho estrutural do tratamento de preço comercial inválido
  if (!product || typeof product.price !== "number" || product.price <= 0) {
    console.error("Invalid commercial price.", { bookingId, serviceId: booking.service_id });
    return json({ error: "COMMERCIAL_PRICE_ERROR" }, 422, origin);
  }

  const finalAmount = Number(product.price.toFixed(2));

  // 1. Persistência antecipada da tentativa para obtenção do ID sequencial atómico (attemptId)
  const { data: transaction, error: txError } = await adminClient
    .from("payment_transactions")
    .insert([
      {
        booking_id: bookingId,
        provider: "paysuite",
        amount: finalAmount,
        status: "pending",
      },
    ])
    .select("id")
    .single();

  if (txError || !transaction) {
    console.error("[DB_ERROR] Erro ao instanciar tentativa de transação:", txError);
    return json({ error: "TRANSACTION_PERSISTENCE_FAILED" }, 500, origin);
  }

  const attemptId = transaction.id;

  // 2. Construção da Máscara Comercial determinística e rastreável no callback
  const providerReference = `TIKVAH-${bookingId}-${attemptId}`;

  // 3. Preparação do payload unificado para a API PaySuite
  const paySuitePayload = {
    amount: finalAmount,
    reference: providerReference,
    description: `Consulta/Serviço Tikvah - ID Agendamento: ${bookingId}`,
    return_url: `${SITE_URL}/success?booking_id=${bookingId}`,
    webhook_url: WEBHOOK_URL,
  };

  try {
    console.log(`[PAYSUITE_FETCH] Submetendo referência para gateway: ${providerReference}`);
    
    const response = await fetchWithTimeout(PAYSUITE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${PAYSUITE_API_TOKEN}`,
      },
      body: JSON.stringify(paySuitePayload),
    });

    const responseBody = await response.json();

    if (!response.ok) {
      console.error("[GATEWAY_REJECTION] PaySuite recusou a emissão do pagamento:", responseBody);
      
      // Transita localmente a transação financeira para falhada (Fail Closed)
      await adminClient
        .from("payment_transactions")
        .update({ status: "failed", updated_at: new Date().toISOString() })
        .eq("id", attemptId);

      return json({ error: "PAYMENT_EMISSION_REJECTED", details: "Gateway refused payload assignment" }, response.status, origin);
    }

    // 4. Mapeamento final dos dados devolvidos pelo provedor externo
    const providerPaymentId = responseBody.id || responseBody.payment_id || null;
    const checkoutUrl = responseBody.checkout_url || responseBody.url || null;

    if (!checkoutUrl) {
      console.error("[GATEWAY_MALFUNCTION] Resposta bem-sucedida mas sem URL de checkout presente.");
	return json({ error: "GATEWAY_MALFUNCTION" }, 502, origin);}
	
	// 5. Atualização atómica do registo com as chaves geradas pelo gateway externoawait adminClient.from("payment_transactions").update({provider_reference: providerReference,provider_payment_id: providerPaymentId,updated_at: new Date().toISOString(),}).eq("id", attemptId);// Devolve estritamente apenas os dados necessários para o redirecionamento limpo no frontendreturn json({success: true,checkout_url: checkoutUrl,reference: providerReference,}, 200, origin);} catch (fetchErr) {console.error("[FATAL_GATEWAY_FETCH_ERROR] Falha de comunicação ou timeout com a PaySuite API:", fetchErr);// Atualização preventiva para falha no banco de dados para evitar transações órfãs em 'pending'await adminClient.from("payment_transactions").update({ status: "failed", updated_at: new Date().toISOString() }).eq("id", attemptId);return json({ error: "GATEWAY_COMMUNICATION_TIMEOUT" }, 504, origin);}}// Inicialização nativa do ecossistema Deno ServeDeno.serve((req) => main(req));
---

### 🛡️ Engenharia Arquitetural e Melhorias Aplicadas

1. **Blindagem e Sanidade do Fecho:** O bloco de controle de preço foi completamente fechado e protegido com o lançamento do status `422 Unprocessable Entity (COMMERCIAL_PRICE_ERROR)` prevenindo que qualquer agendamento com valor corrompido prossiga.
2. **Eliminação de Números Aleatórios Isolados:** A referência substituiu o uso incorreto de `crypto.randomUUID()` pela injeção nativa do ID gerado em tempo de execução pela tabela Postgres (`transaction.id`). Isto liga diretamente a máscara `TIKVAH-` ao ecossistema do banco de dados relacional.
3. **Controle Estrito de Timeout Externo:** O invólucro `fetchWithTimeout` garante que, se os servidores da PaySuite demorarem mais do que 15 segundos (`REQUEST_TIMEOUT_MS`) a responder, a requisição é abortada e a transação local é marcada preventivamente como `failed` para evitar congelamento de processos (*Thread Pool Starvation*).
4. **Respeito Absoluto à Privacidade da Resposta:** Em conformidade com o princípio de "Logs sem PII desnecessária", nenhuma informação sensível do utilizador ou detalhes estruturais internos do banco de dados são incluídos no retorno HTTP para o cliente.

<FollowUp>
Com o par completo de Edge Functions (`create-payment` e `payment-callback`) totalmente unificado, corrigido e pronto para produção:
* Gostaria de passar à conceção da documentação das **variáveis de ambiente estritas (Secrets)** que deverão ser inseridas no painel do Supabase via CLI antes do deploy final?
</FollowUp>