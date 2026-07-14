
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

CREATE TABLE IF NOT EXISTS public.alert_dedupe (
  key TEXT PRIMARY KEY,
  notified_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  count INTEGER NOT NULL DEFAULT 1,
  metadata JSONB
);

GRANT ALL ON public.alert_dedupe TO service_role;
ALTER TABLE public.alert_dedupe ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_only_alert_dedupe" ON public.alert_dedupe
  AS PERMISSIVE FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Extend daily cleanup to prune old dedupe rows
CREATE OR REPLACE FUNCTION public.daily_security_cleanup()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  DELETE FROM public.security_incidents WHERE created_at < NOW() - INTERVAL '90 days';
  PERFORM public.cleanup_expired_rate_limits();
  PERFORM public.cleanup_expired_blacklist();
  DELETE FROM public.alert_dedupe WHERE notified_at < NOW() - INTERVAL '7 days';
  UPDATE public.orders
    SET order_access_token = NULL
    WHERE token_expires_at < NOW() - INTERVAL '30 days';
END;
$function$;
