-- Revogar acesso por defeito de PUBLIC e anon para funcoes SECURITY DEFINER sensiveis
REVOKE EXECUTE ON FUNCTION public.cleanup_expired_rate_limits() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.cleanup_expired_blacklist() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.clean_old_rate_limits() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.daily_security_cleanup() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_security_stats(interval) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.log_proposal_received() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.log_proposal_status_change() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.trigger_security_alert() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;

-- Conceder apenas a service_role para tarefas administrativas / backend
GRANT EXECUTE ON FUNCTION public.cleanup_expired_rate_limits() TO service_role;
GRANT EXECUTE ON FUNCTION public.cleanup_expired_blacklist() TO service_role;
GRANT EXECUTE ON FUNCTION public.clean_old_rate_limits() TO service_role;
GRANT EXECUTE ON FUNCTION public.daily_security_cleanup() TO service_role;
GRANT EXECUTE ON FUNCTION public.trigger_security_alert() TO service_role;

-- Estatisticas de seguranca: service_role + admins autenticados (verificacao adicional na app)
GRANT EXECUTE ON FUNCTION public.get_security_stats(interval) TO service_role, authenticated;

-- Funcoes de trigger so precisam ser invocadas pelo proprio postgres engine (owner)
-- nenhum role precisa de EXECUTE explicito; ja foi revogado acima.

-- get_order_by_token continua acessivel a anon (depende de token seguro)
GRANT EXECUTE ON FUNCTION public.get_order_by_token(uuid, text) TO anon, authenticated, service_role;

-- has_role usada por policies RLS: manter acessivel
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO anon, authenticated, service_role;