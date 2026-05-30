-- =========================================
-- ELITE AUTHENTICATION: FIDO2/WebAuthn
-- =========================================

-- Tabela para armazenar credenciais WebAuthn
CREATE TABLE IF NOT EXISTS public.webauthn_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  credential_device_name TEXT NOT NULL,
  credential_public_key TEXT NOT NULL,
  credential_id BYTEA NOT NULL,
  credential_id_encoded TEXT NOT NULL UNIQUE,
  counter INTEGER NOT NULL DEFAULT 0,
  transports TEXT[] DEFAULT ARRAY[]::TEXT[],
  aaguid UUID,
  backed_up BOOLEAN DEFAULT false,
  backup_eligible BOOLEAN DEFAULT false,
  registration_time TIMESTAMPTZ DEFAULT now(),
  last_used TIMESTAMPTZ,
  attestation_object TEXT,
  client_data_json TEXT,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_webauthn_user_id ON public.webauthn_credentials(user_id);
CREATE INDEX idx_webauthn_credential_id ON public.webauthn_credentials(credential_id_encoded);

-- Tabela para armazenar desafios (challenges) de WebAuthn
CREATE TABLE IF NOT EXISTS public.webauthn_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge TEXT NOT NULL UNIQUE,
  challenge_type TEXT NOT NULL CHECK (challenge_type IN ('registration', 'authentication')),
  created_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ DEFAULT now() + INTERVAL '10 minutes',
  used_at TIMESTAMPTZ
);

CREATE INDEX idx_webauthn_challenges_user ON public.webauthn_challenges(user_id);
CREATE INDEX idx_webauthn_challenges_expires ON public.webauthn_challenges(expires_at);

-- Tabela para auditoria de WebAuthn
CREATE TABLE IF NOT EXISTS public.webauthn_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  credential_id TEXT,
  device_name TEXT,
  ip_address TEXT,
  user_agent TEXT,
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_webauthn_audit_user ON public.webauthn_audit_log(user_id);
CREATE INDEX idx_webauthn_audit_time ON public.webauthn_audit_log(created_at DESC);

-- =========================================
-- RLS POLICIES
-- =========================================

ALTER TABLE public.webauthn_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webauthn_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webauthn_audit_log ENABLE ROW LEVEL SECURITY;

-- Users can only see their own credentials
CREATE POLICY "Users see own webauthn credentials"
ON public.webauthn_credentials
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Admins can see all credentials
CREATE POLICY "Admins see all webauthn credentials"
ON public.webauthn_credentials
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- Users can insert their own credentials
CREATE POLICY "Users register own webauthn"
ON public.webauthn_credentials
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Users can update their own credentials
CREATE POLICY "Users update own webauthn"
ON public.webauthn_credentials
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Users can delete their own credentials
CREATE POLICY "Users delete own webauthn"
ON public.webauthn_credentials
FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- Challenges are user-specific
CREATE POLICY "Users see own webauthn challenges"
ON public.webauthn_challenges
FOR SELECT
TO authenticated
USING (user_id = auth.uid() OR user_id IS NULL);

-- Edge functions can manage challenges
CREATE POLICY "Edge functions manage webauthn challenges"
ON public.webauthn_challenges
FOR ALL
USING (true);

-- Users see own audit logs
CREATE POLICY "Users see own webauthn audit"
ON public.webauthn_audit_log
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Admins see all audit logs
CREATE POLICY "Admins see all webauthn audit"
ON public.webauthn_audit_log
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- Edge functions log events
CREATE POLICY "Edge functions log webauthn"
ON public.webauthn_audit_log
FOR INSERT
USING (true);

-- =========================================
-- FUNCTIONS
-- =========================================

-- Função para limpar challenges expirados
CREATE OR REPLACE FUNCTION public.cleanup_expired_webauthn_challenges()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.webauthn_challenges
  WHERE expires_at < now();
END;
$$;

-- Função para auditoria de WebAuthn
CREATE OR REPLACE FUNCTION public.log_webauthn_event(
  p_user_id UUID,
  p_event_type TEXT,
  p_credential_id TEXT DEFAULT NULL,
  p_device_name TEXT DEFAULT NULL,
  p_ip_address TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_success BOOLEAN DEFAULT true,
  p_error_message TEXT DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.webauthn_audit_log (
    user_id,
    event_type,
    credential_id,
    device_name,
    ip_address,
    user_agent,
    success,
    error_message
  ) VALUES (
    p_user_id,
    p_event_type,
    p_credential_id,
    p_device_name,
    p_ip_address,
    p_user_agent,
    p_success,
    p_error_message
  );
END;
$$;

-- =========================================
-- TRIGGER: Update last_used timestamp
-- =========================================

CREATE OR REPLACE FUNCTION public.update_webauthn_last_used()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_used = now();
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Este trigger será acionado via função personalizada no Edge Function
-- quando uma autenticação bem-sucedida ocorrer

-- =========================================
-- COMMENTS
-- =========================================

COMMENT ON TABLE public.webauthn_credentials IS 
'Stores FIDO2/WebAuthn security key registrations for zero-phishing authentication';

COMMENT ON TABLE public.webauthn_challenges IS 
'Temporary challenges for WebAuthn ceremonies (registration and authentication)';

COMMENT ON TABLE public.webauthn_audit_log IS 
'Audit log for all WebAuthn events (registration, authentication, removal)';
