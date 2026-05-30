-- Corrigir search_path das funções de segurança para prevenir SQL injection

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

CREATE OR REPLACE FUNCTION public.daily_security_cleanup()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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