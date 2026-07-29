# Auditoria de Segurança e Conformidade — Documento Consolidado
## Tikvah Psychological Center

**Última actualização:** 28 de Julho de 2026
**Substitui:** os 19 documentos de auditoria/status anteriores (ver secção 6 — arquivados, não apagados)
**Metodologia:** inspecção directa do código-fonte e das migrações Supabase, item a item — não é um "score" gerado automaticamente

---

## 0. Porque é que este documento existe

O repositório acumulou **19 ficheiros de relatório/status** (`ADVANCED_SECURITY_AUDIT_REPORT.md`,
`COMPLIANCE_DASHBOARD.md`, `FINAL_STATUS_SUMMARY.md`, etc.) gerados em momentos diferentes,
que se contradiziam entre si — por exemplo:

| Discrepância encontrada | Onde |
|---|---|
| "1 vulnerabilidade crítica" (relatório principal) vs "4 vulnerabilidades críticas" (resumo executivo) vs "2 críticos" adicionais numa secção separada de auditoria de BD | `ADVANCED_SECURITY_AUDIT_REPORT.md` vs `EXECUTIVE_SUMMARY_1PAGE.md` |
| ISO 27001 "71%" em três documentos vs "95%" noutro, sem explicação clara da transição | `ADVANCED_SECURITY_AUDIT_REPORT.md`/`COMPLIANCE_DASHBOARD.md`/`EXECUTIVE_SUMMARY_1PAGE.md` vs `FINAL_STATUS_SUMMARY.md` |
| "3 de 4 críticas corrigidas" num documento e "4 de 4 corrigidas" noutro, sem indicação de qual é mais recente | `PHASE1_COMPLETION_SUMMARY.md` vs `PHASE1B_COMPLETION.md` |

É daqui que veio o número "4 Críticas" que apareceu num pedido anterior — não bate certo com
o resto da própria documentação do projecto, e ainda menos com o código actual.

Este documento substitui essas fontes por **um único estado, verificado directamente no
código nesta sessão**, com data e evidência por item.

---

## 1. Resumo do estado actual (verificado no código, não estimado)

| Categoria | Total original | ✅ Resolvido/confirmado | ⚪ Falso positivo | ⚠️ Pendente (real) |
|---|---|---|---|---|
| Crítico | 1 | 1 | 0 | 0 |
| Alto | 7 | 6 | 0 | 1 (documentação) |
| Médio | 12 | 6 | 3 | 3 |
| Baixo | 8 | 4 | 0 | 4 |
| *Auditoria de BD (à parte dos 28)* | 6 | 4 | 0 | 2 |
| **Total (28 originais)** | **28** | **17** | **3** | **8** |

Mais um gap real descoberto e corrigido nesta sessão que **não estava em nenhum dos
relatórios originais** (`create-checkout` sem rate limiting efectivo — ver §10.1).

"Pendente" divide-se em dois tipos bem diferentes, listados na secção 4: itens de código
ainda por fazer (poucos, de baixa prioridade) e itens organizacionais que nenhum código resolve.

---

## 2. CRÍTICO ⛔ (1/1 resolvido)

| # | Descoberta | Estado | Evidência |
|---|---|---|---|
| 1 | `@types/node` em falta | ✅ Resolvido | Presente em `package.json` (devDependencies) e `tsconfig.node.json` |

---

## 3. ALTO 🟠 (6/7 resolvido)

