
REVOKE EXECUTE ON FUNCTION public.daily_security_cleanup() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.daily_security_cleanup() TO service_role;
