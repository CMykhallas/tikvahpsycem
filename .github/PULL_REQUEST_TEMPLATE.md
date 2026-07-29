## Descrição

<!-- O que muda e porquê -->

## Tipo de alteração

- [ ] Correcção de bug
- [ ] Nova funcionalidade
- [ ] Alteração de segurança/conformidade
- [ ] Refactor / limpeza (sem alteração de comportamento)
- [ ] Documentação

## Checklist de segurança (obrigatório para código que toca em auth, pagamentos, dados de utilizadores ou edge functions)

- [ ] Nenhuma credencial ou segredo foi commitado (verificado com `git diff`)
- [ ] Inputs novos/alterados são validados e sanitizados (client **e** server-side)
- [ ] Alterações a RLS/policies foram testadas com um utilizador não-admin
- [ ] Endpoints novos têm rate limiting configurado (ver `docs/RATE_LIMITS.md`)
- [ ] Logs não contêm dados sensíveis (usar `logger` de `src/lib/logger.ts`, nunca `console.*` directo em `src/`)
- [ ] `npm run security:check` passa localmente
- [ ] Se a alteração tem impacto em segurança/conformidade, foi adicionada uma linha em `CHANGELOG.md`

## Como testar

<!-- Passos para o revisor confirmar que funciona -->
