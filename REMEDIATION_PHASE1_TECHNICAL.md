# 🔧 PLANO DE REMEDIAÇÃO TÉCNICA - FASE 1 (CRÍTICO)
## Implementação em Detalhes - Sprint 1 (1-2 semanas)

**Status:** Ready to Implement  
**Responsável(is):** Tech Lead + 2 Developers  
**Estimativa:** 80 horas  
**Comit Message Template:** `fix(security): [TASK-X] [OWASP-XXX] Description`

---

## 📋 TASK 1.1: Instalar Definições de Tipos Node.js

### 🎯 Objetivo
Resolver erro TypeScript: `Cannot find type definition file for 'node'`

### ❌ Status Atual
```bash
npm run build
# Error: Cannot find type definition file for 'node'
# Location: tsconfig.node.json
```

### ✅ Solução Passo-a-Passo

**Passo 1:** Instalar dependência
```bash
# Option A: npm
npm install --save-dev @types/node @types/vite

# Option B: bun
bun add -d @types/node @types/vite

# Option C: pnpm
pnpm add -D @types/node @types/vite
```

**Passo 2:** Validar versão
```bash
npm ls @types/node
# @types/node@20.x.x (ou superior)
```

**Passo 3:** Testar build
```bash
npm run build
# ✅ Sem erros
```

**Passo 4:** Commit
```bash
git add package.json package-lock.json
git commit -m "fix(dependencies): install @types/node and @types/vite to resolve TypeScript compilation error"
git push origin main
```

### 📊 Validação
- [ ] `npm run build` passa sem erros
- [ ] `npm run type-check` passa 100%
- [ ] CI/CD pipeline verde
- [ ] Code review aprovado

### ⏱️ Tempo Estimado
- Implementation: 15 min
- Testing: 10 min
- Review + Deploy: 15 min
- **Total: 40 min**

---

## 📋 TASK 1.2: Implementar Rate Limiting Servidor-Side

### 🎯 Objetivo
Mover proteção de rate limiting do cliente para servidor (Edge Function)

### ❌ Vulnerabilidade Atual
```typescript
// Current: Client-side only ❌
rateLimiter.check(userIP, 10, 60000) // Facilmente bypassável
```

### ✅ Solução: Supabase Edge Function

**Passo 1:** Criar Edge Function
```bash
supabase functions new ratelimit
```

**Passo 2:** Implementar lógica
```typescript
// supabase/functions/ratelimit/index.ts
import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { userId, action, increment = 1 } = await req.json();
    const clientIP = req.headers.get("x-forwarded-for") || "unknown";
    const now = new Date();
    const windowStart = new Date(now.getTime() - 60 * 1000); // 1 minute window

    // Buscar contador existente
    const { data: existing, error: selectError } = await supabase
      .from("rate_limit_store")
      .select("*")
      .eq("user_id", userId)
      .eq("action", action)
      .gt("reset_time", now.toISOString())
      .single();

    if (selectError && selectError.code !== "PGRST116") {
      throw selectError;
    }

    if (!existing) {
      // Primeiro uso nesta janela
      await supabase.from("rate_limit_store").insert({
        user_id: userId,
        action,
        count: increment,
        reset_time: new Date(now.getTime() + 60 * 1000),
        client_ip: clientIP,
        blocked: false,
        first_attempt: now,
      });

      return new Response(
        JSON.stringify({ allowed: true, remaining: 10 - increment }),
        { status: 200 }
      );
    }

    // Verificação de limite
    const limit = 10; // Configurável por ação
    if (existing.count >= limit) {
      // Log suspicious activity
      await supabase.from("security_incidents").insert({
        incident_type: "rate_limit_exceeded",
        user_id: userId,
        details: {
          action,
          attempts: existing.count,
          ip: clientIP,
        },
        severity: "medium",
      });

      return new Response(
        JSON.stringify({
          allowed: false,
          error: "Rate limit exceeded",
          retryAfter: 60,
        }),
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }

    // Incrementar contador
    await supabase
      .from("rate_limit_store")
      .update({ count: existing.count + increment })
      .eq("id", existing.id);

    return new Response(
      JSON.stringify({ allowed: true, remaining: limit - (existing.count + increment) }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Rate limit error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
});
```

