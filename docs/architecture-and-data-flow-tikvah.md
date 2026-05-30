# Arquitetura de Sistemas e Fluxo de Dados — Ecossistema Tikvah

**Código do Documento:** TIKVAH-ARCH-DATAFLOW  
**Versão:** 1.0.0  
**Data de Emissão:** 30 de Maio de 2026  
**Classificação:** Técnico / Executivo  
**Conformidade Normativa:** Alinhado com a ISO/IEC 42010 (Descrição de Arquitetura de Sistemas)

---

## 1. Visão Geral da Infraestrutura Tecnológica
O ecossistema digital da Tikvah opera sob uma arquitetura desacoplada (*Serverless*), projetada para garantir alta disponibilidade, segurança criptográfica e processamento assíncrono de transações financeiras. A infraestrutura divide-se em três pilares fundamentais:

*   **Frontend (Camada de Apresentação):** Hospedado na plataforma **Vercel**, compilado em React, TypeScript e Tailwind CSS. Controla a interface do utilizador e a captura inicial de dados sanitizados.
*   **Backend e Base de Dados (Camada de Lógica e Persistência):** Gerido pelo **Supabase**, operando através de *PostgreSQL* e rotas isoladas executadas em *Supabase Edge Functions* (ambiente Deno runtime).
*   **Gateways de Pagamento (Camada Transacional):** Integração via API direta com o **Stripe** (cartões internacionais de crédito/débito) e carteiras móveis locais (**M-Pesa**).

---

## 2. Fluxo Sequencial de Dados: Funil de Vendas e Faturação

O processamento de um agendamento e a validação do nível de serviço (SLA) cumprem estritamente o seguinte fluxo de dados de ponta a ponta:

### Fase 1: Seleção e Sanitização (Frontend ➔ Supabase)
1. O utilizador interage com o catálogo de serviços (`src/pages/Services.tsx`), seleciona a modalidade (Online, Presencial, Híbrido) e aciona o botão de compra.
2. Os dados do formulário passam pela função `validateFormDataAdvanced` para mitigar injeções e ataques de string aninhadas.
3. O calculador aplica o multiplicador de modalidade definido em `pricing-guidelines-tikvah.md` e dispara uma requisição segura `POST` com o payload JSON para o endpoint `/functions/v1/create-checkout`.

### Fase 2: Autenticação e Tokenização (Supabase Edge Function)
1. A Edge Function `create-checkout/index.ts` intercepta o pedido, valida o cabeçalho CORS e aplica um controlo estrito de requisições por IP (*Rate Limiting*).
2. A função extrai com segurança os parâmetros de redirecionamento do cliente, forçando a leitura sintática via `new URL()` para bloquear injeções de protocolos maliciosos (Alerta #2 CodeQL).
3. A aplicação comunica com a API do Stripe ou M-Pesa, criando uma sessão transacional blindada com os metadados do cliente e o preço exato calculado em Meticais (MZN).
4. A Edge Function retorna o ID da sessão e a URL segura de pagamento para o frontend, redirecionando o utilizador para o gateway externo.

### Fase 3: Confirmação Assíncrona e Notificação (Gateway ➔ Supabase ➔ Cliente)
1. Após a captura bem-sucedida do valor monetário no ambiente seguro do operador, o gateway dispara um evento assíncrono via **Webhook** assinado digitalmente para a Edge Function `stripe-webhook/index.ts`.
2. A função verifica a assinatura criptográfica obrigatória (`stripe-signature`) para impedir falsificações.
3. Se a assinatura for válida, o status do agendamento na tabela `appointments` é alterado de `pending_payment` para `confirmed` recorrendo a políticas nativas de isolamento de dados (*Row Level Security*).
4. O servidor aciona a API do Resend via rotinas de plano de fundo em Deno (`EdgeRuntime.waitUntil`), disparando em simultâneo o ecrã de confirmação para o cliente e o alerta executivo seguro de administração.

---

## 3. Medidas de Segurança e Conformidade Criptográfica
Em total alinhamento com a **ISO/IEC 27001**, o fluxo de dados adota as seguintes restrições de tráfego:
*   **Cifragem Obrigatória:** Todo o trânsito de dados transacionais e clínicos é cifrado sob protocolo TLS 1.3 de última geração.
*   **Anonimização de Erros:** Qualquer exceção lógica ou falha de infraestrutura capturada nos blocos `catch` é convertida em mensagens genéricas na resposta HTTP pública, mantendo o histórico técnico restrito aos servidores privados da Supabase (Mitigação de Stack Trace).
