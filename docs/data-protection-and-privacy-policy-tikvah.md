# Política de Proteção de Dados e Privacidade — Ecossistema Tikvah

**Código do Documento:** TIKVAH-DPPO-ISO27001  
**Versão:** 1.0.0  
**Data de Emissão:** 30 de Maio de 2026  
**Classificação:** Público / Executivo  
**Conformidade Normativa:** Alinhado com a ISO/IEC 27001 (Segurança da Informação) e Legislação Moçambicana de Proteção de Dados

---

## 1. Introdução e Compromisso Institucional
A Tikvah estabelece este documento como a diretriz formal para o tratamento, armazenamento, cifragem e eliminação de dados pessoais e de saúde recolhidos através das suas plataformas digitais. 

Considerando a natureza altamente sensível dos serviços prestados (Clínica, Terapia da Fala, Terapia Ocupacional e Consultoria Organizacional), o ecossistema Tikvah adota o princípio do privilégio mínimo e a separação estrita de funções (*Separation of Duties*), garantindo que dados clínicos e dados de faturação financeira nunca sejam correlacionados sem autorização expressa.

---

## 2. Categorias de Dados Recolhidos e Finalidade
Em estrita conformidade com a minimização de dados, a plataforma recolhe apenas as variáveis necessárias para a execução do Acordo de Nível de Serviço (SLA):

* **Dados de Identificação e Contacto:** Nome completo, endereço de correio eletrónico, número de telefone e número de identificação fiscal (NUIT). *Finalidade: Faturação, agendamento de sessões e envio de links de conectividade.*
* **Dados de Saúde e Prontuário Clínico:** Histórico clínico preliminar, notas de sessões terapêuticas, formulações de caso e avaliações fonéticas ou funcionais. *Finalidade: Execução do ato terapêutico e acompanhamento clínico continuado.*
* **Dados de Telemetria e Segurança:** Endereços IP mapeados de forma segura, assinaturas de browser (User Agent) e logs de tentativas de autenticação (`src/utils/securityEnhancements.ts`). *Finalidade: Prevenção de fraudes, mitigação de ataques cibernéticos e auditoria de segurança exigida pelo CodeQL.*

---

## 3. Arquitetura de Segurança e Cifragem (Controlos ISO/IEC 27001)

### 3.1. Armazenamento Separado e Cifragem em Repouso (*At Rest*)
* Os dados pessoais de identificação e faturação são processados e armazenados em tabelas encriptadas geridas via infraestrutura Supabase.
* Os dados clínicos e históricos sensíveis dos pacientes são isolados de forma lógica e física através de políticas estritas de Segurança ao Nível da Linha (*Row Level Security — RLS*), impedindo qualquer acesso transversal não autorizado por utilizadores da base de dados.
* Todas as bases de dados em repouso utilizam o algoritmo de cifragem AES-256.

### 3.2. Trânsito de Dados (*In Transit*)
* Todo o tráfego de rede entre o utilizador, a plataforma Vercel e o banco de dados Supabase é encriptado via protocolo TLS 1.3 de ponta a ponta.
* Protocolos perigosos de injeção são neutralizados na camada de entrada antes do armazenamento via funções recursivas avançadas.

---

## 4. Retenção e Eliminação de Dados (*Data Retention*)
Os prazos de guarda de dados cumprem os requisitos legais aplicáveis aos setores de saúde e fiscalidade em Moçambique:

1. **Dados Clínicos (Prontuários e Notas de Sessão):** Retidos por um período mínimo de 5 anos a contar da data da última consulta, ou conforme estipulado pelas diretrizes dos órgãos reguladores de saúde.
2. **Dados de Faturação e Transações Financas:** Retidos por 10 anos para total conformidade com as obrigações fiscais locais.
3. **Logs de Segurança e Acesso:** Eliminados ou anonimizados automaticamente a cada 90 dias através de rotinas de limpeza do servidor.

A eliminação de dados de suporte digital é efetuada através de métodos de destruição lógica criptográfica irreversível.

---

## 5. Direitos dos Titulares dos Dados
O utilizador (ou organização parceira) possui direitos fundamentais sobre os seus dados, que podem ser exercidos mediante requisição formal através do canal `suporte.oficina.psicologo@proton.me`:

* **Direito de Acesso e Retificação:** Consultar e atualizar as suas informações cadastrais a qualquer momento.
* **Direito à Portabilidade:** Solicitar a exportação dos seus dados cadastrais em formato estruturado (JSON ou CSV).
* **Direito de Eliminação (Esquecimento):** Solicitar a exclusão dos dados de contacto, desde que não colida com as obrigações legais de retenção dispostas na Cláusula 4.

---

## 6. Notificação de Incidentes de Segurança
Em caso de deteção de qualquer anomalia, quebra de segurança ou tentativa de intrusão detetada pelos sistemas de telemetria corporativa (`securityMonitor`):
* A Tikvah executará o Plano de Resposta a Incidentes em até 2 horas.
* Caso seja constatada a fuga ou exposição de dados pessoais de identificação, os titulares afetados e as autoridades competentes serão formalmente notificados num prazo máximo de 72 horas, contendo o impacto estimado e as medidas de mitigação adotadas.
