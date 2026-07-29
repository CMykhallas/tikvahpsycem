# IMPLEMENTAÇÃO 2FA/MFA - GUIA TÉCNICO COMPLETO

**Crítica #3 - Autenticação sem 2FA/MFA**  
**Status**: Fase 1B (Próxima - ~6.5 horas)  
**Framework**: TOTP (Time-based One-Time Password)  
**Compliance**: ISO 27001 A.9.4, OWASP A07:2021  

---

## 📋 CHECKLIST DE IMPLEMENTAÇÃO

- [ ] 1. Instalar dependências (`otplib`, `qrcode`)
- [ ] 2. Criar arquivo `supabase/functions/_shared/totp.ts`
- [ ] 3. Criar edge function `/supabase/functions/totp-setup`
- [ ] 4. Criar edge function `/supabase/functions/totp-verify`
- [ ] 5. Criar componente React `TwoFactorSetup.tsx`
- [ ] 6. Modificar `src/hooks/useAuth.ts` para suportar TOTP
- [ ] 7. Atualizar fluxo de login para exigir TOTP (admin)
- [ ] 8. Criar testes E2E para 2FA flow
- [ ] 9. Documentar recovery procedures
- [ ] 10. Deploy para staging e validação

---

## 🔧 PASSO-A-PASSO TÉCNICO

### PASSO 1: Instalar Dependências

```bash
npm install otplib qrcode
npm install --save-dev @types/qrcode
```

**Pacotes**:
- `otplib` (v12+): Geração/verificação de TOTP
- `qrcode`: Gerar QR codes para escanear no autenticador

---

### PASSO 2: Criar TotpService

**Arquivo**: `supabase/functions/_shared/totp.ts`

```typescript
import OTPAuth from "npm:otpauth";
import QRCode from "npm:qrcode";

/**
 * TOTP (Time-based One-Time Password) Service
 * Implements RFC 6238 standard
 * 
 * Security Properties:
 * - 6-digit codes valid for 30 seconds
 * - SHA-1 HMAC algorithm (standard)
 * - Backward compatibility with Google Authenticator, Authy, 1Password, etc.
 */
export class TotpService {
  // Configuração padrão TOTP
  static readonly TOTP_CONFIG = {
    issuer: "Tikvah Psychological Center",
    algorithm: "SHA1",
    digits: 6,
    period: 30,
  };

  /**
   * Gerar novo secret TOTP + QR code
   * 
   * Uso: Quando usuário habilita 2FA
   * 
   * @param userId - ID do usuário para label
   * @returns { secret: string (base32), qrCode: data-url }
   */
  static async generateSecret(userId: string): Promise<{
    secret: string;
    qrCode: string;
  }> {
    try {
      // Gerar TOTP com configuração padrão
      const totp = new OTPAuth.TOTP({
        ...this.TOTP_CONFIG,
        label: `Tikvah (${userId})`,
        secret: OTPAuth.Secret.fromLength(32), // 256-bit secret
      });

      // Obter secret em base32 (padrão para QR codes)
      const secret = totp.secret.base32;

      // Gerar QR code como data URL
      const qrCode = await QRCode.toDataURL(totp.toString(), {
        width: 200,
        margin: 1,
        color: { dark: "#000", light: "#fff" },
      });

      return { secret, qrCode };
    } catch (error) {
      console.error("Error generating TOTP secret:", error);
      throw new Error("Failed to generate TOTP secret");
    }
  }

  /**
   * Verificar código TOTP
   * 
   * Uso: Quando usuário faz login e insere código do autenticador
   * 
   * @param secret - Secret em base32
   * @param token - Código digitado pelo usuário (6 dígitos)
   * @returns true se válido, false se inválido ou expirado
   */
  static verifyToken(secret: string, token: string): boolean {
    try {
      // Validar formato do token
      if (!token || !/^\d{6}$/.test(token)) {
        return false;
      }

      // Criar TOTP com o secret
      const totp = new OTPAuth.TOTP({
        ...this.TOTP_CONFIG,
        secret: secret,
      });

      // Verificar token com janela de tempo
      // window: 1 = aceita token anterior/próximo (para sincronização de relógio)
      const delta = totp.validate({ token, window: 1 });

      return delta !== null;
    } catch (error) {
      console.error("Error verifying TOTP token:", error);
      return false;
    }
  }

  /**
   * Gerar códigos de backup (recovery codes)
   * 
   * Uso: Providenciar ao usuário em caso de perda de autenticador
   * 
   * @returns Array de 10 códigos aleatórios
   */
  static generateBackupCodes(): string[] {
    const codes: string[] = [];
    for (let i = 0; i < 10; i++) {
      const code = Array.from({ length: 8 }, () =>
        Math.floor(Math.random() * 10)
      ).join("");
      codes.push(code);
    }
    return codes;
  }

  /**
   * Verificar código de backup (uso único)
   * 
   * @param backupCodes - Array de códigos not yet used
   * @param code - Código digitado pelo usuário
   * @returns { valid: boolean, remainingCodes: string[] }
   */
  static verifyBackupCode(
    backupCodes: string[],
    code: string
  ): { valid: boolean; remainingCodes: string[] } {
    const index = backupCodes.indexOf(code);

    if (index === -1) {
      return { valid: false, remainingCodes: backupCodes };
    }

    // Remover código usado
    const remainingCodes = [
      ...backupCodes.slice(0, index),
      ...backupCodes.slice(index + 1),
    ];

    return { valid: true, remainingCodes };
  }
}

export default TotpService;
```