**Passo 3:** Criar tabela suporte
```sql
-- supabase/migrations/20260728_rate_limit_store.sql
CREATE TABLE IF NOT EXISTS rate_limit_store (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  count INTEGER DEFAULT 1,
  reset_time TIMESTAMP NOT NULL,
  client_ip INET,
  blocked BOOLEAN DEFAULT FALSE,
  first_attempt TIMESTAMP DEFAULT now(),
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_rate_limit_user_action ON rate_limit_store(user_id, action, reset_time);
CREATE INDEX idx_rate_limit_reset ON rate_limit_store(reset_time);

-- Auto-cleanup de registros antigos (executar diariamente)
CREATE OR REPLACE FUNCTION cleanup_rate_limit_store()
RETURNS void AS $$
BEGIN
  DELETE FROM rate_limit_store
  WHERE reset_time < now() - interval '1 day';
END;
$$ LANGUAGE plpgsql;
```

**Passo 4:** Integrar no cliente
```typescript
// src/utils/client-ratelimit.ts
export const checkRateLimit = async (
  action: string,
  userId?: string
): Promise<{ allowed: boolean; remaining?: number; retryAfter?: number }> => {
  const { data, error } = await supabase.functions.invoke("ratelimit", {
    body: {
      userId: userId || "anonymous",
      action,
    },
  });

  if (error) {
    console.error("Rate limit check failed:", error);
    // Falhar aberto (allow) se serviço falhar
    return { allowed: true };
  }

  return data;
};
```

**Passo 5:** Usar em checkout
```typescript
// src/pages/Checkout.tsx
const handleCheckout = async () => {
  const rateLimitCheck = await checkRateLimit("checkout", user?.id);
  
  if (!rateLimitCheck.allowed) {
    toast.error(`Rate limit exceeded. Retry in ${rateLimitCheck.retryAfter}s`);
    return;
  }

  // Proceder com checkout
};
```

### 🧪 Testes
```typescript
// tests/ratelimit.test.ts
describe("Rate Limiter", () => {
  it("should allow first request", async () => {
    const result = await checkRateLimit("test_action", "user123");
    expect(result.allowed).toBe(true);
  });

  it("should block after 10 requests", async () => {
    for (let i = 0; i < 10; i++) {
      await checkRateLimit("test_action", "user123");
    }
    const result = await checkRateLimit("test_action", "user123");
    expect(result.allowed).toBe(false);
    expect(result.retryAfter).toBe(60);
  });
});
```

### ⏱️ Tempo Estimado
- Edge Function: 1h
- Database: 30 min
- Integration: 1h
- Testing: 1.5h
- Review + Deploy: 30 min
- **Total: 4.5 horas**

---

## 📋 TASK 1.3: Implementar 2FA/MFA Obrigatório

### 🎯 Objetivo
Implementar TOTP (Time-based One-Time Password) para admins

### ❌ Vulnerabilidade Atual
```typescript
// Current: Email/Password only ❌
const { error } = await supabase.auth.signInWithPassword({ email, password });
```

### ✅ Solução: TOTP Integration

**Passo 1:** Instalar dependência
```bash
npm install otplib qrcode
```

**Passo 2:** Criar tabela TOTP
```sql
-- supabase/migrations/20260728_totp_setup.sql
CREATE TABLE IF NOT EXISTS user_totp (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  secret TEXT NOT NULL,
  backup_codes TEXT[] NOT NULL,
  enabled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT now(),
  last_used TIMESTAMP
);

ALTER TABLE user_totp ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own TOTP settings"
ON user_totp
FOR SELECT
USING (auth.uid() = user_id);
```

