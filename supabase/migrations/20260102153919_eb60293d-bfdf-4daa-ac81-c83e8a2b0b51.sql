-- Enable pg_net extension for HTTP calls from triggers
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Create a function to trigger security alerts via webhook
CREATE OR REPLACE FUNCTION public.trigger_security_alert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  supabase_url TEXT;
  anon_key TEXT;
BEGIN
  -- Only trigger for high/critical severity incidents
  IF NEW.severity NOT IN ('high', 'critical') THEN
    RETURN NEW;
  END IF;
  
  -- Get Supabase URL from environment
  supabase_url := 'https://rrlwabtzwvurhhfwpmiq.supabase.co';
  anon_key := current_setting('app.settings.anon_key', true);
  
  -- If anon_key not available, skip (webhook won't authenticate)
  IF anon_key IS NULL THEN
    anon_key := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJybHdhYnR6d3Z1cmhoZndwbWlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4ODQ1OTcsImV4cCI6MjA3NzQ2MDU5N30.HfJ_LE1UQA5CldxMbt0aByg-7jTQ39kjQ-y1Ma6nXYs';
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
$$;

-- Create trigger on security_incidents table
DROP TRIGGER IF EXISTS on_critical_security_incident ON public.security_incidents;

CREATE TRIGGER on_critical_security_incident
  AFTER INSERT ON public.security_incidents
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_security_alert();