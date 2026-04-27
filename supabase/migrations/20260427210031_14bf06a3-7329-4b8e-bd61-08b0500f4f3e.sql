
-- 1. Fix cart RLS: anon can only INSERT, not SELECT/UPDATE/DELETE cross-session
DROP POLICY IF EXISTS "Anonymous cart by session" ON public.cart;

CREATE POLICY "Anonymous can insert cart items"
ON public.cart FOR INSERT
TO anon
WITH CHECK (session_id IS NOT NULL AND user_id IS NULL);

-- 2. Drop vulnerable single-arg has_role(text) that checks JWT claim
DROP FUNCTION IF EXISTS public.has_role(text);

-- 3. Revoke EXECUTE from anon/authenticated on internal SECURITY DEFINER functions
REVOKE EXECUTE ON FUNCTION public.cleanup_expired_rate_limits() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.clean_old_rate_limits() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.cleanup_expired_blacklist() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.daily_security_cleanup() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.get_security_stats(interval) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.trigger_security_alert() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;

-- Keep public execute on:
-- - has_role(uuid, app_role) — required by RLS policies
-- - get_order_by_token(uuid, text) — required for guest order lookup
-- - update_updated_at_column() — trigger function