| # | Descoberta | Estado | Evidência |
|---|---|---|---|
| A | CSP com `unsafe-eval`/`unsafe-inline` em script-src | ✅ Resolvido | `vercel.json` e `SecurityProvider.tsx` sem `unsafe-eval`; `unsafe-inline` só em `style-src` (necessário para fontes). Nesta sessão removi ainda `unpkg.com`/`jsdelivr.net`, que não eram usados por nada no código |
| B | Validação de entrada insuficiente no checkout | ✅ Resolvido nesta sessão | `CheckoutForm.tsx` tinha só verificação de campo não-vazio; adicionei schema `zod` (nome/email/telefone) com mensagens de erro por campo |
| C | "Protecção DevTools desabilitada em dev" | ⚪ Não é um gap real | A protecção só actuar em produção é o comportamento correcto — bloqueá-la em desenvolvimento impediria a própria equipa de trabalhar. Mantido como está |
| D | Rate limiting só no cliente | ✅ Resolvido | `AdvancedRateLimiter` (server-side, Supabase Edge Functions) confirmado em `create-checkout`, `create-order`, `process-mpesa-payment`, e agora também `totp-verify` (adicionado nesta sessão) |
| E | Autenticação admin sem 2FA/MFA/WebAuthn | ✅ Resolvido | TOTP e WebAuthn/FIDO2 implementados (`TwoFactorSetup.tsx`, `supabase/functions/totp-verify`, `totp-setup`) |
| F | Falta HSTS preload | ✅ Resolvido | `Strict-Transport-Security` com `preload` confirmado em `vercel.json` |
| G | Sem validação de origem (CSRF) | ✅ Resolvido | `isAllowedOrigin()` usado em `create-order`/`create-checkout` para validar o header `Origin` |

---

## 4. MÉDIO 🟡 (5/12 resolvido, 3 falsos positivos, 4 pendentes)

| # | Descoberta | Estado | Nota |
|---|---|---|---|
| A | Logging de segurança sem persistência | ✅ Resolvido | `SecurityLogger` grava em `audit_log`/`security_incidents` (Supabase) |
| B | Rate limiting sem documentação | ⚠️ Pendente | Falta um documento simples a listar os limites por endpoint. Baixo esforço — posso fazer a seguir se quiseres |
| C | SRI criado mas não activado | 🗑️ Removido (não activado) | `cspAndSri.ts` nunca foi importado por ninguém — era código morto. Em vez de o activar, removi as origens CDN não usadas do CSP (mitigação equivalente, sem manter infraestrutura morta) |
| D | "Project ID exposto no CSP" | ⚪ Falso positivo | O `project_id`/chave `anon` do Supabase são **públicos por desenho** — vão sempre para o bundle do browser. A segurança vem do RLS, não de esconder isto |
| E | Sem protecção contra timing/brute-force attacks | ✅ Parcialmente resolvido nesta sessão | `totp-verify` (código de 6 dígitos, 1M combinações) não tinha nenhum travão — adicionei rate limiting (5 tentativas/5min, bloqueio 30min). Login primário (email/password) beneficia das protecções nativas do Supabase Auth |
| F | Rotação de chaves não documentada | ⚠️ Pendente (template pronto) | `docs/compliance/POLITICA_ROTACAO_CHAVES.md` criado — falta preencher o inventário real e fazer a primeira rotação registada |
| G | Sem backup/DR documentado | ⚠️ Pendente (plano já existia) | `docs/disaster-recovery-and-backup-tikvah.md` já define RTO/RPO e procedimento — falta **executar** e registar o primeiro teste real de restauro (§6.1) |
| H | Dados sensíveis em URLs no checkout | ✅ Verificado, sem risco | Checkout usa `supabase.functions.invoke` (POST), não há dados de encomenda em query strings |
| I | "Sem path traversal validation" | ⚪ Falso positivo | SPA com React Router (todas as rotas resolvem para `index.html` via rewrite do Vercel); não há resolução de caminhos de ficheiro a partir de input do utilizador |
| J | Mensagens de erro genéricas em falta | ✅ Resolvido | `create-order` devolve `{"error": "Erro ao criar pedido"}` ao cliente; stack trace só vai para o log interno (`logger.logIncident`) |
| K | "Sem protecção SSRF" | ⚪ Falso positivo | Todos os `fetch()` nas edge functions usam URLs fixas (Resend, gateway M-Pesa) ou vindas de variáveis de ambiente — nenhum é controlado por input do utilizador |
| L | `.env` sem enforcement em pre-commit | ✅ Já estava resolvido (correcção à minha avaliação anterior) | `.env` no `.gitignore` **e** `.github/workflows/security-audit.yml` já corre `gitleaks` (secret scanning) em CI a cada push/PR — só não tinha visto este workflow na sessão anterior. Não é pre-commit local, mas é equivalente em CI, o que é suficiente |

