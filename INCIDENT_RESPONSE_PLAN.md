# 🚨 PLANO DE RESPOSTA A INCIDENTES DE SEGURANÇA
## Tikvah Psychological Center - Incident Response Plan

**Versão:** 1.0  
**Data:** 28 Julho 2026  
**Próxima Revisão:** 28 Janeiro 2027  
**Dono:** Chief Security Officer / Tech Lead  

---

## 1. OBJETIVO & ESCOPO

### Objetivo
Estabelecer procedimentos padronizados para detecção, análise, contenção, remediação e recuperação de incidentes de segurança relacionados ao sistema Tikvah.

### Escopo
- Aplicação web (https://tikvahpsycem.vercel.app)
- Banco de dados Supabase PostgreSQL  
- Infraestrutura Vercel
- Integração de pagamento M-Pesa
- Dados de clientes e pacientes

### Não Incluído
- Incidentes de recursos humanos
- Incidentes de segurança física
- Incidentes de outros departamentos

---

## 2. ESTRUTURA DE COMANDO (ICS)

### Chain of Command
```
INCIDENTE DETECCION
    ↓
Tier 1: Security Monitor (automated)
    ↓
Tier 2: On-Call Security Engineer
    ↓
Tier 3: Tech Lead / CTO
    ↓
Tier 4: CEO / General Counsel
    ↓
Tier 5: Regulatory Authorities (if required)
```

### Contatos Chave

| Cargo | Nome | Email | Telefone | Backup |
|-------|------|-------|----------|--------|
| **Tech Lead** | [Nome] | xxx | +258 XX XXX XXXX | Tech2 |
| **Security Lead** | [Nome] | xxx | +258 XX XXX XXXX | Tech Lead |
| **CTO** | [Nome] | xxx | +258 XX XXX XXXX | CEO |
| **CEO** | [Nome] | xxx | +258 XX XXX XXXX | CFO |
| **Legal** | [Nome] | xxx | +258 XX XXX XXXX | General Counsel |

---

## 3. SEVERIDADE & ESCALAÇÃO

### Matriz de Classificação

| Severidade | Critério | RTO | RPO | Escalação |
|-----------|----------|-----|-----|-----------|
| **🔴 CRÍTICO** | Dados expostos / Service down / Active exploitation | <1h | <1h | Tier 4 |
| **🟠 ALTO** | Vulnerabilidade ativa / Acesso não-autorizado | <4h | <4h | Tier 3 |
| **🟡 MÉDIO** | Potencial vulnerabilidade / Anomalia suspeita | <24h | <24h | Tier 2 |
| **🟢 BAIXO** | Tentativa fallida / Policy violation | <72h | Não-crítico | Tier 1 |

### Exemplos de Cenários

**CRÍTICO:**
- ✓ Data breach confirmado (paciente PII exposto)
- ✓ Ransomware detectado
- ✓ Site defeação (content modification)
- ✓ DDoS com serviço indisponível >30min

**ALTO:**
- ✓ SQL injection tentativa bem-sucedida
- ✓ Acesso administrativo não autorizado
- ✓ Falha de autenticação em massa
- ✓ Falsa alarme de penetration test

**MÉDIO:**
- ✓ Malware não ativo detectado
- ✓ Comportamento de usuário anômalo
- ✓ Dependency vulnerabilidade conhecida
- ✓ Rate limit violations (sem dados expostos)

**BAIXO:**
- ✓ Failed login attempt (1-2 vezes)
- ✓ Policy violation menor
- ✓ Configuration não-ideal

---

## 4. PROCEDIMENTOS DE RESPOSTA

### FASE 1: DETECÇÃO (0-15 min)

#### Quem Detecta?
- Automated monitoring (Sentry, Vercel alerts)
- Customer reports
- Security scans (Dependabot, OWASP ZAP)
- Manual observation

#### O Que Fazer?
```
1. ✓ Receber alerta de segurança
2. ✓ Validar se é verdadeiro positivo (não false alarm)
3. ✓ Classificar severidade (CRÍTICO/ALTO/MÉDIO/BAIXO)
4. ✓ Abrir ticket de incidente: INC-[DATE]-[NUMBER]
5. ✓ Notificar Tier 2 on-call engineer
6. ✓ Registrar timestamp de detecção
```

#### Template de Alerta
```
INCIDENT DETECTED
├─ Time: 2026-07-28T14:32:15Z
├─ Source: [Sentry/Vercel/Manual/Customer]
├─ Type: [SQL Injection/XSS/Auth Failure/etc]
├─ Description: [Breve descrição]
├─ Evidence: [Screenshot/Log excerpt]
├─ Ticket ID: INC-20260728-001
└─ Assigned To: [On-call engineer]
```

---

### FASE 2: ANÁLISE INICIAL (15-60 min)

#### Responsável
Tier 2 On-Call Engineer

#### O Que Fazer?
```
1. ✓ Reunir mais informações
   ├─ Logs relevantes
   ├─ Network traces
   ├─ User activity
   └─ System metrics

2. ✓ Determinar escopo
   ├─ Quantos sistemas afetados?
   ├─ Quantos usuários afetados?
   ├─ Que dados potencialmente expostos?
   └─ Duração estimada do incidente?

3. ✓ Confirmar severidade real
   ├─ Reclassificar se necessário
   ├─ Escalar se CRÍTICO → Tier 3 imediatamente
   └─ Notificar stakeholders

4. ✓ Preservar evidências
   ├─ Snapshots de logs
   ├─ Screenshots
   ├─ Network captures
   └─ Database backups
```

#### Checklist de Análise
- [ ] Quem teve acesso?
- [ ] Que dados foram acessados?
- [ ] Quando começou?
- [ ] Quando parou?
- [ ] Como entrou?
- [ ] Há evidência de exfiltração?
- [ ] Há backdoors restantes?

---

### FASE 3: CONTENÇÃO (1-4 horas)

#### OBJETIVO: Parar o ataque, limitar danos

#### Para CRÍTICO: Imediato
```
SHORT TERM (0-15 min):
├─ Kill suspicious sessions
├─ Block attacker IP (firewalls)
├─ Disable compromised accounts
├─ Activate WAF (Web Application Firewall) rules
└─ Take snapshot de todos os sistemas

MEDIUM TERM (15-60 min):
├─ Rotate compromised credentials
├─ Enable additional logging/monitoring
├─ Prepare communication to customers
├─ Assign IR team members
└─ Open bridge call (all hands)
```

#### Para ALTO: 1-4 horas
```
1. ✓ Patch vulnerabilidade
2. ✓ Rotate credentials
3. ✓ Monitor para atividade suspeita adicional
4. ✓ Notificar afetados
```

#### Para MÉDIO: 24 horas
```
1. ✓ Desenvolver patch
2. ✓ Testar em staging
3. ✓ Deploy em horário de manutenção
4. ✓ Verificar resolução
```

---

### FASE 4: ERRADICAÇÃO (2-24 horas)

#### OBJETIVO: Remover raiz do problema

```
1. ✓ Aplicar patch de segurança
2. ✓ Rebuild systems if necessary
3. ✓ Verificar não há backdoors
4. ✓ Scan com malware detection tools
5. ✓ Penetration test (se disponível)
6. ✓ Code review da vulnerabilidade
7. ✓ Implement mitigating controls
8. ✓ Document root cause
```

#### Verificação
- [ ] Nenhuma evidência de atividade suspeita
- [ ] Logs limpos de malware
- [ ] Patch verificado em produção
- [ ] Monitoring confirma saúde
- [ ] Testes de funcionalidade passam

---

### FASE 5: RECUPERAÇÃO (1-7 dias)

#### OBJETIVO: Restore to normal operations

```
1. ✓ Monitor sistema 24/7
2. ✓ Gradualmente restaurar serviços (se necessário)
3. ✓ Validar integridade de dados
4. ✓ Re-onboard users (reset passwords se necessário)
5. ✓ Comunicação: "Incidente resolvido"
6. ✓ Oferecer suporte adicional
7. ✓ Monitorar para recorrência
```

#### Success Criteria
- ✓ Sistema operacional normal
- ✓ Performance métricas normalizadas
- ✓ Nenhuma evidência de malware
- ✓ Usuários confirmam acesso
- ✓ Logs limpos

---

### FASE 6: LIÇÕES APRENDIDAS (3-7 dias)

#### Post-Incident Review (PIR) Meeting

**Participantes:**
- Tech Lead
- On-call engineer
- Security lead
- Product (se aplicável)
- CEO (se incidente CRÍTICO)

**Agenda (90min):**
```
1. Cronologia (15 min)
   ├─ Quando começou?
   ├─ Como foi detectado?
   ├─ Qual foi a resposta?
   └─ Quando foi resolvido?

2. Root Cause Analysis (20 min)
   ├─ Por que aconteceu?
   ├─ Que controles falharam?
   ├─ Que sinais perdemos?
   └─ Documentar em RCA template

3. Impact Analysis (15 min)
   ├─ Quantos clientes afetados?
   ├─ Que dados expostos?
   ├─ Impacto financeiro?
   ├─ Impacto reputacional?
   └─ Violações de compliance?

4. Improvement Actions (40 min)
   ├─ Ação preventiva (short-term)
   ├─ Correção (medium-term)
   ├─ Melhoria (long-term)
   ├─ Responsável por cada ação
   └─ Deadline para implementação
```

#### Template de Ações
```
ACTION-001: [Description]
├─ Category: PREVENTIVE / CORRECTIVE / DETECTIVE
├─ Owner: [Name]
├─ Deadline: [Date]
├─ Priority: P1 / P2 / P3
└─ Status: OPEN / IN-PROGRESS / CLOSED

Examples:
├─ "Implementar WAF rules para SQL injection" (PREVENTIVE)
├─ "Patch vulnerability in component X" (CORRECTIVE)
├─ "Add monitoring alert for suspicious patterns" (DETECTIVE)
└─ "Training on secure coding" (PREVENTIVE)
```

---

## 5. NOTIFICAÇÃO & COMUNICAÇÃO

### Matriz de Notificação

| Severidade | Notificar | Timeline | Método |
|-----------|----------|----------|--------|
| **CRÍTICO** | CEO, Legal, Board | <1h | Call + Email |
| **ALTO** | CTO, Legal | <4h | Email + Slack |
| **MÉDIO** | Tech Lead | <8h | Slack |
| **BAIXO** | Team | <24h | Email |

### Comunicação com Clientes & Reguladores

#### GDPR Breach Notification (Artigo 33)
```
IF dados pessoais expostos:
├─ Notificar supervisory authority (CNPD/DPA)
├─ Prazo: 72 horas APÓS descoberta
├─ SEM alerta se "unlikely to result in risk"
└─ Documentar o motivo da não-notificação

Template:
Date: [When discovered]
Authority: [DPA email]
Contact: [Responsible person]
Method: [Email + GDPR form]
Details:
├─ Data types affected
├─ Number of individuals
├─ Likely consequences
├─ Measures taken/proposed
└─ DPO contact
```

#### Customer Notification (Artigo 34)
```
IF "high risk to rights and freedoms":
├─ Notificar clientes afetados
├─ Prazo: Sem demora injustificada
├─ Idioma: Português/Inglês
└─ Método: Email (at least)

Content:
├─ Facts of the breach
├─ Likely consequences
├─ Measures taken
├─ Support offered
├─ DPO contact
└─ Plain language (avoid jargon)
```

#### Public Communication (se necessário)
```
Blog Post / Press Release:
├─ "Tikvah Takes Security of Patient Data Very Seriously"
├─ Acknowledge breach
├─ Explain what happened (high-level)
├─ Steps taken immediately
├─ Additional measures implemented
├─ FAQ link
└─ Support contact info
```

---

## 6. FERRAMENTAS & RECURSOS

### Ferramentas Necessárias
```
Monitoring:
├─ Sentry (error tracking)
├─ Vercel monitoring dashboard
├─ Supabase analytics
└─ Custom alerting scripts

Analysis:
├─ ELK Stack (Elasticsearch/Logstash/Kibana)
├─ Database query tools
├─ Network packet analyzer (Wireshark)
└─ Malware scanner (ClamAV)

Response:
├─ Incident response runbooks
├─ Communication templates
├─ Legal hold procedures
└─ Forensic imaging tools
```

### Checklists Pre-Built
- [ ] `CRITICAL_INCIDENT_CHECKLIST.txt`
- [ ] `GDPR_BREACH_NOTIFICATION.txt`
- [ ] `COMMUNICATION_TEMPLATES.txt`
- [ ] `FORENSIC_PRESERVATION.txt`
- [ ] `RECOVERY_PROCEDURES.txt`

---

## 7. TREINAMENTO & TESTES

### Treino Obrigatório
```
Annual:
├─ Todos os engineers: Incident response fundamentals (2h)
├─ On-call rotation: Specific role training (4h)
├─ Management: Communication & escalation (2h)
└─ Board: Executive overview (1h)

Resources:
├─ SANS OnDemand courses
├─ NIST 800-61 (Computer Security Incident Handling)
├─ Internal playbooks
└─ Case studies
```

### Testes de IR (Tabletop Exercises)
```
Quarterly:
├─ SCENARIO 1: Data breach (Setembro)
├─ SCENARIO 2: DDoS attack (Dezembro)
├─ SCENARIO 3: Insider threat (Março)
├─ SCENARIO 4: System failure (Junho)

Format:
├─ 2 horas, sala de conferência
├─ Facilitador lê cenário
├─ Team responde com ações
├─ Debrief & lessons learned
└─ Atualizar plano baseado em findings
```

---

## 8. COMPLIANCE & DOCUMENTAÇÃO

### Registros Mantidos
```
Para cada incidente:
├─ Ticket #, Data, Hora
├─ Descrição, Classificação
├─ Timeline de eventos
├─ Pessoas envolvidas
├─ Ações tomadas
├─ Evidências preservadas
├─ Notificações enviadas
└─ Lessons learned
```

### Retenção Legal
```
Retenção Mínima: 3 anos
├─ Detalhes técnicos do incidente
├─ Communicações relacionadas
├─ Registro de investigações
├─ Documentação de remediação
└─ Relatórios de conformidade

Armazenamento: Secure, encrypted
Acesso: Apenas authorized personnel
Eliminação: Secure destruction protocol
```

### Conformidade com Normas
```
ISO 27001 A.16: Información Security Incident Management
├─ Assessment responsabilidades
├─ Apropriate investigation
├─ Response procedures
├─ Lessons learned

GDPR Articles 33-34: Breach Notification
├─ Prompt notification authority
├─ Notification of data subjects
├─ Documentation

NIST 800-61: Computer Security Incident Handling
├─ Preparation
├─ Detection & Analysis
├─ Containment
├─ Eradication
├─ Recovery
└─ Post-Incident Activities
```

---

## 9. CONTATOS DE EMERGÊNCIA

### Internal Escalation
```
Tier 1: On-Call Engineer (24/7)
└─ Slack: #security-on-call
└─ PagerDuty: [trigger]

Tier 2: Tech Lead
└─ Email: [email]
└─ Phone: [phone]

Tier 3: CTO
└─ Email: [email]
└─ Phone: [phone]

Tier 4: CEO
└─ Email: [email]
└─ Phone: [phone]
```

### External Contacts
```
Legal: [General Counsel]
Data Protection Authority:
├─ CNPD (Mozambique privacy regulator)
├─ Email: XXX@cnpd.gov.mz
└─ Phone: +258-XX-XXXXXX

Insurance: [Cyber Insurance Provider]
└─ Claims: XXX
└─ 24h Hotline: XXX

Public Relations: [PR Firm]
└─ Crisis comms: XXX
```

---

## 10. APROVAÇÃO & REVISÃO

### Aprovações Iniciais
- [ ] CTO: _________________ Data: _______
- [ ] CEO: _________________ Data: _______
- [ ] Legal: ________________ Data: _______

### Revisão Anual
- [ ] 28 Julho 2027 (próxima revisão)
- [ ] Atualizar contatos se necessário
- [ ] Incorporate lessons learned
- [ ] Test procedures com tabletop exercise

---

**Status:** 📋 DRAFT - Aguardando Aprovação  
**Próxima Revisão:** 28 Julho 2027  
**Dono:** [Tech Lead Name]

