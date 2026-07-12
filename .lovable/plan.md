## Objetivo

Elevar a maturidade de segurança, observabilidade, SEO e testes automatizados a nível sênior, sem quebrar RPCs nem regressões existentes. Entregas divididas em 9 frentes independentes, aplicadas em uma única iteração e verificadas por build + testes + rescan.

---

## 1. Observabilidade e rate-limit persistente em `send-contact-email`

Substituir o rate-limit em memória (perde estado a cada cold start, ineficaz contra atacante distribuído em múltiplas instâncias) por rate-limit persistente na tabela `rate_limits` já existente, e enriquecer os logs.

- Endpoint key: `send-contact-email:ip:<ip>`; janela 10 min; máximo 3; bloqueio 1h após excedido — alinhado ao padrão de `send-appointment-email` e ao `AdvancedRateLimiter` de `supabase/functions/_shared/security.ts`.
- Instrumentação estruturada por requisição, sempre com o mesmo shape JSON:
  - `event`: `request_received` | `rate_limit_blocked` | `validation_failed` | `sent` | `error`
  - `ip`, `ua_hash` (SHA-256 truncado para evitar PII no log), `status`, `retry_after`, `reason`, `duration_ms`, `request_id` (uuid gerado no início).
- Registrar em `security_incidents` (severity `medium`) sempre que houver bloqueio por rate-limit ou payload malformado repetido do mesmo IP; o trigger existente `trigger_security_alert` já dispara webhook para severidades altas.
- Header `X-Request-Id` na resposta para correlação cliente↔servidor.

### Zod + hardening de input

- Schema Zod estrito: `name` (1–100, trim, sem HTML), `email` (RFC + `.toLowerCase().trim()`, ≤255), `phone` opcional (regex E.164-ish), `subject` (1–200), `message` (1–2000). `.strict()` para rejeitar chaves extras — o campo `to` do body é ignorado sem opção de override.
- `reply_to` derivado exclusivamente do `email` validado; `subject` é normalizado por regex removendo `\r\n` (defesa header injection contra Resend).
- Destinatário admin permanece hardcoded em `ADMIN_RECIPIENT`.

---

## 2. Migração SQL cirúrgica de permissões

Revogar/ajustar `EXECUTE` apenas nas funções sinalizadas pelo linter, uma a uma, sem `ALTER DEFAULT PRIVILEGES` global (que quebraria RPCs futuras). Padrão:

```
REVOKE EXECUTE ON FUNCTION public.<fn>(<sig>) FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.<fn>(<sig>) TO <role explícito>;
```

Aplicado a: `get_security_stats`, `cleanup_expired_blacklist`, `clean_old_rate_limits`, `cleanup_expired_rate_limits`, `daily_security_cleanup`, `log_proposal_received`, `log_proposal_status_change`, `trigger_security_alert`, `handle_new_user`, `update_updated_at_column` — todas restritas a `service_role`; `has_role` mantém `authenticated`; `get_order_by_token` mantém `anon, authenticated` (rota de guest checkout por token).

---

## 3. Lighthouse CI para páginas de Services

Ampliar `.lighthouserc.json` e `.github/workflows/lighthouse-ci.yml`:

- URLs: `/servicos/psicoterapia`, `/servicos/cursos`, `/servicos/workshops` (além da EcosystemDetail já existente).
- Budgets falham o job:
  - performance ≥ 0.85, accessibility ≥ 0.95, best-practices ≥ 0.9, seo ≥ 0.95.
  - LCP ≤ 2.5s, CLS ≤ 0.1, TBT ≤ 200ms, INP ≤ 200ms.
- 3 execuções por URL, mediana; artefato HTML anexado ao PR.

---

## 4. Auditoria `data-track-click`

- Script `scripts/audit-track-click.ts` (Node) percorre `src/**/*.tsx`, extrai todos os `data-track-click`, verifica: naming kebab-case, unicidade por página, cobertura mínima em CTAs (`button`, `a[href^="/"]`).
- Teste Vitest `src/test/data-track-click.audit.test.ts` chama o script — falha o pipeline se houver CTA sem tracking.
- E2E Playwright `e2e/tracking.spec.ts` intercepta `dataLayer.push` (mock) em `Psicoterapia`, `Cursos`, `Workshops`, `Consultoria` e valida que cada CTA principal emite evento `{ event: 'cta_click', track_id: '<slug>' }`.

---

## 5. Testes SEO/JSON-LD por rota de serviço

`e2e/services.seo.spec.ts` — para cada rota `/servicos/*`:

- `<title>` presente, ≤ 60 chars, distinto por rota.
- `<meta name="description">` ≤ 160 chars.
- `<link rel="canonical">` absoluto e igual à URL sem query.
- Open Graph completo (`og:title`, `og:description`, `og:type=website`, `og:url`).
- Twitter Card (`twitter:card=summary_large_image`).
- JSON-LD parseável contendo tipos: `Service`, `Organization`, `BreadcrumbList`; `Consultoria` adiciona `LocalBusiness` (endereço Maputo).

---

## 6. E2E do `MultiStepBudgetForm`

`e2e/services.budget-form.spec.ts`:

