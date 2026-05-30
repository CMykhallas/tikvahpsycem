# Diretrizes de Precificação Estratégica — Ecossistema Tikvah

**Código do Documento:** TIKVAH-PRICING-GUIDELINES  
**Versão:** 1.0.0  
**Data de Emissão:** 30 de Maio de 2026  
**Classificação:** Interno / Executivo  
**Conformidade Normativa:** Alinhado com a ISO 9001 (Gestão de Processos Financeiros)

---

## 1. Política de Preços e Valores de Referência
Os honorários da Tikvah são calculados com base na complexidade técnica da intervenção, especialização dos profissionais alocados e infraestrutura de suporte necessária para a operação. 

Os valores base de referência em vigor para o ano fiscal de 2026 estão estritamente tabelados na moeda local, Metical (MZN), conforme a matriz do sistema (`src/data/services-ecosystem.ts`):

*   **Psicologia Clínica, Social e Organizacional:** 3.500,00 MZN / Sessão
*   **Terapia da Fala:** 3.000,00 MZN / Sessão
*   **Terapia da Fala em Língua Gestual:** 4.000,00 MZN / Sessão
*   **Gestão Empresarial e Alinhamento Estratégico:** 15.000,00 MZN / Bloco de Consultoria
*   **Gestão de Clima Organizacional e Burnout:** 12.000,00 MZN / Diagnóstico por Unidade
*   **Sustentabilidade Organizacional e Captação ESG:** 18.000,00 MZN / Desenho de Projeto

---

## 2. Ajustes e Fatores de Ponderação por Modalidade
O preço base do serviço sofre variações paramétricas automatizadas pelo calculador dinâmico (`pricing-calculator-tikvah.ts`) de acordo com a logística de atendimento selecionada pelo cliente:

1.  **Modalidade Online:** Preço base nominal (0% de acréscimo). Isento de taxas de deslocação ou custos de infraestrutura física.
2.  **Modalidade Presencial:** Acréscimo fixo de **15% sobre o preço base** para cobertura de consumíveis clínicos, biossegurança e manutenção de instalações físicas.
3.  **Modalidade Híbrida:** Integração customizada sob orçamento prévio, aplicando uma taxa ponderada fixa de **20%** calculada com base no rácio de sessões em gabinete e teleconsultas.

---

## 3. Descontos Corporativos e Contratos de Volume
Para organizações sem fins lucrativos, ONGs e empresas com pacotes de retenção contínua de Recursos Humanos:
*   **Pacotes de 5 a 10 Utilizadores:** Redução linear de **10%** no faturamento global.
*   **Contratos Anuais de Consultoria:** Isenção da taxa de ativação de infraestrutura e faturação faseada em tranches mensais fixas com base em metas tangíveis (Milestones).
