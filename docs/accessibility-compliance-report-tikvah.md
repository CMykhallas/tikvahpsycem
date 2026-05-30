# Relatório de Conformidade de Acessibilidade Web — Ecossistema Tikvah

**Código do Documento:** TIKVAH-ACR-ISO40500  
**Versão:** 1.0.0  
**Data de Emissão:** 30 de Maio de 2026  
**Classificação:** Público / Executivo  
**Conformidade Normativa:** Estritamente alinhado com a ISO/IEC 40500:2012 (WCAG 2.1 nível AA)

---

## 1. Introdução e Enquadramento Estratégico
Como uma instituição integrada que disponibiliza serviços especializados de Terapia da Fala em Língua Gestual e intervenções em psicologia social, a Tikvah estabelece a acessibilidade digital como um requisito crítico de qualidade de software. 

Este documento detalha as medidas técnicas, controlos de engenharia e escolhas de design implementadas na plataforma digital corporativa para garantir o acesso pleno, autónomo e sem barreiras a pessoas com deficiências auditivas, visuais, motoras ou cognitivas.

---

## 2. Princípios de Acessibilidade Aplicados (Diretrizes WCAG 2.1 / ISO 40500)

O desenvolvimento da interface de utilizador (`src/pages/Services.tsx` e componentes associados) rege-se pelos quatro pilares fundamentais da norma ISO/IEC 40500:

### 2.1. Perceptibilidade (Perceivable)
*   **Alternativas em Texto (Alt Text):** Todos os elementos não textuais significativos, incluindo o logótipo corporativo (`tikvah-logo.jpg`), possuem atributos `alt` descritivos e equivalentes em texto limpo.
*   **Acessibilidade Auditiva (Comunidade Surda):** Os conteúdos de vídeo divulgativos ou informativos sobre as terapias possuem legendagem oculta sincronizada (*Closed Captions*) e, prioritariamente, janelas de tradução em Língua Gestual Moçambicana (LGM).
*   **Contraste de Cor Conforme:** A paleta de cores definida em `tailwind.config.ts` foi validada para garantir um rácio de contraste mínimo de **4.5:1** entre o texto e o fundo, cumprindo a exigência de leitura para utilizadores com baixa visão.

### 2.2. Operabilidade (Operable)
*   **Navegação Exclusiva por Teclado:** Todas as funcionalidades da plataforma, como o menu de abas e os botões de "Mais Detalhes", são totalmente operáveis através da tecla `Tab`, sem criar armadilhas de teclado (*Keyboard Traps*).
*   **Foco Visível:** O estado `:focus` dos links, botões e campos de rádio no checkout utiliza um anel de destaque visível de alta visibilidade (`ring-2 ring-teal-600`), em estrita conformidade com a ISO 9001 e ISO 40500.

### 2.3. Compreensibilidade (Understandable)
*   **Idioma Padrão Declarável:** O cabeçalho HTML declara formalmente o idioma principal da aplicação (`lang="pt-MZ"`), permitindo que os softwares leitores de ecrã utilizem a sintetização de voz com a pronúncia e entonação corretas.
*   **Previsibilidade do Funil:** O fluxo de agendamento online e checkout não executa mudanças inesperadas de contexto. A abertura da janela de detalhes do serviço utiliza tags estruturais sem ambiguidades operacionais.

### 2.4. Robustez (Robust)
*   **Compatibilidade com Leitores de Ecrã:** O código utiliza semântica HTML5 pura acompanhada de atributos ARIA (*Accessible Rich Internet Applications*), como `role="dialog"` e `aria-modal="true"` na janela flutuante, garantindo que tecnologias de apoio (ex: NVDA, JAWS) interpretem o sistema corretamente.

---

## 3. Especificações Especiais para a Terapia da Fala em Língua Gestual
Dado que o serviço de *Terapia da Fala em Língua Gestual* possui requisitos de acessibilidade bidirecionais críticos, a arquitetura de canais de atendimento e agendamento foi desenhada sob as seguintes premissas:

1.  **Formulário de Contacto Acessível:** O validador avançado de dados aceita inputs textuais claros e simplificados para utentes com dificuldades marcadas de literacia escrita, decorrentes de barreiras linguísticas na aquisição precoce da linguagem.
2.  **Infraestrutura de Teleconsulta Adaptada:** O redirecionamento pós-checkout encaminha consultas da modalidade *Online* exclusivamente para plataformas que suportem vídeo em alta definição (mínimo de 720p a 30 FPS) e baixa latência, fator vital para permitir a leitura labial e a discriminação nítida de configurações manuais e expressões faciais da Língua Gestual.

---

## 4. Metodologia de Auditoria e Testes de Conformidade
Para certificar a integridade contínua das diretrizes ISO/IEC 40500 no ecossistema Tikvah, o repositório é periodicamente auditado através do seguinte protocolo:
*   **Testes Automatizados:** Inclusão de rotinas de análise estática de acessibilidade (ex: linters baseados em `eslint-plugin-jsx-a11y`) integradas na pipeline do GitHub Actions (`.github/workflows/security-audit.yml`).
*   **Testes Manuais de Utilização:** Avaliações de usabilidade reais efetuadas por profissionais da equipa de reabilitação da Tikvah, simulando a navegação com leitores de ecrã ativos e monitorizando a taxa de sucesso no preenchimento do checkout de pagamentos.
