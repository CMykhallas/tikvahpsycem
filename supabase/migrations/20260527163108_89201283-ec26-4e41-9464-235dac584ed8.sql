
CREATE OR REPLACE FUNCTION public.trigger_security_alert()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  supabase_url TEXT;
  service_key TEXT;
BEGIN
  IF NEW.severity NOT IN ('high', 'critical') THEN
    RETURN NEW;
  END IF;

  supabase_url := current_setting('app.settings.supabase_url', true);
  service_key  := current_setting('app.settings.service_role_key', true);

  IF supabase_url IS NULL OR supabase_url = '' THEN
    RAISE WARNING 'Security alert webhook skipped: app.settings.supabase_url not configured';
    RETURN NEW;
  END IF;

  IF service_key IS NULL OR service_key = '' THEN
    RAISE WARNING 'Security alert webhook skipped: app.settings.service_role_key not configured';
    RETURN NEW;
  END IF;

  PERFORM extensions.http_post(
    url := supabase_url || '/functions/v1/security-alert-webhook',
    body := jsonb_build_object(
      'incident', jsonb_build_object(
        'id', NEW.id,
        'created_at', NEW.created_at,
        'incident_type', NEW.incident_type,
        'severity', NEW.severity,
        'ip_address', NEW.ip_address,
        'user_agent', NEW.user_agent,
        'endpoint', NEW.endpoint,
        'details', NEW.details
      )
    ),
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || service_key
    )
  );

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Security alert webhook failed: %', SQLERRM;
  RETURN NEW;
END;
$function$;
