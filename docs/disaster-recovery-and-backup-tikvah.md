# Plano de Recuperação de Desastres e Backups — Ecossistema Tikvah

**Código do Documento:** TIKVAH-DRP-ISO22301  
**Versão:** 1.0.0  
**Data de Emissão:** 30 de Maio de 2026  
**Classificação:** Interno / Executivo  
**Conformidade Normativa:** Alinhado com a ISO 22301 (Continuidade de Negócios) e ISO/IEC 27001 (Controlo de Backups A.12.3)

---

## 1. Introdução e Objetivos Estratégicos
Este documento define as diretrizes técnicas e operacionais para garantir a resiliência do ecossistema digital da Tikvah perante falhas críticas de infraestrutura, ataques cibernéticos ou indisponibilidade de fornecedores na nuvem (Vercel, Supabase, Stripe ou M-Pesa). 

O objetivo primordial é mitigar o impacto financeiro e reputacional, assegurando a proteção integral dos históricos clínicos e dos registos transacionais de faturação.

---

## 2. Métricas de Tolerância de Impacto (RPO e RTO)
Em conformidade com a gestão de incidentes de continuidade da ISO 22301, a Tikvah fixa os seguintes limites máximos toleráveis para os seus serviços digitais em produção:

*   **Objetivo de Ponto de Recuperação (RPO - Perda Máxima de Dados):** **24 horas**. Em caso de catástrofe ou corrupção total do banco de dados, o volume máximo de dados perdidos não pode exceder as últimas 24 horas de transações e agendamentos.
*   **Objetivo de Tempo de Recuperação (RTO - Tempo Máximo de Inatividade):** **4 horas**. O tempo total decorrido entre a declaração do desastre e o restauro completo das funções vitais do site na Vercel e Supabase não deve ultrapassar 4 horas úteis.

---

## 3. Estratégia e Políticas de Backup (Supabase & Configurações)

### 3.1. Automatização e Retenção
*   **Base de Dados PostgreSQL (Supabase):** Os backups lógicos e físicos do banco de dados (que incluem agendamentos, dados de faturação e registos sanitizados) são executados de forma totalmente automatizada a cada 24 horas (Daily Backups) pela infraestrutura interna da Supabase.
*   **Retenção:** Os backups diários são armazenados de forma redundante e segura num bucket isolado com uma política de retenção mínima de **30 dias**.

### 3.2. Cifragem e Redundância Geográfica
*   Todos os arquivos de backup em repouso são cifrados de forma obrigatória com o algoritmo **AES-256**.
*   Os backups são guardados em zonas de disponibilidade geograficamente distintas dos servidores de produção principais, garantindo que desastres naturais localizados não comprometam a integridade dos dados históricos da Tikvah.

---

## 4. Protocolo de Resposta a Incidentes e Contingência Operacional

Caso ocorra um desastre técnico (ex: ataque de ransomware, corrupção da base de dados ou indisponibilidade severa da Vercel/Supabase), a equipa técnica deve ativar o seguinte protocolo executivo:

### Passo 1: Isolamento e Declaração de Incidente
Assim que as ferramentas de monitorização e telemetria (`securityMonitor`) emitirem alertas de falha total de persistência de dados ou integridade comprometida, o Gestor de Infraestrutura deve declarar formalmente o estado de desastre técnico e isolar os endpoints afetados para impedir a propagação.

### Passo 2: Roteamento de Contingência para o Frontend (Vercel)
Se a falha for exclusiva da camada de apresentação da Vercel, o tráfego do domínio `tikvahpsycem.web.app` (ou domínio proprietário) deve ser temporariamente redirecionado para a infraestrutura alternativa estática configurada de segurança.

### Passo 3: Procedimento de Restauro da Base de Dados (Supabase CLI)
Para restaurar a integridade dos dados a partir do último ponto de backup válido em ambiente de desastre, utiliza-se a interface de linha de comandos oficial (Supabase CLI):

1.  Aceda ao terminal de administração seguro e autentique-se no projeto.
2.  Execute a validação e o pull das tabelas estruturais de produção atuais.
3.  Inicie o processo de restauro forçado da base de dados PostgreSQL através do comando de sincronização estável:
    ```bash
    supabase db restore --project-ref \${{ secrets.SUPABASE_PROJECT_ID }}
    ```
4.  Valide o sucesso da operação e a consistência das tabelas executando o linter de verificação integrado do workflow:
    ```bash
    supabase db lint
    ```

---

## 5. Reconciliação Transacional Pós-Restauro (Stripe & M-Pesa)
Dado que o RPO permite uma perda teórica de até 24 horas de dados locais na base de dados, após o restauro técnico é obrigatório executar o procedimento de reconciliação de transações:
1.  O Gestor Financeiro deve extrair o relatório de vendas das últimas 24 horas diretamente dos painéis corporativos do **Stripe** e do **M-Pesa**.
2.  O sistema de auditoria compara os IDs de pagamento do gateway com as entradas restauradas na tabela `orders` do Supabase.
3.  Qualquer webhook de checkout completado (`checkout.session.completed`) que tenha falhado ou que tenha sido perdido durante a janela do desastre deve ser reemitido de forma manual a partir do painel do Stripe para a rota `/functions/v1/stripe-webhook`, forçando a reativação e confirmação automática do agendamento do utente.

---

## 6. Testes de Validação e Simulações Periódicas
Para garantir a eficácia operacional em conformidade com a ISO 22301, este plano de recuperação de desastres é testado obrigatoriamente através de simulações controladas:
*   **Frequência:** Realização de testes de restauro lógicos em ambiente de testes (*Staging*) a cada **6 meses**.
*   **Auditoria:** Os resultados das simulações, tempos reais de RTO registados e quaisquer desvios nas tabelas são documentados e anexados ao relatório anual de qualidade técnica do ecossistema.
