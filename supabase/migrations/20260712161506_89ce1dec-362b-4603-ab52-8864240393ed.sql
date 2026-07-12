-- Harden function grants: revoke EXECUTE from PUBLIC/anon on privileged
-- functions (trigger internals, security helpers, cleanup jobs), keeping
-- explicit grants only for the roles that legitimately need them.
--
-- Preserved:
--   * has_role(uuid, app_role) — remains callable by `authenticated` for RLS.
--   * get_order_by_token(uuid, text) — remains callable by `anon, authenticated`
--     to support guest-checkout order lookups by secure token.

-- Trigger functions: only the trigger owner (postgres) needs execute; revoke
-- from everyone else. Postgres always runs triggers regardless of grants.
REVOKE EXECUTE ON FUNCTION public.handle_new_user()             FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.log_proposal_received()       FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.log_proposal_status_change()  FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column()    FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.trigger_security_alert()      FROM PUBLIC, anon, authenticated;

-- Security helpers / cleanup: only service_role should invoke.
REVOKE EXECUTE ON FUNCTION public.get_security_stats(interval)  FROM PUBLIC, anon, authenticated;
GRANT  EXECUTE ON FUNCTION public.get_security_stats(interval)  TO service_role;

REVOKE EXECUTE ON FUNCTION public.cleanup_expired_blacklist()   FROM PUBLIC, anon, authenticated;
GRANT  EXECUTE ON FUNCTION public.cleanup_expired_blacklist()   TO service_role;

REVOKE EXECUTE ON FUNCTION public.clean_old_rate_limits()       FROM PUBLIC, anon, authenticated;
GRANT  EXECUTE ON FUNCTION public.clean_old_rate_limits()       TO service_role;

REVOKE EXECUTE ON FUNCTION public.cleanup_expired_rate_limits() FROM PUBLIC, anon, authenticated;
GRANT  EXECUTE ON FUNCTION public.cleanup_expired_rate_limits() TO service_role;

REVOKE EXECUTE ON FUNCTION public.daily_security_cleanup()      FROM PUBLIC, anon, authenticated;
GRANT  EXECUTE ON FUNCTION public.daily_security_cleanup()      TO service_role;

-- has_role: keep for authenticated (used in RLS policies) — explicit grant.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated, service_role;

-- get_order_by_token: guest checkout — keep anon + authenticated.
REVOKE EXECUTE ON FUNCTION public.get_order_by_token(uuid, text) FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.get_order_by_token(uuid, text) TO anon, authenticated, service_role;