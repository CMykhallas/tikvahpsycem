import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

/**
 * ============================================================
 * CONFIGURAÇÃO DO AMBIENTE & PARÂMETROS GLOBAIS
 * ============================================================
 */

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const PAYSUITE_WEBHOOK_SECRET = Deno.env.get("PAYSUITE_WEBHOOK_SECRET");

// Padrão definido para produção: X-Signature ou fallback customizável via Env
const PAYSUITE_SIGNATURE_HEADER = Deno.env.get("PAYSUITE_SIGNATURE_HEADER") ?? "X-Signature";
const PAYSUITE_SIGNATURE_MODE = Deno.env.get("PAYSUITE_SIGNATURE_MODE") ?? "hmac-sha256-hex";
const MAX_BODY_BYTES = 256 * 1024; // Proteção estrita contra Denial of Service (DoS)

/**
 * Mapeamento Dinâmico de Atributos (Dot-Notation nativo)
 * Ajustado para responder estritamente ao contrato real documentado do PaySuite:
 * { "event": "payment.success", "data": { "id": "...", "reference": "...", "amount": 0 } }
 */
const EVENT_TYPE_FIELD = Deno.env.get("PAYSUITE_EVENT_TYPE_FIELD") ?? "event";
const EVENT_ID_FIELD = Deno.env.get("PAYSUITE_EVENT_ID_FIELD") ?? "data.id";
const REFERENCE_FIELD = Deno.env.get("PAYSUITE_REFERENCE_FIELD") ?? "data.reference";
const AMOUNT_FIELD = Deno.env.get("PAYSUITE_AMOUNT_FIELD") ?? "data.amount";

type ProviderPayload = Record<string, unknown>;

/**
 * ============================================================
 * AJUDANTES DE RESPOSTA HTTP (RESPONSE HELPERS)
 * ============================================================
 */
function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}

/**
 * ============================================================
 * AJUDANTES CRIPTOGRÁFICOS & CONVERSORES DE BYTES
 * ============================================================
 */
function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function hexToBytes(value: string): Uint8Array | null {
  const normalized = value.trim();
  if (normalized.length === 0 || normalized.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(normalized)) {
    return null;
  }
  const bytes = new Uint8Array(normalized.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(normalized.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

function base64ToBytes(value: string): Uint8Array | null {
  try {
    const binary = atob(value.trim());
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  } catch {
    return null;
  }
}

/**
 * Comparação Criptográfica em Tempo Constante (Proteção contra Timing Attacks)
 */
function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let difference = 0;
  for (let i = 0; i < a.length; i++) {
    difference |= a[i] ^ b[i];
  }
  return difference === 0;
}

/**
 * Calcula HMAC-SHA256 sobre o RAW BODY original da requisição
 */
async function calculateHmacSha256(secret: string, body: string): Promise<Uint8Array> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(body));
  return new Uint8Array(signature);
}

function normalizeSignature(signature: string): string {
  return signature.trim().replace(/^sha256=/i, "").trim();
}

/**
 * Validação Avançada e Flexível da Assinatura do Callback
 */
async function verifySignature(rawBody: string, signatureHeader: string | null): Promise<boolean> {
  if (!PAYSUITE_WEBHOOK_SECRET || !signatureHeader) return false;

  const expected = await calculateHmacSha256(PAYSUITE_WEBHOOK_SECRET, rawBody);
  const supplied = normalizeSignature(signatureHeader);
  let suppliedBytes: Uint8Array | null = null;

  switch (PAYSUITE_SIGNATURE_MODE) {
    case "hmac-sha256-hex":
      suppliedBytes = hexToBytes(supplied);
      break;
    case "hmac-sha256-base64":
      suppliedBytes = base64ToBytes(supplied);
      break;
    default:
      console.error("[CRYPTO_ERROR] Modo de assinatura não suportado:", PAYSUITE_SIGNATURE_MODE);
      return false;
  }

  if (!suppliedBytes) return false;
  return constantTimeEqual(expected, suppliedBytes);
}

/**
 * ============================================================
 * LEITURA DO CORPO (RAW BODY PARSER)
 * ============================================================
 */
async function readRawBody(request: Request): Promise<string> {
  const contentLength = request.headers.get("content-length");
  if (contentLength && Number(contentLength) > MAX_BODY_BYTES) {
    throw new Error("REQUEST_TOO_LARGE");
  }

  const body = await request.text();
  const size = new TextEncoder().encode(body).byteLength;
  if (size > MAX_BODY_BYTES) {
    throw new Error("REQUEST_TOO_LARGE");
  }
  return body;
}

/**
 * ============================================================
 * RESOLUÇÃO DINÂMICA DE PATHS (DOT-NOTATION RESOLVER)
 * ============================================================
 */
