# Plano: Segurança Avançada, Observabilidade e CRO

## 1. Suíte E2E ampliada para XSS no export PDF/CSV
**Arquivo:** `e2e/security.xss-export.extended.spec.ts` (novo)

Payloads cobertos (matriz):
- `<script>window.__pwned=1</script>`
- `<img src=x onerror="window.__pwned=1">`
- `<svg onload="window.__pwned=1">`
- `<iframe src="javascript:window.__pwned=1"></iframe>`
- `javascript:alert(1)` em campos URL-like (endpoint)
- `"><script>alert(1)</script>` (breakout de atributo)
- `<a href="javascript:...">` em user_agent
- HTML entities duplas: `&lt;script&gt;` (não deve ser decodificado)
- Polyglot: `jaVasCript:/*-/*\`/*\\'/*'/*"/**/(/* */oNcliCk=alert() )//`
- CSS injection: `<style>@import 'evil'</style>`

Validações por payload:
- `window.__pwned` nunca definido
- Zero elementos `<script>`, `<iframe>`, `<object>`, `<embed>`, `[onerror]`, `[onload]`, `[onclick]` no DOM do PDF/CSV render window
- Meta CSP presente e estrita (`default-src 'none'; style-src 'unsafe-inline'; img-src data:`)
- `textContent` do payload aparece literal (não parsed)
- CSV: cada célula com `=`, `+`, `-`, `@`, tab, CR começa com `'` (formula guard)

Skip gracioso se sessão admin não injetada (mesma pattern do arquivo existente).

## 2. Lighthouse CI noturno com detecção de regressão
**Arquivo:** `.github/workflows/lighthouse-nightly.yml` (novo)

- Schedule cron `0 3 * * *` (03:00 UTC diário) + workflow_dispatch
- Roda todas as rotas de serviços (importa lista de `.lighthouserc.json`)
- Baseline por rota persistida como artifact (`lhci-baseline-<route>.json`)
- Job compara run atual vs baseline; falha SOMENTE se delta > thresholds:
  - INP: +50ms
  - LCP: +200ms
  - CLS: +0.02
  - TBT: +50ms
- Baseline atualizado no `main` bem-sucedido (commit no artifact store, não no repo)
- Reporte em issue automática quando falha

## 3. Painel admin `SecurityIncidents`
**Arquivos:**
- `src/pages/admin/SecurityIncidents.tsx` (novo)
- Rota `/admin/security-incidents` protegida via `ProtectedRoute` + `has_role('admin')`
- Reutiliza `useSecurityIncidents` hook

Features:
- Filtros: IP (input com debounce), reason/incident_type (select multi), request_id (input exato), status/severity (select)
- Range de datas: quick picks 24h/7d/30d/custom
- Tabela paginada (server-side via range) — 25/50/100 por página
- Export CSV com sanitização (reutiliza guard do `useExportReport`)
- Botões: "Exportar últimos 7d", "Exportar últimos 30d"
- Coluna "Copiar request_id" para correlação com logs de edge functions
- Link no menu `Administration.tsx`

## 4. Alertas automáticos de pico
**Nova edge function:** `supabase/functions/monitor-abuse-spikes/index.ts`
- Invocada por `pg_cron` a cada 5 minutos
- Query `security_incidents` das últimas 15 minutos agrupada por `(incident_type, details->>reason)`
- Thresholds configuráveis (env):
  - `SPIKE_RATE_LIMIT_THRESHOLD=10` bloqueios/15min por reason
  - `SPIKE_CRITICAL_THRESHOLD=3` incidentes críticos/15min
- Ao disparar: envia via Slack (`SLACK_WEBHOOK_URL`), Email (Resend → suporte.oficina.psicologo@proton.me), Discord (`DISCORD_WEBHOOK_URL`)
- Debounce: guarda última notificação em nova tabela `alert_dedupe` (1h por chave `type:reason`) para evitar spam

**Migração SQL:**
- Cria `alert_dedupe(key text PK, notified_at timestamptz)` com RLS service_role only
- Agenda `cron.schedule('monitor-abuse-spikes', '*/5 * * * *', ...)` (via `supabase--insert`, não migration)

## 5. Detalhes técnicos

**Rate limiting alertas — payload Slack:**
```json
{
  "blocks": [
    { "type": "header", "text": "🚨 Pico detectado: rate_limit_exceeded" },
    { "type": "section", "fields": [
      { "type": "mrkdwn", "text": "*Reason:* send-contact-email" },
      { "type": "mrkdwn", "text": "*Count:* 23 em 15min" },
      { "type": "mrkdwn", "text": "*Threshold:* 10" },
      { "type": "mrkdwn", "text": "*Top IPs:* 1.2.3.4 (12), 5.6.7.8 (8)" }
    ]}
  ]
}
```

**CSP no PDF window (endurecida):**
```html
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src data: blob:; font-src data:; base-uri 'none'; form-action 'none';">
```

## Aceitação
- Suíte XSS: 10+ payloads passam, todos escapados, nenhum `__pwned` no window
- Lighthouse noturno: roda schedule, falha apenas em regressão real
- Painel: filtros funcionais, CSV exportado sem fórmula injection, protegido por admin role
- Alertas: pico simulado dispara Slack+Email uma vez por hora por chave (dedupe funciona)

## Fora de escopo
- Migração de logs para Datadog/Grafana
- Autenticação 2FA no admin
- Substituição do Resend por SMTP próprio

## Riscos
- `pg_cron` requer extension habilitada (habilitar na migração)
- `alert_dedupe` deve ser limpo periodicamente (adicionar cleanup no `daily_security_cleanup`)
- Lighthouse baseline pode ficar stale — refresh manual via workflow_dispatch documentado
