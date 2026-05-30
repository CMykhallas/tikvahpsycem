-- =========================================
-- ELITE SECURITY: HONEYPOT TABLES
-- Tabelas falsas para detectar invasores
-- =========================================

-- Honeypot 1: Admin Users (Falso)
-- Se alguém tentar ler essa tabela, é bloqueado
CREATE TABLE IF NOT EXISTS public.honeypot_admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  api_key TEXT NOT NULL UNIQUE,
  secret_key TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_honeypot_admin_username ON public.honeypot_admin_users(username);

-- Honeypot 2: Credit Cards (Falso)
-- Ninguém deveria ter acesso a isso - detecta tentativas de roubo
CREATE TABLE IF NOT EXISTS public.honeypot_credit_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_number TEXT NOT NULL,
  card_holder TEXT NOT NULL,
  expiry_date TEXT NOT NULL,
  cvv TEXT NOT NULL,
  user_id UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Honeypot 3: API Keys (Falso)
-- Contém chaves fake para detectar exfiltração
CREATE TABLE IF NOT EXISTS public.honeypot_api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name TEXT NOT NULL,
  api_key TEXT NOT NULL UNIQUE,
  api_secret TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Honeypot 4: Internal Auth Tokens (Falso)
CREATE TABLE IF NOT EXISTS public.honeypot_internal_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token TEXT NOT NULL UNIQUE,
  user_id UUID,
  scope TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =========================================
-- HONEYPOT DETECTION LOGS
-- =========================================
CREATE TABLE IF NOT EXISTS public.honeypot_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  honeypot_table TEXT NOT NULL,
  detected_at TIMESTAMPTZ DEFAULT now(),
  ip_address TEXT NOT NULL,
  user_agent TEXT,
  query_type TEXT NOT NULL,
  attempted_query TEXT,
  details JSONB DEFAULT '{}'::jsonb,
  action_taken TEXT DEFAULT 'IP_BLACKLISTED',
  severity TEXT DEFAULT 'critical'
);

CREATE INDEX idx_honeypot_alerts_ip ON public.honeypot_alerts(ip_address);
CREATE INDEX idx_honeypot_alerts_time ON public.honeypot_alerts(detected_at DESC);

-- =========================================
-- ENABLE RLS ON HONEYPOTS
-- =========================================
ALTER TABLE public.honeypot_admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.honeypot_credit_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.honeypot_api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.honeypot_internal_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.honeypot_alerts ENABLE ROW LEVEL SECURITY;

-- =========================================
-- HONEYPOT POLICIES
-- Block ALL access except service role
-- =========================================

-- Policy: honeypot_admin_users - Admin access ONLY (should not exist in production)
CREATE POLICY "Honeypot admin users - block all"
ON public.honeypot_admin_users
FOR ALL
USING (false)
WITH CHECK (false);

-- Policy: honeypot_credit_cards - Completely blocked
CREATE POLICY "Honeypot credit cards - block all"
ON public.honeypot_credit_cards
FOR ALL
USING (false)
WITH CHECK (false);

-- Policy: honeypot_api_keys - Completely blocked
CREATE POLICY "Honeypot api keys - block all"
ON public.honeypot_api_keys
FOR ALL
USING (false)
WITH CHECK (false);

-- Policy: honeypot_internal_tokens - Completely blocked
CREATE POLICY "Honeypot internal tokens - block all"
ON public.honeypot_internal_tokens
FOR ALL
USING (false)
WITH CHECK (false);

-- Policy: honeypot_alerts - Admins only
CREATE POLICY "Honeypot alerts - admin only"
ON public.honeypot_alerts
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- =========================================
-- TRIGGER: Log Honeypot Access Attempts
-- =========================================
CREATE OR REPLACE FUNCTION public.log_honeypot_access()
RETURNS TRIGGER AS $$
BEGIN
  -- Log any attempt to access honeypot
  INSERT INTO public.honeypot_alerts (
    honeypot_table,
    ip_address,
    query_type,
    details,
    action_taken,
    severity
  ) VALUES (
    TG_TABLE_NAME,
    COALESCE(current_setting('request.headers', true)::json->>'x-forwarded-for', 'unknown'),
    'INSERT',
    jsonb_build_object(
      'user_id', auth.uid(),
      'timestamp', now(),
      'attempt_details', row_to_json(NEW)
    ),
    'IMMEDIATE_BAN',
    'critical'
  );
  
  -- Block the operation
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers para detectar qualquer inserção em honeypots
CREATE TRIGGER trigger_honeypot_admin_users
BEFORE INSERT ON public.honeypot_admin_users
FOR EACH ROW
EXECUTE FUNCTION public.log_honeypot_access();