---

### PASSO 3: Criar Edge Function - TOTP Setup

**Arquivo**: `supabase/functions/totp-setup/index.ts`

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { TotpService } from "../_shared/totp.ts";
import { buildCorsHeaders } from "../_shared/cors.ts";
import { validateRequiredJWT } from "../_shared/security.ts";

serve(async (req) => {
  const corsHeaders = buildCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validar JWT - requer autenticação
    const jwtCheck = await validateRequiredJWT(req, corsHeaders);
    if (jwtCheck.error) {
      return jwtCheck.error;
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const userId = jwtCheck.user?.id;
    if (!userId) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    // Gerar novo secret + QR code
    const { secret, qrCode } = await TotpService.generateSecret(userId);

    // Gerar backup codes
    const backupCodes = TotpService.generateBackupCodes();

    // NÃO salvar secret no banco ainda - apenas gerar
    // User deve confirmar com código válido via totp-verify

    return new Response(
      JSON.stringify({
        secret: secret, // Mostrar para usuário
        qrCode: qrCode, // Data URL para escanear
        backupCodes: backupCodes, // Download e guardar offline
        message: "Configure seu autenticador e confirme o código",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in totp-setup:", error);

    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
```

---

### PASSO 4: Criar Edge Function - TOTP Verify

**Arquivo**: `supabase/functions/totp-verify/index.ts`

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { TotpService } from "../_shared/totp.ts";
import { buildCorsHeaders } from "../_shared/cors.ts";
import { validateRequiredJWT, SecurityLogger } from "../_shared/security.ts";

serve(async (req) => {
  const corsHeaders = buildCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validar JWT
    const jwtCheck = await validateRequiredJWT(req, corsHeaders);
    if (jwtCheck.error) {
      return jwtCheck.error;
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const logger = new SecurityLogger(supabase);
    const userId = jwtCheck.user?.id;

    if (!userId) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    // Parse request body
    const requestData = await req.json();
    const { secret, token, backupCodes } = requestData;

    if (!secret || !token) {
      return new Response(
        JSON.stringify({ error: "Missing secret or token" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Verificar token TOTP
    const isValidToken = TotpService.verifyToken(secret, token);

    if (!isValidToken) {
      // Log falha de autenticação
      await logger.log({
        event_type: "2fa_verification_failed",
        user_id: userId,
        details: { reason: "Invalid TOTP token" },
        severity: "warning",
      });

      return new Response(
        JSON.stringify({ error: "Invalid TOTP token" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401,
        }
      );
    }

    // Token válido - salvar secret no banco (enableMFA)
    const { error: updateError } = await supabase
      .from("user_totp")
      .upsert({
        user_id: userId,
        secret: secret,
        backup_codes: backupCodes || [],
        enabled_at: new Date().toISOString(),
      });

    if (updateError) {
      console.error("Error saving TOTP:", updateError);

      return new Response(
        JSON.stringify({ error: "Failed to enable 2FA" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    // Log sucesso
    await logger.log({
      event_type: "2fa_enabled",
      user_id: userId,
      details: { method: "TOTP" },
      severity: "info",
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "2FA enabled successfully",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in totp-verify:", error);

    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
```

---

### PASSO 5: Criar Componente React para Setup 2FA

**Arquivo**: `src/components/TwoFactorSetup.tsx`

```typescript
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Copy, Download, CheckCircle2, AlertCircle } from 'lucide-react';

interface TwoFactorSetupProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const TwoFactorSetup = ({
  isOpen,
  onClose,
  onSuccess,
}: TwoFactorSetupProps) => {
  const [step, setStep] = useState<'start' | 'generate' | 'verify' | 'backup' | 'complete'>(
    'start'
  );
  const [secret, setSecret] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [codesViewed, setCodesViewed] = useState(false);

  const handleGenerateSecret = async () => {
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.functions.invoke('totp-setup');

      if (error) throw error;

      setSecret(data.secret);
      setQrCode(data.qrCode);
      setBackupCodes(data.backupCodes);
      setStep('generate');
    } catch (err) {
      setError((err as any).message || 'Failed to generate TOTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode || !/^\d{6}$/.test(verificationCode)) {
      setError('Por favor insira um código válido de 6 dígitos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.functions.invoke('totp-verify', {
        body: {
          secret,
          token: verificationCode,
          backupCodes,
        },
      });

      if (error) throw error;

      setStep('backup');
    } catch (err) {
      setError((err as any).message || 'Código inválido');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadBackupCodes = () => {
    const content = `Códigos de Backup - Tikvah 2FA\n================================\n\n${backupCodes.join(
      '\n'
    )}\n\nGuarde estes códigos em local seguro. Cada código pode ser usado UMA VEZ.`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tikvah-backup-codes.txt';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleComplete = () => {
    setStep('complete');
    setTimeout(() => {
      onSuccess();
      onClose();
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Configurar Autenticação de Dois Fatores</DialogTitle>
          <DialogDescription>
            Proteja sua conta com TOTP (autenticador de uma única senha)
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* STEP 1: Start */}
          {step === 'start' && (
            <div className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  2FA adiciona uma camada extra de segurança à sua conta. Você precisará
                  de um autenticador (Google Authenticator, Authy, 1Password, etc.)
                </AlertDescription>
              </Alert>

              <Button onClick={handleGenerateSecret} disabled={loading} className="w-full">
                {loading ? 'Gerando...' : 'Iniciar Configuração'}
              </Button>
            </div>
          )}

          {/* STEP 2: Generate Secret */}
          {step === 'generate' && qrCode && (
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">1. Escaneie o código QR</p>
                <div className="flex justify-center bg-white p-4 rounded">
                  <img src={qrCode} alt="QR Code para autenticador" className="w-48 h-48" />
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">2. Ou insira manualmente este código:</p>
                <div className="flex gap-2">
                  <code className="flex-1 p-2 bg-gray-100 rounded font-mono text-sm break-all">
                    {secret}
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(secret);
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">3. Insira o código de 6 dígitos do seu autenticador</p>
                <Input
                  type="text"
                  placeholder="000000"
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button onClick={handleVerifyCode} disabled={loading || verificationCode.length !== 6} className="w-full">
                {loading ? 'Verificando...' : 'Verificar e Continuar'}
              </Button>
            </div>
          )}

          {/* STEP 3: Backup Codes */}
          {step === 'backup' && (
            <div className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Salve estes códigos em um local seguro. Use-os para acessar sua conta se perder
                  o autenticador.
                </AlertDescription>
              </Alert>

              <div className="bg-gray-100 p-4 rounded font-mono text-sm space-y-2 max-h-48 overflow-y-auto">
                {backupCodes.map((code, index) => (
                  <div key={index}>{code}</div>
                ))}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleDownloadBackupCodes}
                  className="flex-1"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download códigos
                </Button>
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(backupCodes.join('\n'));
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar
                </Button>
              </div>

              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="viewed-codes"
                  checked={codesViewed}
                  onChange={(e) => setCodesViewed(e.target.checked)}
                  className="mt-1"
                />
                <label htmlFor="viewed-codes" className="text-sm">
                  Confirmei que salvei os códigos de backup em local seguro
                </label>
              </div>

              <Button onClick={handleComplete} disabled={!codesViewed} className="w-full">
                Completar Configuração
              </Button>
            </div>
          )}

          {/* STEP 4: Complete */}
          {step === 'complete' && (
            <div className="text-center space-y-4 py-8">
              <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto" />
              <div>
                <h3 className="font-semibold">Autenticação de Dois Fatores Ativada!</h3>
                <p className="text-sm text-gray-600">
                  Sua conta agora está protegida com 2FA
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TwoFactorSetup;
```

---

### PASSO 6: Modificar useAuth para suportar TOTP

**Arquivo**: `src/hooks/useAuth.ts`

```typescript
// Adicionar ao final do hook:

const signInWith2FA = async (
  email: string,
  password: string,
  totpCode?: string
) => {
  try {
    // Step 1: Login com email/password
    const { error, data } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) {
      return { error };
    }

    // Step 2: Verificar se usuário tem 2FA ativado
    const { data: totpData, error: totpError } = await supabase
      .from('user_totp')
      .select('*')
      .eq('user_id', data.session?.user?.id)
      .single();

    if (totpData?.enabled_at) {
      // 2FA is required
      if (!totpCode) {
        return {
          error: null,
          requiresMFA: true,
          sessionId: data.session?.access_token,
        };
      }

      // Verificar TOTP code via edge function
      const { data: verifyData, error: verifyError } =
        await supabase.functions.invoke('totp-verify', {
          body: {
            secret: totpData.secret,
            token: totpCode,
          },
        });

      if (verifyError) {
        return { error: new Error('Invalid 2FA code') };
      }

      // MFA verification successful
      return { data, success: true };
    }

    return { data };
  } catch (err) {
    return { error: err as Error };
  }
};

// Exportar função
return {
  signIn,
  signInWith2FA,
  signUp,
  signOut,
  user,
  session,
  loading,
  isAdmin,
};
```

---

### PASSO 7: Criar Fluxo de Login com 2FA

**Arquivo**: `src/pages/LoginPage.tsx` (modificar)

```typescript
const [mfaRequired, setMfaRequired] = useState(false);
const [totpCode, setTotpCode] = useState('');

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  if (mfaRequired) {
    // Login com MFA
    const { error } = await signInWith2FA(email, password, totpCode);
    if (error) {
      setError(error.message);
      return;
    }
    navigate('/');
  } else {
    // Login regular
    const result = await signInWith2FA(email, password);

    if (result.requiresMFA) {
      setMfaRequired(true);
      return;
    }

    if (result.error) {
      setError(result.error.message);
      return;
    }

    navigate('/');
  }
};

// UI:
{mfaRequired && (
  <div className="space-y-4">
    <label>Código de 6 dígitos do seu autenticador</label>
    <Input
      type="text"
      placeholder="000000"
      maxLength={6}
      value={totpCode}
      onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
    />
  </div>
)}
```

---

### PASSO 8: Schema do Banco de Dados

**SQL para Supabase**:

```sql
-- Criar tabela user_totp
CREATE TABLE IF NOT EXISTS user_totp (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  secret VARCHAR(32) NOT NULL,
  backup_codes TEXT[] DEFAULT '{}',
  enabled_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id),
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Índices para performance
CREATE INDEX idx_user_totp_user_id ON user_totp(user_id);

-- Tabela de auditoria para falhas de MFA
CREATE TABLE IF NOT EXISTS mfa_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  event_type TEXT,
  status TEXT,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE user_totp ENABLE ROW LEVEL SECURITY;
ALTER TABLE mfa_audit ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Users can view their own TOTP data"
  ON user_totp FOR SELECT
  USING (auth.uid() = user_id);
```

---

## 🧪 TESTING CHECKLIST

### Teste 1: Setup 2FA

```bash
1. Ir para /settings/security
2. Clicar "Ativar 2FA"
3. Escanear QR code com Google Authenticator
4. Insira código de 6 dígitos
5. ✅ Deve mostrar "2FA ativado"
```

### Teste 2: Login com 2FA

```bash
1. Logout
2. Ir para /login com conta que tem 2FA
3. Insira email/password
4. ✅ Deve pedir código de autenticador
5. Insira código valid
6. ✅ Deve fazer login
```

### Teste 3: Código inválido

```bash
1. Na tela MFA, insira código inválido
2. ✅ Deve mostrar "Código inválido"
3. Tente 3 vezes
4. ✅ Deve blocar temporariamente (rate limiting)
```

### Teste 4: Backup codes

```bash
1. Na página de setup, download códigos de backup
2. Logout e desinstale o autenticador
3. Tente fazer login
4. Na tela MFA, insira um backup code
5. ✅ Deve aceitar e fazer login
6. ✅ Código usado deve ser marcado como gasto
```

---

## 📊 SUCCESS METRICS

| Métrica | Target | Validação |
|---------|--------|-----------|
| **2FA Setup Time** | < 2 minutos | Cronometrar usuário novo |
| **MFA Failure Rate** | < 2% | Monitorar security_incidents |
| **Backup Code Redemption** | < 5% | Métrica de segurança (bom sinal) |
| **Admin MFA Adoption** | 100% | Auditoria na fase de deployment |

---

## 🚨 CONSIDERAÇÕES DE SEGURANÇA

1. **Sincronização de Relógio**: Aceitar códigos do período atual ± 1 = 60s de margem
2. **Timing Attacks**: Usar comparison segura (crypto.timingSafeEqual se Node.js)
3. **Rate Limiting**: Máx 3 tentativas inválidas por 5 minutos
4. **Backup Codes**: Armazenar com hash SHA-256, não em texto plano
5. **Loss of Device**: Fornecer recovery flow via email + identity verification

---

**Próximo Passo**: Implementar segundo os 10 passos acima. Tempo estimado: **6.5 horas**.