---

## 5. BAIXO 🟢 (3/8 resolvido, 5 pendentes — todos de baixa prioridade)

| # | Descoberta | Estado |
|---|---|---|
| A | Falta SRI em CDNs | 🗑️ Mitigado (origens CDN não usadas removidas do CSP, ver item Médio C) |
| B | Console logging em produção | ✅ Resolvido nesta sessão — `src/lib/logger.ts` criado; 70 chamadas em 26 ficheiros migradas de `console.*` para `logger.*`, silenciadas em produção |
| C | Sem monitorização de disponibilidade | ✅ Resolvido nesta sessão | Endpoint público `supabase/functions/health-check/` criado — falta só apontar uma ferramenta externa (UptimeRobot, etc.) para lá, ver comentário no próprio ficheiro |
| D | `SECURITY.md` desactualizado | ✅ Resolvido nesta sessão | Tabela de versões (era um template de biblioteca semver, não se aplicava a uma SPA) e contacto corrigidos; secção de práticas actualizada para reflectir o pipeline CI real |
| E | Sem pentest agendado | ⚠️ Pendente — organizacional, requer contratar um fornecedor externo |
| F | Alguns tipos `any` | ⚠️ Pendente — baixa prioridade, requer revisão ficheiro a ficheiro para não introduzir regressões |
| G | Ficheiros de segurança duplicados | ✅ Resolvido nesta sessão — removidos `src/components/ui/ContactForm.tsx` (órfão e partido), `src/utils/cspAndSri.ts` e `src/utils/headerObfuscation.ts` (código morto, nunca importados) |
| H | Sem versionamento de API | ⚠️ Pendente — decisão arquitectural, baixa prioridade para o tamanho actual do projecto |

---

## 6. Auditoria de Base de Dados (secção à parte no relatório original, não contabilizada nos 28)

| # | Descoberta | Estado |
|---|---|---|
| 1 | Sem audit trail explícito | ✅ Resolvido — `audit_log` confirmado nas migrações |
| 2 | Sem masking de dados sensíveis | ✅ Resolvido nesta sessão | Funções `mask_email`/`mask_phone`/`mask_name` + view `orders_masked` — ver migração `20260729090000_data_masking_and_slow_query_monitoring.sql` |
| 3 | Backup não testado | ⚠️ Pendente — plano em `docs/disaster-recovery-and-backup-tikvah.md` §6.1, falta executar e registar o primeiro teste real |
| 4 | Sem data classification | ✅ Template criado — `docs/compliance/MAPEAMENTO_DADOS_PII.md`, falta validar linha-a-linha contra o schema |
| 5 | Sem monitoring de queries lentas | ✅ Resolvido nesta sessão | `pg_stat_statements` + view `slow_queries_report` (mesma migração acima; defensivo caso a extensão não esteja disponível no ambiente) |
| 6 | Sem detecção de anomalias | ✅ Parcial — `AdvancedRateLimiter.detectSuspiciousPattern()` já activo em `create-checkout` |

---

## 7. Conformidade por norma — estado honesto

