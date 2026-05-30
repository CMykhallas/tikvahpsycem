# Acordo de Nível de Serviço (SLA) — Ecossistema Tikvah

**Código do Documento:** TIKVAH-SLA-ISO20000  
**Versão:** 1.0.0  
**Data de Emissão:** 30 de Maio de 2026  
**Classificação:** Público / Executivo  
**Conformidade Normativa:** Alinhado com a ISO/IEC 20000-1 (Gestão de Serviços)

---

## 1. Objetivo e Âmbito de Aplicação
Este Acordo de Nível de Serviço (SLA) define formalmente os parâmetros de qualidade, prazos de resposta operacionais e responsabilidades mútuas aplicáveis à venda, agendamento e execução dos serviços integrados clínicos e corporativos da Tikvah. 

Este documento aplica-se universalmente a todas as transações efetuadas na plataforma digital, abrangendo as modalidades:
* **Online** (Teleconsulta / Teleconferência)
* **Presencial** (Instalações Centrais da Tikvah)
* **Híbrido** (Intervenções Mistas)

---

## 2. Prazos de Resposta Operacionais (Disponibilidade e Agendamento)
Em conformidade com a gestão de capacidade e incidentes da ISO/IEC 20000, a Tikvah estabelece tempos máximos de processamento baseados na severidade e natureza da requisição:


| Natureza do Serviço / Pedido | Canal de Entrada | Tempo Máximo de Resposta / Confirmação |
| :--- | :--- | :--- |
| **Confirmação de Faturação e Checkout** | API (Stripe / M-Pesa) | Imediato (Automático por Webhook) |
| **Emissão de Link de Acesso (Online)** | Email / SMS | Até 1 hora após confirmação de pagamento |
| **Triagem e Validação de Agendamento** | Painel Supabase / Gestor | Até 4 horas úteis |
| **Apoio Psicológico em Crises / Emergência**| Linha de Resposta Rápida| Até 30 minutos (Atendimento Contínuo) |
| **Suporte Técnico Pós-Venda (Falha de Link)**| Portal de Suporte | Até 2 horas úteis |

*Nota: Considera-se período útil o horário fixado de Segunda a Sexta-feira, das 08:00 às 17:00 (Hora de Moçambique).*

---

## 3. Política Estrita de Cancelamentos e Reagendamentos

### 3.1. Iniciativa do Cliente (Utente ou Organização)
* **Antecedência Superior a 24 Horas:** O cliente pode solicitar o reagendamento ou cancelamento da sessão sem qualquer penalização financeira. O crédito integral será mantido na conta do utilizador para utilização futura dentro de um prazo máximo de 90 dias.
* **Antecedência Inferior a 24 Horas:** Pedidos submetidos fora do prazo de aviso prévio de 24 horas implicam a retenção de **50% do valor base do serviço** a título de taxa de vacatura operacional e alocação exclusiva do profissional.

### 3.2. Iniciativa da Tikvah
Caso a Tikvah necessite de alterar um horário por motivos de força maior ou falha técnica sistémica:
1. O cliente será notificado com uma antecedência mínima de 4 horas.
2. Será garantido o reagendamento prioritário nas 48 horas seguintes.
3. Caso o cliente recuse o novo horário, será processado o reembolso integral (100%) num prazo máximo de 5 dias úteis.

---

## 4. Política Executiva de Faltas (*No-Show*)

### 4.1. Tolerância de Atraso
* **Modalidade Presencial:** O profissional aguardará o cliente nas instalações por um período máximo e improrrogável de **15 minutos**.
* **Modalidade Online:** O link da sala virtual permanecerá ativo por **15 minutos** a contar da hora estipulada.

### 4.2. Penalização por Incumprimento
Decorrido o período de tolerância sem a comparência do cliente ou sem aviso prévio válido nos termos da Cláusula 3.1, a sessão será encerrada e classificada administrativamente como *No-Show*. 
* **Consequência:** Haverá a perda integral do montante pago (0% de reembolso), uma vez que a hora técnica foi integralmente disponibilizada e reservada.

---

## 5. Diretrizes de Reembolso (*Refund Guidelines*)
Os reembolsos são geridos exclusivamente por via administrativa para mitigar riscos de litígio bancário (*chargebacks*) nas plataformas integradas de pagamento:
* **Efetivação de Direitos:** Os reembolsos autorizados nos termos deste SLA serão processados utilizando o mesmo método de pagamento original (Stripe / Cartão de Crédito ou M-Pesa).
* **Prazos:** A instrução financeira de devolução é emitida pela Tikvah em até **5 dias úteis**. O reflexo do saldo na conta do cliente depende exclusivamente dos prazos de processamento da entidade bancária emissora do cartão ou do operador de telefonia móvel local.

---

## 6. Suporte Técnico Pós-Venda e Gestão de Incidentes
Os incidentes técnicos relacionados com o processamento de pagamentos, acessibilidade ao site ou falhas na receção de credenciais de teleconsulta são geridos sob um fluxo rigoroso de escalonamento:

1. **Abertura do Incidente:** Efetuada via submissão no endpoint dedicado de suporte ou através do email institucional `suporte.oficina.psicologo@proton.me`.
2. **Mitigação de Impacto:** Caso ocorra uma falha de conectividade na plataforma proprietária da Tikvah durante uma consulta Online, o profissional migrará o atendimento de imediato para um canal de contingência encriptado alternativo ou acionará o suporte técnico para resolução em tempo real.
3. **Resolução Definitiva:** Se a sessão online for inviabilizada por falha técnica imputável aos servidores da Tikvah, a sessão será integralmente reagendada sem custos adicionais para o utilizador.

---

## 7. Monitoria, Auditoria e Melhoria Contínua
Em estrita conformidade com os requisitos de melhoria contínua da ISO/IEC 20000:
* Todos os tempos de resposta de checkout, taxas de *No-Show* e incidentes técnicos de suporte são registados e auditados automaticamente através do painel de monitorização e telemetria (`src/utils/analytics.ts`).
* Relatórios de desempenho de nível de serviço são extraídos mensalmente pela administração para calibração de performance de infraestrutura e otimização da experiência do utilizador final.
