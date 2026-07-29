-- =====================================================================
-- CORREÇÃO (Auditoria de BD #2 — "Sem Masking de Dados Sensíveis")
-- CORREÇÃO (Auditoria de BD #5 — "Sem Monitoring de Queries Lentas")
--
-- Este ficheiro:
--   1. Cria funções PL/pgSQL de redacção reutilizáveis (email, telefone, nome)
--   2. Cria uma view `orders_masked` para uso em relatórios/dashboards que
--      não precisem de ver o dado completo do cliente
--   3. Activa pg_stat_statements para monitorização de queries lentas
--
-- IMPORTANTE: isto NÃO substitui o controlo de acesso via RLS já existente
-- nas tabelas `orders`/`contacts` — é uma camada adicional para reduzir a
-- exposição de PII em contextos de reporting/analytics onde o dado completo
-- não é necessário (ex. dashboards internos, exportações para BI).
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. Funções de redacção reutilizáveis
-- ---------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.mask_email(input_email text)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public
AS $$
DECLARE
  at_pos int;
  local_part text;
  domain_part text;
BEGIN
  IF input_email IS NULL OR input_email = '' THEN
    RETURN NULL;
  END IF;

  at_pos := position('@' in input_email);
  IF at_pos = 0 THEN
    RETURN '***';
  END IF;

  local_part := substring(input_email from 1 for at_pos - 1);
  domain_part := substring(input_email from at_pos);

  IF length(local_part) <= 2 THEN
    RETURN left(local_part, 1) || '***' || domain_part;
  END IF;

  RETURN left(local_part, 2) || repeat('*', greatest(length(local_part) - 2, 3)) || domain_part;
END;
$$;

COMMENT ON FUNCTION public.mask_email(text) IS
  'Redacção de email para uso em relatórios/dashboards (ex. jo***@dominio.com). Não usar como substituto de RLS.';

CREATE OR REPLACE FUNCTION public.mask_phone(input_phone text)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public
AS $$
BEGIN
  IF input_phone IS NULL OR input_phone = '' THEN
    RETURN NULL;
  END IF;

  IF length(input_phone) <= 4 THEN
    RETURN repeat('*', length(input_phone));
  END IF;

  RETURN repeat('*', length(input_phone) - 4) || right(input_phone, 4);
END;
$$;

COMMENT ON FUNCTION public.mask_phone(text) IS
  'Redacção de telefone mantendo só os últimos 4 dígitos visíveis, para relatórios/dashboards.';

CREATE OR REPLACE FUNCTION public.mask_name(input_name text)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public
AS $$
DECLARE
  first_space int;
BEGIN
  IF input_name IS NULL OR input_name = '' THEN
    RETURN NULL;
  END IF;

  first_space := position(' ' in input_name);
  IF first_space = 0 THEN
    RETURN left(input_name, 1) || repeat('*', greatest(length(input_name) - 1, 1));
  END IF;

  -- Mantém o primeiro nome, mascara o resto (ex. "Maria S*** P***")
  RETURN split_part(input_name, ' ', 1) || ' ' ||
    regexp_replace(substring(input_name from first_space + 1), '\S', '*', 'g');
END;
$$;

COMMENT ON FUNCTION public.mask_name(text) IS
  'Redacção de nome completo, mantendo apenas o primeiro nome legível.';

-- ---------------------------------------------------------------------
-- 2. View de encomendas com dados de cliente mascarados
--    (não expõe metadata bruta nem phone_number cifrado em claro)
-- ---------------------------------------------------------------------

CREATE OR REPLACE VIEW public.orders_masked AS
SELECT
  id,
  user_id,
  amount,
  currency,
  status,
  payment_method,
  created_at,
  updated_at,
  public.mask_name(metadata->>'customer_name')  AS customer_name_masked,
  public.mask_email(metadata->>'customer_email') AS customer_email_masked,
  -- phone_number já é armazenado cifrado pela aplicação (ver create-order);
  -- aqui expomos apenas que existe, nunca o conteúdo.
  (phone_number IS NOT NULL) AS has_phone_on_file
FROM public.orders;

COMMENT ON VIEW public.orders_masked IS
  'Vista de encomendas com PII mascarada, para uso em dashboards/relatórios internos. Herda RLS da tabela orders subjacente.';

-- Garantir que a view herda as mesmas regras de acesso da tabela base
ALTER VIEW public.orders_masked SET (security_invoker = true);
REVOKE ALL ON public.orders_masked FROM anon;

-- ---------------------------------------------------------------------
-- 3. Monitorização de queries lentas (pg_stat_statements)
-- ---------------------------------------------------------------------
-- Nota: em Supabase gerido, esta extensão está normalmente disponível pré-carregada
-- por omissão, mas em alguns ambientes pode exigir activação manual adicional no
-- painel (Database → Extensions) se `shared_preload_libraries` não a incluir.
-- Todo o bloco (extensão + view dependente) está envolvido em tratamento de
-- excepção para não reverter as funções de masking criadas acima caso falhe aqui.
DO $$
BEGIN
  CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

  EXECUTE $view$
    CREATE OR REPLACE VIEW public.slow_queries_report AS
    SELECT
      substring(query, 1, 200) AS query_preview,
      calls,
      round(total_exec_time::numeric, 2)  AS total_exec_time_ms,
      round(mean_exec_time::numeric, 2)   AS mean_exec_time_ms,
      round(max_exec_time::numeric, 2)    AS max_exec_time_ms,
      rows
    FROM pg_stat_statements
    WHERE query NOT ILIKE '%pg_stat_statements%'
    ORDER BY mean_exec_time DESC
    LIMIT 50
  $view$;

  COMMENT ON VIEW public.slow_queries_report IS
    'Top 50 queries por tempo médio de execução. Requer pg_stat_statements activo. Acesso restrito a administradores.';

  EXECUTE 'REVOKE ALL ON public.slow_queries_report FROM anon, authenticated';

EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'pg_stat_statements / slow_queries_report não puderam ser criados automaticamente (%). Activar a extensão manualmente em Database → Extensions no painel Supabase e voltar a correr esta secção.', SQLERRM;
END;
$$;