| Norma | O que é tecnicamente verificável no código | Estado |
|---|---|---|
| **OWASP Top 10** | Controlo de acesso, injecção, autenticação, headers | Os itens tecnicamente endereçáveis estão cobertos (ver secções 2–5). Não existe "100% OWASP" como certificação — é uma checklist de boas práticas, continuamente reavaliada |
| **ISO 27001** | Controlos técnicos (A.9, A.10, A.12, A.14) | Cobertos ao nível de código. Os controlos organizacionais (A.5, A.6, A.17, A.18) têm agora templates em `docs/compliance/` mas **exigem acção humana** (aprovação, assinatura, teste real) para contarem como implementados. Certificação real exige auditor externo credenciado — nenhum repositório de código pode declarar-se "ISO 27001 certificado" |
| **GDPR** | Minimização de dados, validação, logs de acesso, notificação de incidentes | Base técnica sólida (RLS, logs, `INCIDENT_RESPONSE_PLAN.md`). Templates para Art. 28 (DPA) e Art. 30 (registo de tratamento) criados em `docs/compliance/`, mas precisam de revisão jurídica e preenchimento real — especialmente por envolver dados de saúde mental (categoria especial) |
| **NIST CSF** | Identify/Protect/Detect/Respond/Recover | Identify/Protect/Detect bem cobertos no código; Respond coberto por `INCIDENT_RESPONSE_PLAN.md`; Recover depende do teste de restauro (ainda por fazer) |
| **"LOVABLE Best Practices"** | Não é uma norma externa publicada — parece ser uma convenção interna de qualidade de código (TypeScript strict, testes, acessibilidade). Tratar como checklist de qualidade, não como framework de conformidade externo | — |

**Não há uma percentagem única e fiável a dar aqui.** Os números "71%"/"75%"/"95%" nos
relatórios antigos vinham de um scoring automático sem metodologia documentada — por
isso é preferível a tabela item-a-item acima a inventar um novo número.

---

## 8. O que ficou fora desta sessão (por decisão explícita, não esquecimento)

- Revisão completa do `SECURITY.md`
- Masking de dados sensíveis na base de dados
- Activação de `pg_stat_statements`
- Documentação dos limites de rate limiting por endpoint
- Ferramenta de monitorização de disponibilidade
- Contratação de pentest externo

Nenhum destes é tecnicamente complexo — foram deixados de fora porque, ao contrário dos
itens já resolvidos, exigem uma decisão (que ferramenta usar, que fornecedor contratar) que
não me cabe tomar sozinho. Diz-me quais destes queres avançar a seguir.

---

## 9. Ficheiros antigos

Os 19 relatórios/status anteriores foram movidos para `docs/archive/relatorios-antigos/`
(não apagados — mantidos como histórico), com um `README.md` a explicar porque foram
substituídos por este documento. `INCIDENT_RESPONSE_PLAN.md`, `SECURITY.md`,
`2FA_IMPLEMENTATION_GUIDE.md`, `TESTING_GUIDE.md`, `QUICK_START_GUIDE.md` e
`DEPLOYMENT_QUICK_REFERENCE.md` mantiveram-se na raiz por serem guias funcionais
distintos, não relatórios de auditoria.

### 9.1 Descoberta adicional: a pasta `docs/` era uma cópia duplicada

Ao arquivar os ficheiros da raiz, encontrei uma pasta `docs/` com **9 dos mesmos
ficheiros, byte a byte idênticos** aos da raiz (`SECURITY.md`, `TESTING_GUIDE.md`,
`README.md`, `ELITE_SECURITY_README.md`, `ELITE_SECURITY_ROADMAP.md`,
`TESTES_FINAIS_RELATORIO.md`, `TEST_SUMMARY.md`, `SECURITY_IMPLEMENTATION.md`,
`EDGE_FUNCTIONS_TEST_REPORT.md`) — removidos por serem duplicados exactos.

A mesma pasta continha também **9 documentos únicos e genuinamente úteis** que não
tinham equivalente na raiz nem tinham sido referenciados nas conversas anteriores:
`disaster-recovery-and-backup-tikvah.md`, `data-protection-and-privacy-policy-tikvah.md`,
`accessibility-compliance-report-tikvah.md`, `architecture-and-data-flow-tikvah.md`,
`cookie-policy-and-consent-framework.md`, `design-system-and-ui-guidelines.md`,
`pricing-guidelines-tikvah.md`, `refund-and-cancellation-policy-tikvah.md`,
`service-level-agreement-tikvah.md`, `terms-of-service-tikvah.md`. Estes ficaram no lugar.

