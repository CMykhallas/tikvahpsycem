# 🛡️ Security Policy

A segurança do nosso projeto é uma prioridade máxima. Agradecemos o trabalho responsável de pesquisadores e usuários que nos ajudam a manter a segurança do código.

## Versões Suportadas (Supported Versions)

As versões abaixo estão atualmente sendo suportadas com correções de segurança. Os usuários são fortemente encorajados a migrar para uma versão suportada o mais rápido possível para garantir a proteção contínua.

| Versão | Suportada          |
| ------ | ------------------ |
| 5.1.x  | :white_check_mark: |
| 5.0.x  | :x:                |
| 4.0.x  | :white_check_mark: |
| < 4.0  | :x:                |

## 🚨 Relatório de uma Vulnerabilidade (Reporting a Vulnerability)

Acreditamos na divulgação responsável. Por favor, siga as diretrizes abaixo para relatar vulnerabilidades de forma privada.

### Onde Reportar

Todas as vulnerabilidades de segurança devem ser relatadas privadamente usando o recurso nativo de Relatório Privado de Vulnerabilidades do GitHub (GitHub's Private Vulnerability Reporting).

1. Navegue até a aba Security (Segurança) do nosso repositório no GitHub.
2. Clique em "Report a vulnerability" (Relatar uma vulnerabilidade).
3. Preencha o formulário detalhadamente, incluindo:
   - Uma descrição clara e concisa da vulnerabilidade.
   - Os passos exatos para reproduzir o problema (incluindo código de prova de conceito, se possível).
   - A versão do projeto afetada.

⚠️ **Por favor, não divulgue a vulnerabilidade em issues públicas, fóruns ou redes sociais.** Use exclusivamente o canal privado para garantir a segurança dos nossos usuários.

### O que Esperar após o Relatório

Nossa equipe de segurança se compromete a responder ao seu relatório de acordo com os seguintes prazos:

| Etapa | Prazo Estimado | Detalhes |
|-------|----------------|----------|
| Confirmação Inicial | 1-3 dias úteis | Você receberá uma notificação confirmando que o relatório foi recebido e está sob análise. |
| Análise e Resposta | 1 semana | Avaliaremos a validade e o impacto da vulnerabilidade. Informaremos se o relatório foi aceito (e começaremos o trabalho de correção) ou declinado (com uma explicação detalhada). |
| Atualizações de Status | Semanalmente | Você receberá atualizações sobre o progresso da correção pelo menos uma vez por semana. |
| Lançamento do Patch | 1-4 semanas | Após a correção, lançaremos uma nova versão (ex: 5.1.2) para as branches suportadas, contendo o patch de segurança. |

### Divulgação Pública (Public Disclosure)

Nós coordenaremos a divulgação pública de qualquer vulnerabilidade corrigida:

- Lançaremos um Aviso de Segurança (Security Advisory) oficial no GitHub.
- O seu nome de usuário (ou handle) será incluído nos créditos do Advisory, a menos que você solicite anonimato.
- Pedimos que o pesquisador não divulgue publicamente os detalhes até que a versão corrigida tenha sido lançada para permitir que todos os usuários atualizem seus sistemas.

## 🔒 Práticas de Segurança Implementadas

### Proteção de Credenciais
- ✅ Todas as credenciais devem estar em variáveis de ambiente
- ✅ Arquivo .env incluído no .gitignore
- ✅ Arquivo .env.example fornecido como template
- ✅ Validação de variáveis de ambiente no startup

### Segurança de Código
- ✅ TypeScript strict mode habilitado
- ✅ ESLint com regras de segurança
- ✅ Validação e sanitização de inputs
- ✅ Rate limiting implementado
- ✅ CSRF protection
- ✅ Content Security Policy (CSP)
- ✅ Security headers configurados

### Monitoramento
- ✅ Logging de eventos de segurança
- ✅ Detecção de atividades suspeitas
- ✅ Alertas automáticos para violações

### Dependências
- ✅ Dependabot configurado
- ✅ Atualizações regulares de segurança
- ✅ Análise de vulnerabilidades em CI/CD

## 📋 Checklist de Segurança para Desenvolvedores

Antes de fazer commit:
- [ ] Nenhuma credencial ou secret no código
- [ ] Inputs validados e sanitizados
- [ ] Queries SQL parametrizadas
- [ ] Autenticação e autorização implementadas
- [ ] Logs não contêm dados sensíveis
- [ ] Dependências atualizadas
- [ ] Testes de segurança passando

## 🔐 Configuração de Ambiente Seguro

### Desenvolvimento
```bash
# 1. Copie o arquivo de exemplo
cp .env.example .env

# 2. Configure suas credenciais locais
# Edite .env com suas chaves de desenvolvimento

# 3. NUNCA commite o arquivo .env
git status  # Verifique que .env não aparece
```

### Produção
- Use variáveis de ambiente do sistema
- Configure secrets no seu provedor de hosting
- Habilite HTTPS obrigatório
- Configure firewall e rate limiting
- Monitore logs de segurança

## 📞 Contato

Para questões de segurança urgentes, entre em contato:
- Email: security@tikvahpsycem.com
- GitHub Security Advisory: Use o sistema de relatório privado

---

**Última atualização:** 2025-01-06
**Versão da Política:** 2.0