function getField(payload: ProviderPayload, path: string): unknown {
  const parts = path.split(".").filter(Boolean);
  let current: unknown = payload;

  for (const part of parts) {
    if (!current || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}

function normalizeString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const result = value.trim();
  return result || null;
}

/**
 * ============================================================
 * CORE HANDLER (Deno Deployment Entry Point)
 * ============================================================
 */
Deno.serve(async (req: Request) => {
  // 1. Filtragem de Métodos HTTP
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  // 2. Verificação de Integridade das Variáveis de Sistema do Supabase
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error("[FATAL_CONFIG] Variáveis de ambiente do Supabase não configuradas.");
    return json({ error: "Internal server configuration error" }, 500);
  }

  try {
    // 3. Captura Controlada do Raw Body
    const rawBody = await readRawBody(req);

    // 4. Autenticação por Assinatura Criptográfica Externa
    const signatureHeader = req.headers.get(PAYSUITE_SIGNATURE_HEADER);
    const isSignatureValid = await verifySignature(rawBody, signatureHeader);

    if (!isSignatureValid) {
      console.error("[SECURITY_ALERT] Assinatura do Webhook falhou ou cabeçalho ausente.");
      return json({ error: "Invalid cryptographic signature" }, 400);
    }

    // 5. Parseamento Seguro do JSON pós-validação
    const payload = JSON.parse(rawBody) as ProviderPayload;

    // 6. Resolução dos Campos do Contrato através do getField dinâmico
    const eventType = normalizeString(getField(payload, EVENT_TYPE_FIELD));
    const eventId = normalizeString(getField(payload, EVENT_ID_FIELD));
    const reference = normalizeString(getField(payload, REFERENCE_FIELD));
    const amount = getField(payload, AMOUNT_FIELD);

    if (!eventType || !eventId || !reference) {
      console.error("[PARSE_ERROR] Payload incompleto detetado:", { eventType, eventId, reference });
      return json({ error: "Unprocessable payload entity fields" }, 422);
    }

    // 7. Instanciar Cliente Supabase Interno com Bypass de RLS (Service Role)
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // 8. Idempotência Estrita por Banco de Dados (Garante processamento único por Payload)
    const { error: idempotencyError } = await supabase
      .from("payment_webhook_events")
      .insert([{ event_id: eventId, event_type: eventType, payload: payload }]);

    if (idempotencyError && idempotencyError.code === "23505") { // Unique Constraint Violation
      console.warn(`[IDEMPOTENCY] Evento ${eventId} já processado anteriormente. Ignorando.`);
      return json({ received: true, message: "Duplicate payload skipped" }, 200);
    }

    // 9. Mapeamento e Validação da Transação de Origem pela Referência Comercial Mask
    // Máscara Esperada: TIKVAH-{bookingId}-{attemptId}
    const { data: transaction, error: txError } = await supabase
      .from("payment_transactions")
      .select("id, booking_id, status")
      .eq("provider", "paysuite")
      .eq("provider_reference", reference)
      .single();

    if (txError || !transaction) {
      console.error(`[DB_ERROR] Nenhuma transação associada à referência comercial: ${reference}`);
      return json({ error: "Transaction identity mapping failed" }, 404);
    }

    // Se a transação já estiver concluída com sucesso nos nossos registos, encerra o ciclo de forma limpa
    if (transaction.status === "succeeded") {
      return json({ received: true, message: "Transaction already processed as succeeded" }, 200);
    }

    // 10. Orquestração e Mutação Atómica do Estado do Ecossistema
    if (eventType === "payment.success") {
      // Transitar Estado da Transação
      await supabase
        .from("payment_transactions")
        .update({ status: "succeeded", updated_at: new Date().toISOString() })
        .eq("id", transaction.id);
      // Transitar Reserva de forma Segura (Estado permitido pelo enum Postgres de produção)
      const { error: bookingError } = await supabase
        .from("bookings")
        .update({ status: "confirmed", updated_at: new Date().toISOString() })
        .eq("id", transaction.booking_id)
        .eq("status", "pending"); // Concorrência Controlada

      if (bookingError) {
        console.error(`[DB_ERROR] Erro ao alterar estado do booking ${transaction.booking_id} para 'confirmed':`, bookingError);
      }

    } else if (eventType === "payment.failed") {
      // Transitar Estado da Transação para falhado
      await supabase
        .from("payment_transactions")
        .update({ status: "failed", updated_at: new Date().toISOString() })
        .eq("id", transaction.id);

      // NOTA DE ENGENHARIA: O agendamento permanece intacto em 'pending'
      // Isto evita criar erros de mutação e liberta a rota para gerar novas tentativas de pagamento (Attempts).
      console.log(`[PAYMENT_FAILED_LOG] Transação ${transaction.id} atualizada para falhada. Booking mantido em 'pending'.`);
    }

    // Retorno de sucesso absoluto obrigatório para cessar retries do PaySuite
    return json({ received: true }, 200);

  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : "Unknown fatal process error";
    
    if (errorMsg === "REQUEST_TOO_LARGE") {
      console.error("[SECURITY_VIOLATION] Bloqueio preventivo: Corpo da requisição excede limite máximo.");
      return json({ error: "Payload volume exceeds absolute security boundaries" }, 413);
    }
    
    console.error("[FATAL_HANDLER_ERROR] Exceção apanhada na execução da Deno Edge Function:", errorMsg);
    return json({ error: "Internal processing crash server error" }, 500);
  }