- Passo 1: validação em tempo real (nome curto → erro Zod aparece ≤ 300ms; email inválido bloqueia "Próximo").
- Persistência: preencher parcial, `page.reload()`, campos restaurados do `localStorage`.
- Passos 2 e 3: navegação para frente/trás mantém dados; botão "Anterior" foca no primeiro campo (a11y).
- Sucesso: mock de `supabase.functions.invoke('send-contact-email')` retorna 200 → toast de sucesso, form limpo, `localStorage` apagado.
- Erro: mock retorna 429 → mensagem acessível `role="alert"`, dados preservados.

---

## 7. Migração de `Consultoria` para `ServicePageTemplate`

- Adicionar entrada `consultoria` em `src/config/services.ts` (hero, features, pricing tiers, FAQ, SEO metadata, coordenadas Maputo para `LocalBusiness`).
- Reescrever `src/pages/services/Consultoria.tsx` como wrapper `<ServicePageTemplate config={consultoriaConfig} />`.
- Preservar o `ConsultoriaMenuBar` como slot opcional do template (nova prop `stickyNav?: ReactNode`).
- Atualizar testes de rotas para incluir Consultoria nos itens 3, 4, 5.

---

## 8. E2E de XSS no export PDF/CSV

`e2e/security.xss-export.spec.ts`:

- Login admin (via sessão managed, ver contexto de teste).
- Seed em `security_incidents` (via edge function de teste ou direto no DB de dev) com `ip_address = '<img src=x onerror="window.__pwned=true">'`, `user_agent = '<script>window.__pwned=true</script>'`, `endpoint = 'javascript:alert(1)'`.
- Abrir Security Dashboard → clicar "Exportar PDF".
- Assertivas:
  - Nova janela abre; `window.__pwned` é `undefined` após 2s.
  - O `<meta http-equiv="Content-Security-Policy">` está presente e proíbe `script-src`.
  - Nenhuma tag `<script>`, `<img onerror>`, `<iframe>` no DOM da janela impressa.
  - O texto do payload aparece literalmente (via `textContent`), provando defesa por escaping.
- CSV: download, parse, verificar que a célula do payload é envolvida por `"..."` e prefixada com `'` se começar com `=+-@`.

---

## 9. Security scanning em CI

`.github/workflows/security-audit.yml` (já existe — expandir):

- `bun audit` (dependências) — falha em `high`/`critical`.
- `gitleaks` (secrets) — falha se detectar.
- `semgrep --config p/owasp-top-ten --config p/typescript` — falha em `ERROR`.
- Job separado `sql-lint` roda `sqlfluff` nos arquivos `supabase/migrations/*.sql`.
- Roda em cada PR e em push para `main`; artefato SARIF publicado no GitHub Security tab.

---

## 10. Verificação final

- `bun run build:dev` limpo.
- Playwright: `bunx playwright test e2e/services.* e2e/security.* e2e/tracking.spec.ts`.
- Vitest: `bunx vitest run`.
- Rerun do security scan (`security--run_security_scan`) — objetivo: zero findings em `agent_security`, `supabase`, `supabase_lov`, `connector_security_scan`, `supply_chain`.

---

## Detalhes técnicos

### Arquivos criados

- `supabase/migrations/<timestamp>_harden_function_grants.sql`
- `scripts/audit-track-click.ts`
- `src/test/data-track-click.audit.test.ts`
- `e2e/services.seo.spec.ts`
- `e2e/services.budget-form.spec.ts`
- `e2e/security.xss-export.spec.ts`
- `e2e/tracking.spec.ts`

### Arquivos editados

- `supabase/functions/send-contact-email/index.ts` — Zod + rate-limit persistente + logs estruturados + `X-Request-Id`.
- `supabase/functions/_shared/security.ts` — nova config `send-contact-email` no `AdvancedRateLimiter`.
- `src/config/services.ts` — entrada `consultoria`.
- `src/pages/services/Consultoria.tsx` — refatorado como wrapper.
- `src/components/services/shared/ServicePageTemplate.tsx` — nova prop `stickyNav`.
- `.lighthouserc.json` — 3 URLs adicionais + budgets.
- `.github/workflows/lighthouse-ci.yml` — matrix por URL.
- `.github/workflows/security-audit.yml` — semgrep + gitleaks + sqlfluff.

### Riscos e mitigações

- **Rate-limit persistente adiciona latência (~30–50ms de RTT ao Postgres).** Aceitável para endpoint de formulário; ganho de correção supera custo.
- **Migração de GRANTs pode quebrar chamadas hoje feitas com `anon`.** Mitigado revisando cada função contra os call sites no repositório antes de revogar; `get_order_by_token` explicitamente preservada.
- **Consultoria tem `ConsultoriaMenuBar` custom.** Preservada via slot no template — nenhum breaking change de UX.
- **E2E XSS depende de admin logado.** Usa fluxo de sessão managed do sandbox; se a instância for `external_unmanaged`, o teste é marcado `test.skip` com anotação.

### Fora do escopo (proposto para próxima iteração)

- Migrar rate-limit para Upstash/Redis (requer connector novo; hoje `rate_limits` no Postgres é suficiente).
- Substituir `data-track-click` por instrumentação server-side via Measurement Protocol.
