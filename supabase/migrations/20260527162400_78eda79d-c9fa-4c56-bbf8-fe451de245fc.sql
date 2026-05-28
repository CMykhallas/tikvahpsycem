
REVOKE EXECUTE ON FUNCTION public.cleanup_expired_rate_limits() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.cleanup_expired_blacklist() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.clean_old_rate_limits() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.daily_security_cleanup() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_security_stats(interval) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.log_proposal_received() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.log_proposal_status_change() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.trigger_security_alert() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.cleanup_expired_rate_limits() TO service_role;
GRANT EXECUTE ON FUNCTION public.cleanup_expired_blacklist() TO service_role;
GRANT EXECUTE ON FUNCTION public.clean_old_rate_limits() TO service_role;
GRANT EXECUTE ON FUNCTION public.daily_security_cleanup() TO service_role;
GRANT EXECUTE ON FUNCTION public.get_security_stats(interval) TO service_role;