**Passo 3:** Criar serviço TOTP
```typescript
// src/utils/totpService.ts
import { authenticator } from "otplib";
import QRCode from "qrcode";

export const totpService = {
  async generateSecret(email: string) {
    const secret = authenticator.generateSecret();
    const otpauth = authenticator.keyuri(
      email,
      "Tikvah",
      secret
    );
    const qrCode = await QRCode.toDataURL(otpauth);
    
    return { secret, qrCode };
  },

  verifyToken(secret: string, token: string): boolean {
    return authenticator.verify({ secret, encoding: "base32", token });
  },

  generateBackupCodes(count = 10): string[] {
    return Array.from({ length: count }, () =>
      Math.random().toString(36).substring(2, 10).toUpperCase()
    );
  },
};
```

**Passo 4:** Criar componente setup
```typescript
// src/components/TotpSetup.tsx
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { totpService } from "@/utils/totpService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export const TotpSetup = ({ userId }: { userId: string }) => {
  const [step, setStep] = useState<"generate" | "verify" | "backup">("generate");
  const [secret, setSecret] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);

  const handleGenerateSecret = async () => {
    const { secret, qrCode } = await totpService.generateSecret("user@example.com");
    setSecret(secret);
    setQrCode(qrCode);
    setStep("verify");
  };

  const handleVerifyToken = async () => {
    const isValid = totpService.verifyToken(secret, verificationCode);
    
    if (!isValid) {
      alert("Invalid TOTP code");
      return;
    }

    const backups = totpService.generateBackupCodes();
    setBackupCodes(backups);

    // Salvam no banco
    await supabase.from("user_totp").upsert({
      user_id: userId,
      secret,
      backup_codes: backups,
      enabled: true,
    });

    setStep("backup");
  };

  return (
    <div className="space-y-4">
      {step === "generate" && (
        <Button onClick={handleGenerateSecret}>Generate TOTP Secret</Button>
      )}

      {step === "verify" && (
        <div className="space-y-4">
          <img src={qrCode} alt="TOTP QR Code" className="w-48" />
          <Input
            placeholder="6-digit code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            maxLength={6}
          />
          <Button onClick={handleVerifyToken}>Verify</Button>
        </div>
      )}

      {step === "backup" && (
        <Card className="p-4">
          <p className="font-bold mb-2">Backup Codes (Guardar com segurança)</p>
          {backupCodes.map((code, i) => (
            <div key={i}>{code}</div>
          ))}
          <Button onClick={() => setStep("generate")} className="mt-4">
            Done
          </Button>
        </Card>
      )}
    </div>
  );
};
```

**Passo 5:** Modificar login
```typescript
// src/hooks/useAuth.ts (atualizado)
const signIn = async (email: string, password: string, totpCode?: string) => {
  // Step 1: Authenticate with password
  const { data, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError) return { error: authError };

  // Step 2: Check if 2FA is enabled
  const { data: mfaUser } = await supabase
    .from("user_totp")
    .select("enabled")
    .eq("user_id", data.user.id)
    .single();

  if (mfaUser?.enabled) {
    if (!totpCode) {
      return {
        error: { message: "2FA_REQUIRED" },
        requiresMFA: true,
      };
    }

    // Verify TOTP
    const isValid = totpService.verifyToken(mfaUser.secret, totpCode);
    if (!isValid) {
      return { error: { message: "Invalid 2FA code" } };
    }
  }

  return { data };
};
```

### 🧪 Testes
```typescript
describe("TOTP Service", () => {
  it("should generate valid secret", async () => {
    const { secret, qrCode } = await totpService.generateSecret("test@example.com");
    expect(secret).toHaveLength(32);
    expect(qrCode).toContain("data:image");
  });

  it("should verify valid token", () => {
    const secret = "JBSWY3DPEBLW64TMMQ======";
    const token = authenticator.generate(secret); // Real token
    expect(totpService.verifyToken(secret, token)).toBe(true);
  });

  it("should reject invalid token", () => {
    const secret = "JBSWY3DPEBLW64TMMQ======";
    expect(totpService.verifyToken(secret, "000000")).toBe(false);
  });
});
```

