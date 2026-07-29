# Changelog

Todas as alterações relevantes deste projecto são documentadas aqui.
Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/).

Este documento serve também como registo de gestão de mudanças
(ISO/IEC 27001:2022 — A.8.32, Change Management) para alterações com
impacto em segurança ou conformidade.

## [Não lançado]

### Segurança
- **Gap real descoberto e corrigido:** `create-checkout` chamava o rate limiter mas não tinha nenhuma configuração associada — o fallback do código aprovava sempre o pedido sem limite nenhum. Adicionada configuração (8 pedidos/15min autenticado, 3/30min sem sessão)
- Validação client-side (`zod`) adicionada ao formulário de checkout (nome, email, telefone)
- Rate limiting server-side adicionado ao endpoint `totp-verify`, prevenindo brute-force do código 2FA de 6 dígitos
- CSP restringida: removidas origens CDN (`unpkg.com`, `cdn.jsdelivr.net`) não utilizadas por nenhum recurso do projecto
- Logs de depuração (`console.log/warn/info/debug`) silenciados em produção via `src/lib/logger.ts` — `console.error` mantém-se activo para diagnóstico
- Funções de masking de PII (`mask_email`, `mask_phone`, `mask_name`) + view `orders_masked` para reporting sem expor dados completos
- `pg_stat_statements` activado (defensivamente) + view `slow_queries_report` para monitorização de queries lentas

### Adicionado
- Nova Edge Function `health-check` para monitorização externa de disponibilidade
- `docs/RATE_LIMITS.md` — limites de rate limiting documentados por endpoint, com os valores reais confirmados no código
- `CODEOWNERS`, template de Pull Request com checklist de segurança, templates de issue (incluindo redirecionamento de vulnerabilidades para canal privado)

### Removido
- `src/components/ui/ContactForm.tsx` — formulário órfão e não funcional (URL de destino nunca preenchida), sem qualquer referência no resto da aplicação
- `src/utils/cspAndSri.ts` e `src/utils/headerObfuscation.ts` — código morto, nunca importado; o segundo visava um servidor Express que não existe nesta stack (Vite + Vercel + Supabase Edge Functions)
- Duplicação de 9 ficheiros de documentação idênticos entre a raiz e `docs/`

### Documentação
- `AUDITORIA_CONSOLIDADA.md` — documento único de estado de segurança/conformidade, substituindo 19 relatórios anteriores que se contradiziam entre si (arquivados em `docs/archive/relatorios-antigos/`)
- `docs/compliance/` — templates ISO 27001/GDPR (política de segurança, rotação de chaves, DPA, registo de tratamento de dados, formação)
- `docs/RATE_LIMITS.md` — limites de rate limiting documentados por endpoint
- Tabela de evidência de testes de restauro real acrescentada a `docs/disaster-recovery-and-backup-tikvah.md`
- `SECURITY.md` actualizado (tabela de versões e contacto alinhados com a realidade do projecto)

---

## Como usar este ficheiro daqui para a frente

Ao fazer uma alteração com impacto em segurança, dados de utilizadores, ou conformidade,
adiciona uma linha em `[Não lançado]` sob a categoria apropriada (`Adicionado`,
`Alterado`, `Corrigido`, `Removido`, `Segurança`). Quando fizeres um deploy marcante,
move o conteúdo de `[Não lançado]` para uma secção `## [data] - AAAA-MM-DD`.
