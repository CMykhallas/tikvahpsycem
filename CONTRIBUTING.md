# Guia de Contribuição

Este é um projecto proprietário da Tikvah Psychological Center — este guia destina-se
à equipa interna e a colaboradores autorizados, não é um convite a contribuições externas.

## Antes de começar

```sh
npm i
npm run dev
```

Ver `docs/architecture-and-data-flow-tikvah.md` para uma visão geral da arquitectura
(Vite + React + TypeScript no frontend, Supabase Postgres/Auth/Edge Functions no backend,
deploy contínuo na Vercel).

## Fluxo de trabalho

1. Cria uma branch a partir de `main`
2. Antes de abrir PR, corre localmente:
   ```sh
   npm run security:check   # type-check + lint + audit de dependências
   ```
3. Abre o PR — o template já traz o checklist de segurança
   (`.github/PULL_REQUEST_TEMPLATE.md`)
4. Alterações a áreas sensíveis (`supabase/functions/`, `supabase/migrations/`,
   autenticação, `vercel.json`) requerem revisão dedicada — ver `.github/CODEOWNERS`
5. Se a alteração tiver impacto em segurança/conformidade, adiciona uma linha em
   `CHANGELOG.md` sob `[Não lançado]`

## Convenções de código

- **Logging:** usar sempre `logger` de `src/lib/logger.ts` em código de `src/`, nunca
  `console.*` directamente (excepção deliberada: `SecurityProvider.tsx`, que intercepta
  `console.log` para detecção de DevTools). Em `supabase/functions/` (edge functions,
  runtime Deno server-side) o `console.*` directo é aceitável — não corre no browser.
- **Validação:** toda a validação de formulários novos deve usar `zod`, espelhando
  a validação já existente no servidor (edge function correspondente)
- **Rate limiting:** qualquer endpoint novo em `supabase/functions/` que aceite input
  de utilizadores não autenticados deve ter uma entrada em
  `supabase/functions/_shared/security.ts` (`AdvancedRateLimiter.configs`) — e essa
  entrada deve ser reflectida em `docs/RATE_LIMITS.md`
- **Migrações SQL:** DDL que possa falhar num ambiente específico (extensões,
  dependências opcionais) deve ser defensivo (bloco `DO $$ ... EXCEPTION WHEN OTHERS`),
  para nunca reverter o resto da migração — ver
  `supabase/migrations/20260729090000_data_masking_and_slow_query_monitoring.sql`
  como referência

## Segurança

Nunca commitar credenciais/segredos — `.env` está no `.gitignore` e o CI corre
`gitleaks` em cada push, mas a primeira linha de defesa és tu. Para reportar uma
vulnerabilidade (não uma issue normal), ver `SECURITY.md`.