### ⏱️ Tempo Estimado
- Database setup: 30 min
- Service implementation: 1h
- UI Components: 1h
- Integration in Auth: 1h
- Testing: 1.5h
- Documentation: 30 min
- Review + Deploy: 45 min
- **Total: 6.5 horas**

---

## 📋 TASK 1.4: Remover `unsafe-eval` do CSP

### 🎯 Objetivo
Enrijecer Content Security Policy removendo `'unsafe-eval'`

### ❌ Vulnerabilidade Atual
```
script-src 'self' 'unsafe-inline' 'unsafe-eval' ...  ❌
```

### ✅ Solução

**Passo 1:** Atualizar Vercel.json
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' https://unpkg.com https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https: blob:; connect-src 'self' https://rrlwabtzwvurhhfwpmiq.supabase.co wss://rrlwabtzwvurhhfwpmiq.supabase.co; font-src 'self' https://fonts.gstatic.com; object-src 'none'; frame-ancestors 'self'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests; block-all-mixed-content"
        }
      ]
    }
  ]
}
```

**Passo 2:** Atualizar SecurityProvider.tsx
```typescript
// src/components/SecurityProvider.tsx
const cspMeta = document.createElement("meta");
cspMeta.httpEquiv = "Content-Security-Policy";
cspMeta.content = "default-src 'self'; script-src 'self' https://unpkg.com https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https: blob:; connect-src 'self' https://rrlwabtzwvurhhfwpmiq.supabase.co wss://rrlwabtzwvurhhfwpmiq.supabase.co; font-src 'self' https://fonts.gstatic.com; object-src 'none'; frame-ancestors 'self'; upgrade-insecure-requests";
document.head.appendChild(cspMeta);
```

**Passo 3:** Testar compatibilidade
```bash
npm run build  # Verificar se há erros de inline eval
npm run dev    # Testar em desenvolvimento
```

**Passo 4:** Validation
```typescript
// Verificar CSP violations
window.addEventListener("securitypolicyviolation", (e: SecurityPolicyViolationEvent) => {
  console.warn("CSP Violation:", e.violatedDirective, e.blockedURI);
  // Log para analytics
});
```

### 🧪 Testes
```bash
# Verificar se CSP é enviada corretamente
curl -I https://tikvahpsycem.vercel.app | grep -i "content-security-policy"

# Executar CSP violation test
npm run test:csp
```

### ⏱️ Tempo Estimado
- Configuration update: 30 min
- Testing: 1h
- Fixing violations: 1.5h
- Review + Deploy: 30 min
- **Total: 3.5 horas**

---

## 📊 FASE 1 - RESUMO EXECUTIVO

### Total: 14.5 horas de desenvolvimento

| Task | Dev | QA | Review | Deploy | Total |
|------|-----|----|----|--------|-------|
| 1.1 - @types/node | 0.4h | 0.2h | 0.2h | 0.2h | 1h |
| 1.2 - Rate Limit | 1h | 1h | 1h | 0.5h | 3.5h |
| 1.3 - 2FA/MFA | 3h | 1.5h | 1.5h | 0.75h | 6.75h |
| 1.4 - Remove unsafe-eval | 1h | 0.5h | 0.5h | 0.25h | 2.25h |
| **TOTAL** | **5.4h** | **3.2h** | **3.2h** | **1.7h** | **13.5h** |

### Recursos Necessários
- 2 Desenvolvedores JavaScript/TypeScript
- 1 QA/Tester
- 1 Tech Lead para review
- DevOps para deployment

### Validação Pós-Deploy
- [ ] `npm run security:check` passa 100%
- [ ] Todos os testes E2E passam
- [ ] Nenhuma CSP violation em console
- [ ] Rate limiter funciona (verificar logs)
- [ ] 2FA login flow testado
- [ ] Sem regressões de performance

### Go-Live Checklist
- [ ] Todos os PRs merged
- [ ] Staging environment validado
- [ ] Rollback plan documentado
- [ ] Monitoring alertas configurados
- [ ] Team notificado
- [ ] Changelog atualizado

