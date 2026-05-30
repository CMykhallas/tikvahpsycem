# Política de Cookies e Estrutura de Consentimento — Ecossistema Tikvah

**Código do Documento:** TIKVAH-CPF-ISO29100  
**Versão:** 1.0.0  
**Data de Emissão:** 30 de Maio de 2026  
**Classificação:** Público / Executivo  
**Conformidade Normativa:** Alinhado com a ISO/IEC 29100 (Estrutura de Privacidade) e Legislação de Proteção de Dados Comerciais

---

## 1. Introdução e Transparência Tecnológica
A Tikvah utiliza cookies e tecnologias de armazenamento local para otimizar a experiência do utilizador, garantir a segurança transacional nos fluxos de agendamento e recolher métricas agregadas de desempenho técnico. 

Em total alinhamento com a ISO/IEC 29100, a plataforma adota uma abordagem transparente: nenhum cookie não essencial ou de rastreio publicitário de terceiros será injetado no navegador do utilizador sem que haja um consentimento prévio, livre, informado e inequívoco.

---

## 2. Categorias de Cookies Utilizados no Ecossistema

Os cookies gerados pela infraestrutura técnica da Tikvah dividem-se em três categorias operacionais estritas:

### 2.1. Cookies Essenciais e Técnicos (Injeção Obrigatória)
Estes identificadores são estritamente necessários para o funcionamento básico do site e não podem ser desativados nos nossos sistemas.
*   **Sessão Supabase (`sb-access-token` / `sb-refresh-token`):** Mantém a autenticação segura do utilizador e as permissões de acesso baseadas em RLS (Row Level Security).
*   **Segurança Criptográfica (`__stripe_mid` / `__stripe_sid`):** Cookies nativos do gateway do Stripe instalados para analisar o comportamento do dispositivo, detetar anomalias e prevenir fraudes e clonagem de cartões no momento do checkout.

### 2.2. Cookies de Desempenho e Analíticos (Obrigam a Consentimento)
Recolhem informações estatísticas sobre a utilização do site para análise de conversão e melhoria do produto, operando de forma totalmente anonimizada.
*   **Sessões do Analytics (`src/utils/analytics.ts`):** Identificador gerado através de criptografia segura de UUIDv4 para agrupar eventos de cliques, visualização de páginas e submissão de formulários, sem recolher dados nominativos.
*   **Google Analytics / Gtag (`_ga` / `_gid`):** Rastreio estatístico agregado para medição do volume de tráfego corporativo.

---

## 3. Inventário Detalhado de Rastreabilidade


| Fornecedor | Nome do Cookie | Finalidade Estrita | Ciclo de Vida | Tipo |
| :--- | :--- | :--- | :--- | :--- |
| **Tikvah (Próprio)** | `session_*` | Rastreamento de fluxo de UX e Web Vitals (`analytics.ts`) | Sessão | Analítico |
| **Supabase** | `supabase.auth.token` | Persistência de estado de login seguro do utilizador | 7 dias | Essencial |
| **Stripe** | `__stripe_mid` / `__stripe_sid` | Prevenção de fraude bancária no checkout e tokenização | 1 ano / 30 min | Essencial |
| **Google** | `_ga` | Estatísticas de tráfego agregado corporativo | 2 anos | Analítico |

---

## 4. O Mecanismo de Consentimento (*Consent Framework*)

O banner de aceitação de cookies implementado na interface do utilizador deve cumprir os seguintes critérios de engenharia de software e design:
1.  **Bloqueio Preventivo:** Os scripts analíticos (`gtag`, rastreadores do `analytics.ts`) permanecem completamente dormentes e bloqueados até que o utilizador execute uma ação afirmativa no banner.
2.  **Opções Equivalentes:** O utilizador deve dispor de botões com o mesmo peso visual para "Aceitar Todos" ou "Rejeitar Não Essenciais", impedindo o uso de padrões de design manipulativos (*Dark Patterns*).
3.  **Revogabilidade Ativa:** O utilizador pode alterar ou retirar o seu consentimento a qualquer momento através de um link persistente localizado no rodapé do site ("Definições de Cookies").

---

## 5. Auditoria e Registo de Escolhas
Em conformidade com as diretrizes de governança da ISO/IEC 29100:
*   A escolha do utilizador é gravada localmente no navegador sob o identificador `tikvah-cookie-consent` com o valor `accepted` ou `rejected`.
*   O sistema monitoriza de forma agregada a taxa de rejeição de cookies analíticos através do `securityMonitor` para avaliar a eficácia do aviso e calibrar a performance de carregamento da aplicação na Vercel.
