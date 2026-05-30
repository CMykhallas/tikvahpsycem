-- =========================================
-- FASE 1: TABELAS DE SEGURANÇA E AUDITORIA
-- =========================================

-- Tabela de incidentes de segurança
CREATE TABLE IF NOT EXISTS public.security_incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  ip_address TEXT NOT NULL,
  user_agent TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  endpoint TEXT,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para performance de queries de segurança
CREATE INDEX idx_security_incidents_type ON public.security_incidents(incident_type);
CREATE INDEX idx_security_incidents_ip ON public.security_incidents(ip_address);
CREATE INDEX idx_security_incidents_severity ON public.security_incidents(severity);
CREATE INDEX idx_security_incidents_created ON public.security_incidents(created_at DESC);

-- Tabela de blacklist de IPs
CREATE TABLE IF NOT EXISTS public.ip_blacklist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address TEXT NOT NULL UNIQUE,
  reason TEXT NOT NULL,
  blocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX idx_ip_blacklist_ip ON public.ip_blacklist(ip_address);
CREATE INDEX idx_ip_blacklist_expires ON public.ip_blacklist(expires_at);

-- Atualizar tabela rate_limits para suportar bloqueios
ALTER TABLE public.rate_limits ADD COLUMN IF NOT EXISTS blocked_until TIMESTAMPTZ;
ALTER TABLE public.rate_limits ADD COLUMN IF NOT EXISTS first_request_at TIMESTAMPTZ DEFAULT NOW();

-- Adicionar sistema de tokens para pedidos anônimos
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS order_access_token TEXT UNIQUE;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS token_expires_at TIMESTAMPTZ;

CREATE INDEX idx_orders_access_token ON public.orders(order_access_token) WHERE order_access_token IS NOT NULL;

-- =========================================
-- FASE 2: FUNÇÕES DE SEGURANÇA
-- =========================================

-- Função para limpar rate limits expirados automaticamente
CREATE OR REPLACE FUNCTION public.cleanup_expired_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.rate_limits
  WHERE reset_time < NOW() AND (blocked_until IS NULL OR blocked_until < NOW());
END;
$$;

-- Função para limpar IPs da blacklist expirados
CREATE OR REPLACE FUNCTION public.cleanup_expired_blacklist()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.ip_blacklist
  WHERE expires_at IS NOT NULL AND expires_at < NOW();
END;
$$;

-- Função para obter estatísticas de segurança
CREATE OR REPLACE FUNCTION public.get_security_stats(time_window INTERVAL DEFAULT '24 hours')
RETURNS TABLE (
  total_incidents BIGINT,
  critical_incidents BIGINT,
  unique_ips BIGINT,
  blocked_ips BIGINT,
  price_tampering_attempts BIGINT,
  rate_limit_violations BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::BIGINT as total_incidents,
    COUNT(*) FILTER (WHERE severity = 'critical')::BIGINT as critical_incidents,
    COUNT(DISTINCT ip_address)::BIGINT as unique_ips,
    (SELECT COUNT(*)::BIGINT FROM public.ip_blacklist WHERE blocked_at > NOW() - time_window) as blocked_ips,
    COUNT(*) FILTER (WHERE incident_type = 'PRICE_TAMPERING')::BIGINT as price_tampering_attempts,
    COUNT(*) FILTER (WHERE incident_type = 'RATE_LIMIT')::BIGINT as rate_limit_violations
  FROM public.security_incidents
  WHERE created_at > NOW() - time_window;
END;
$$;

-- =========================================
-- FASE 3: ROW LEVEL SECURITY (RLS)
-- =========================================

-- Security incidents - apenas admins podem ver
ALTER TABLE public.security_incidents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view security incidents"
ON public.security_incidents FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Edge functions can insert security incidents"
ON public.security_incidents FOR INSERT
WITH CHECK (true);

-- IP Blacklist - apenas admins podem ver e gerenciar
ALTER TABLE public.ip_blacklist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view blacklist"
ON public.ip_blacklist FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage blacklist"
ON public.ip_blacklist FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Edge functions can manage blacklist"
ON public.ip_blacklist FOR ALL
USING (true);

-- Orders - adicionar policy para acesso via token
CREATE POLICY "Anonymous users can view orders with valid token"
ON public.orders FOR SELECT
USING (
  (order_access_token IS NOT NULL 
   AND token_expires_at > NOW()
   AND order_access_token = current_setting('request.headers', true)::json->>'x-order-token')
  OR auth.uid() = user_id
  OR has_role(auth.uid(), 'admin'::app_role)
);

-- =========================================
-- FASE 4: TRIGGERS AUTOMÁTICOS
-- =========================================

-- Trigger para limpar dados antigos automaticamente (executar diariamente)
CREATE OR REPLACE FUNCTION public.daily_security_cleanup()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Limpar incidentes de segurança com mais de 90 dias
  DELETE FROM public.security_incidents
  WHERE created_at < NOW() - INTERVAL '90 days';
  
  -- Limpar rate limits expirados
  PERFORM public.cleanup_expired_rate_limits();
  
  -- Limpar blacklist expirada
  PERFORM public.cleanup_expired_blacklist();
  
  -- Limpar tokens de pedidos expirados
  UPDATE public.orders
  SET order_access_token = NULL
  WHERE token_expires_at < NOW() - INTERVAL '30 days';
END;
$$;

-- =========================================
-- COMENTÁRIOS PARA DOCUMENTAÇÃO
-- =========================================

COMMENT ON TABLE public.security_incidents IS 'Auditoria de todos incidentes de segurança detectados pelo sistema';
COMMENT ON TABLE public.ip_blacklist IS 'IPs bloqueados por comportamento suspeito ou malicioso';
COMMENT ON COLUMN public.orders.order_access_token IS 'Token seguro para rastreamento de pedidos anônimos';
COMMENT ON FUNCTION public.get_security_stats IS 'Retorna estatísticas agregadas de segurança para dashboard admin';