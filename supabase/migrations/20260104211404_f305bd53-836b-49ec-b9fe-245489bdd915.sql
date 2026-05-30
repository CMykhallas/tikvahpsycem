-- Fix security vulnerability: Remove hardcoded anon key from trigger_security_alert function
-- The function will now fail gracefully if configuration is not available

CREATE OR REPLACE FUNCTION public.trigger_security_alert()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  supabase_url TEXT;
  anon_key TEXT;
BEGIN
  -- Only trigger for high/critical severity incidents
  IF NEW.severity NOT IN ('high', 'critical') THEN
    RETURN NEW;
  END IF;
  
  -- Get configuration from environment settings
  supabase_url := current_setting('app.settings.supabase_url', true);
  anon_key := current_setting('app.settings.anon_key', true);
  
  -- Fail gracefully if configuration is missing - DO NOT use hardcoded fallbacks
  IF supabase_url IS NULL OR supabase_url = '' THEN
    RAISE WARNING 'Security alert webhook skipped: app.settings.supabase_url not configured';
    RETURN NEW;
  END IF;
  
  IF anon_key IS NULL OR anon_key = '' THEN
    RAISE WARNING 'Security alert webhook skipped: app.settings.anon_key not configured';
    RETURN NEW;
  END IF;
  
  -- Call the security-alert-webhook edge function asynchronously
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
      'Authorization', 'Bearer ' || anon_key
    )
  );
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log error but don't fail the insert
  RAISE WARNING 'Security alert webhook failed: %', SQLERRM;
  RETURN NEW;
END;
$function$;