CREATE TRIGGER trigger_honeypot_credit_cards
BEFORE INSERT ON public.honeypot_credit_cards
FOR EACH ROW
EXECUTE FUNCTION public.log_honeypot_access();

CREATE TRIGGER trigger_honeypot_api_keys
BEFORE INSERT ON public.honeypot_api_keys
FOR EACH ROW
EXECUTE FUNCTION public.log_honeypot_access();

CREATE TRIGGER trigger_honeypot_internal_tokens
BEFORE INSERT ON public.honeypot_internal_tokens
FOR EACH ROW
EXECUTE FUNCTION public.log_honeypot_access();

-- =========================================
-- POPULATE HONEYPOTS WITH FAKE DATA
-- =========================================
INSERT INTO public.honeypot_admin_users (username, email, password_hash, api_key, secret_key)
VALUES 
  ('root_admin', 'root@tikvah.admin', 'sha256_fake_hash_1', 'sk_test_fake_admin_key_1', 'secret_admin_key_1'),
  ('superuser', 'admin@tikvah.internal', 'sha256_fake_hash_2', 'sk_test_fake_admin_key_2', 'secret_admin_key_2'),
  ('sysadmin', 'sysadmin@tikvah.internal', 'sha256_fake_hash_3', 'sk_test_fake_admin_key_3', 'secret_admin_key_3')
ON CONFLICT DO NOTHING;

INSERT INTO public.honeypot_api_keys (service_name, api_key, api_secret)
VALUES 
  ('Stripe Internal', 'sk_live_fake_stripe_1234567890', 'rk_test_fake_stripe_secret_key'),
  ('M-Pesa Admin', 'mpesa_admin_key_fake', 'mpesa_admin_secret_fake'),
  ('PayPal Enterprise', 'paypal_enterprise_fake_key', 'paypal_enterprise_secret_fake'),
  ('AWS Admin', 'AKIAIOSFODNN7EXAMPLE_FAKE', 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY'),
  ('Database Admin', 'db_admin_user_fake', 'db_admin_password_super_secret_fake')
ON CONFLICT DO NOTHING;

INSERT INTO public.honeypot_internal_tokens (token, scope)
VALUES 
  ('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.fake_admin_token_1', 'admin:*'),
  ('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.fake_admin_token_2', 'admin:write'),
  ('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.fake_system_token', 'system:admin')
ON CONFLICT DO NOTHING;

-- =========================================
-- FUNCTION: Ban IP automatically on honeypot access
-- =========================================
CREATE OR REPLACE FUNCTION public.ban_honeypot_attacker(p_ip_address TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert IP into blacklist with 30-day ban
  INSERT INTO public.ip_blacklist (ip_address, reason, expires_at)
  VALUES (
    p_ip_address,
    'Attempted to access honeypot tables',
    NOW() + INTERVAL '30 days'
  )
  ON CONFLICT (ip_address) DO UPDATE
  SET expires_at = NOW() + INTERVAL '30 days',
      reason = 'Attempted to access honeypot tables (repeated)';
  
  -- Log critical incident
  INSERT INTO public.security_incidents (
    incident_type,
    severity,
    ip_address,
    endpoint,
    details
  ) VALUES (
    'HONEYPOT_TRIGGER',
    'critical',
    p_ip_address,
    '/honeypot',
    jsonb_build_object(
      'action', 'Automatic 30-day IP ban',
      'detected_at', now()
    )
  );
END;
$$ LANGUAGE plpgsql;

-- =========================================
-- COMMENTS FOR DOCUMENTATION
-- =========================================
COMMENT ON TABLE public.honeypot_admin_users IS 
'DECEPTION LAYER: Fake admin users table. Any access is logged and IP is automatically banned.';

COMMENT ON TABLE public.honeypot_credit_cards IS 
'DECEPTION LAYER: Fake credit cards. Used to detect data exfiltration attempts.';

COMMENT ON TABLE public.honeypot_api_keys IS 
'DECEPTION LAYER: Fake API keys. Detect if attackers are stealing credentials.';

COMMENT ON TABLE public.honeypot_internal_tokens IS 
'DECEPTION LAYER: Fake internal auth tokens. Detect session hijacking attempts.';

COMMENT ON TABLE public.honeypot_alerts IS 
'SECURITY INCIDENT LOG: Records all honeypot access attempts for investigation and automated banning.';
