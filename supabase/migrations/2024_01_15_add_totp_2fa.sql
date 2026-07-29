/**
 * DATABASE SCHEMA MIGRATIONS FOR 2FA/TOTP
 * 
 * Execute no Supabase SQL Editor para ativar 2FA
 * Path: Supabase Dashboard → SQL Editor → Execute
 */

-- =====================================================
-- TABELA: user_totp (Armazenar secrets TOTP)
-- =====================================================
CREATE TABLE IF NOT EXISTS user_totp (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  secret VARCHAR(32) NOT NULL,
  backup_codes TEXT[] DEFAULT '{}',
  enabled BOOLEAN DEFAULT false,
  enabled_at TIMESTAMP DEFAULT NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  
  CONSTRAINT fk_user_totp_user_id
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_user_totp_user_id ON user_totp(user_id);
CREATE INDEX IF NOT EXISTS idx_user_totp_enabled ON user_totp(enabled);
CREATE INDEX IF NOT EXISTS idx_user_totp_enabled_at ON user_totp(enabled_at DESC);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE user_totp ENABLE ROW LEVEL SECURITY;

-- Política: Usuários só podem ver seus próprios dados TOTP
DROP POLICY IF EXISTS "Users can view own TOTP data" ON user_totp;
CREATE POLICY "Users can view own TOTP data"
  ON user_totp FOR SELECT
  USING (auth.uid() = user_id);

-- Política: Usuários podem atualizar seus próprios dados TOTP
DROP POLICY IF EXISTS "Users can update own TOTP data" ON user_totp;
CREATE POLICY "Users can update own TOTP data"
  ON user_totp FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Política: Service role pode fazer tudo (para edge functions)
DROP POLICY IF EXISTS "Service role can manage TOTP" ON user_totp;
CREATE POLICY "Service role can manage TOTP"
  ON user_totp
  USING (
    current_setting('request.jwt.claims', true)::jsonb ->> 'role' = 'service_role'
  );

-- =====================================================
-- TABELA: mfa_audit (Auditoria de tentativas 2FA)
-- =====================================================
CREATE TABLE IF NOT EXISTS mfa_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  event_type TEXT NOT NULL,
  status TEXT,
  ip_address INET,
  user_agent TEXT,
  details JSONB DEFAULT NULL,
  created_at TIMESTAMP DEFAULT now(),
  
  CONSTRAINT fk_mfa_audit_user_id
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- =====================================================
-- ÍNDICES PARA AUDITORIA
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_mfa_audit_user_id ON mfa_audit(user_id);
CREATE INDEX IF NOT EXISTS idx_mfa_audit_event_type ON mfa_audit(event_type);
CREATE INDEX IF NOT EXISTS idx_mfa_audit_created_at ON mfa_audit(created_at DESC);

-- =====================================================
-- RLS PARA AUDITORIA
-- =====================================================
ALTER TABLE mfa_audit ENABLE ROW LEVEL SECURITY;

-- Política: Usuários podem ver sua própria auditoria
DROP POLICY IF EXISTS "Users can view own MFA audit" ON mfa_audit;
CREATE POLICY "Users can view own MFA audit"
  ON mfa_audit FOR SELECT
  USING (auth.uid() = user_id OR current_setting('request.jwt.claims', true)::jsonb ->> 'role' = 'service_role');

-- =====================================================
-- FUNÇÃO: atualizar updated_at timestamp
-- =====================================================
DROP FUNCTION IF EXISTS update_user_totp_updated_at();
CREATE FUNCTION update_user_totp_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGER: auto-update updated_at
-- =====================================================
DROP TRIGGER IF EXISTS on_user_totp_update ON user_totp;
CREATE TRIGGER on_user_totp_update
BEFORE UPDATE ON user_totp
FOR EACH ROW
EXECUTE FUNCTION update_user_totp_updated_at();

-- =====================================================
-- VERIFICAÇÃO: Confirmar que tabelas foram criadas
-- =====================================================
SELECT 
  table_name,
  (SELECT count(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
AND table_name IN ('user_totp', 'mfa_audit')
ORDER BY table_name;