Dois deles sobrepunham-se aos templates que eu próprio tinha acabado de criar em
`docs/compliance/` — mas eram mais específicos e completos do que o meu template
genérico. Para não repetir o mesmo erro de duplicação que este exercício tentou corrigir,
mantive os documentos pré-existentes como fonte principal (`disaster-recovery-and-backup-tikvah.md`
e `data-protection-and-privacy-policy-tikvah.md`), removi o meu `PLANO_CONTINUIDADE_NEGOCIO.md`
por ser redundante, e apenas acrescentei ao documento existente uma tabela de evidência de
testes de restauro reais — porque o plano descrevia o procedimento mas não tinha nenhum
teste efectivamente registado. Ver `docs/compliance/README.md` para o detalhe desta
reconciliação, incluindo uma nota sobre afirmações nesses documentos (ex. purga automática
de logs a cada 90 dias) que não encontrei confirmadas directamente no código.

---

## 10. Sessão de robustecimento (28-29 Jul 2026) — funcionalidades e correcções novas

### 10.1 Gap de segurança novo, descoberto e corrigido

Ao documentar os limites de rate limiting (item Médio B), descobri que **`create-checkout`
chamava o rate limiter mas não tinha nenhuma configuração associada** em
`AdvancedRateLimiter.configs` — o código tem um fallback silencioso (`if (!config) return
{ allowed: true }`) que fazia este endpoint aprovar sempre o pedido, sem limite nenhum,
apesar de aparentar estar protegido. Corrigido: adicionada configuração (8 pedidos/15min,
3/30min sem sessão). Isto é relevante porque cada chamada cria uma sessão real na API do
Stripe — sem limite, era um vector de abuso de custo/recursos.

### 10.2 Correcção a uma avaliação anterior

Tinha classificado "secret scanning em pre-commit" (item Médio L) como pendente. Ao
inspeccionar `.github/workflows/security-audit.yml` nesta sessão, confirmei que o projecto
**já corre `gitleaks` (secret scanning) e `semgrep` (SAST, OWASP Top 10 + TypeScript/React,
com upload para GitHub Code Scanning) em CI**, a par de `dependabot.yml` com verificação
diária — um pipeline mais maduro do que eu tinha assumido. Item marcado como resolvido.

### 10.3 Novas funcionalidades adicionadas

| Adição | Ficheiro(s) | Resolve |
|---|---|---|
| Endpoint de health check público | `supabase/functions/health-check/` | Baixo C — sem monitorização de disponibilidade |
| Funções de masking de dados (email/telefone/nome) + view `orders_masked` | `supabase/migrations/20260729090000_data_masking_and_slow_query_monitoring.sql` | Auditoria de BD #2 — sem masking de dados sensíveis |
| Activação de `pg_stat_statements` + view `slow_queries_report` | mesma migração acima | Auditoria de BD #5 — sem monitoring de queries lentas |
| Documentação de rate limits por endpoint | `docs/RATE_LIMITS.md` | Médio B |
| `CHANGELOG.md` (formato Keep a Changelog) | raiz | Gestão de mudanças, ISO 27001 A.8.32 |
| `CODEOWNERS` | `.github/CODEOWNERS` | Revisão obrigatória em áreas sensíveis (precisa de handles reais preenchidos) |
| Template de PR com checklist de segurança | `.github/PULL_REQUEST_TEMPLATE.md` | Consistência de revisão |
| Templates de issue (bug + redirecionamento de segurança) | `.github/ISSUE_TEMPLATE/` | Evita vulnerabilidades reportadas publicamente por engano |
| `SECURITY.md` corrigido | raiz | Baixo D — estava desactualizado (tabela de versões fictícia tipo biblioteca semver, contacto incorrecto) |

### 10.4 O que ainda fica pendente (organizacional, não código)

Masking de dados (Auditoria de BD #2) tem agora a ferramenta pronta (`orders_masked`),
mas os dashboards/relatórios internos precisam de ser actualizados para a usarem em vez
da tabela `orders` directa — isso é uma migração de processo, não só de schema. `CODEOWNERS`
precisa dos handles reais da equipa preenchidos para ter efeito. `slow_queries_report`
depende de `pg_stat_statements` estar de facto activa no ambiente Supabase real (a
migração é defensiva e não falha se não estiver, mas nesse caso requer activação manual
no painel).
