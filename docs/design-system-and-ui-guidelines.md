# Diretrizes do Design System e UI — Ecossistema Tikvah

**Código do Documento:** TIKVAH-DS-UI-ISO9241  
**Versão:** 1.0.0  
**Data de Emissão:** 30 de Maio de 2026  
**Classificação:** Interno / Técnico  
**Conformidade Normativa:** Alinhado com a ISO 9241-210 (Design Centrado no Humano)

---

## 1. Fundamentos da Marca e Tom de Voz Visual
A interface do ecossistema Tikvah deve projetar rigor técnico, estabilidade clínica e eficiência executiva. O design afasta-se de excessos decorativos e adota uma estética limpa, focada no conteúdo e na facilidade de conversão (agendamento e pagamento), em estrita conformidade com as normas internacionais de usabilidade de e-commerce.

---

## 2. Paleta de Cores Institucional (Tokens de Cor)
As cores do projeto estão centralizadas no motor do Tailwind (`tailwind.config.ts`). É expressamente proibida a introdução de cores fora destes padrões corporativos:

### 2.1. Cores Primárias (Identidade e Autoridade)
*   **Teal Corporativo (Principal):** `#0d9488` (`teal-600`) — Utilizado em botões de ação principal (CTA), links críticos e elementos de destaque ativos.
*   **Teal Escuro (Hover):** `#0f766e` (`teal-700`) — Estado de interação imediata sobre botões primários.
*   **Teal Suave (Fundo):** `#f0fdfa` (`teal-50`) — Fundos de badges ou alertas de validação positiva.

### 2.2. Cores Secundárias e Neutras (Estrutura e Leitura)
*   **Slate Escuro (Tipografia):** `#0f172a` (`slate-900`) — Títulos principais (H1, H2) e textos de alta legibilidade.
*   **Slate Médio (Subtítulos):** `#475569` (`slate-600`) — Corpo de texto e descrições secundárias.
*   **Fundo da Aplicação:** `#f8fafc` (`slate-50`) — Cor base de fundo de todas as páginas públicas para mitigar o cansaço visual.
*   **Branco Puro:** `#ffffff` — Fundo de cartões de serviço, modais de checkout e blocos clicáveis.

---

## 3. Tipografia e Hierarquia Semântica
O site utiliza uma escala tipográfica rigorosa baseada em fontes sem serifa (Sans-Serif) nativas do sistema, garantindo um carregamento instantâneo na Vercel e total legibilidade:

*   **Títulos Principais (H1):** `text-4xl font-extrabold tracking-tight text-slate-900`
*   **Títulos de Categoria (H2):** `text-2xl font-bold text-slate-950`
*   **Títulos de Serviços/Cartões (H3):** `text-xl font-bold text-slate-900`
*   **Corpo de Texto:** `text-sm text-slate-600 leading-relaxed`

---

## 4. Estados de Interação de Componentes (UI States)

### 4.1. Cartões de Serviço Clicáveis
*   **Estado Normal:** Fundo branco, borda `slate-200`, sombra leve (`shadow-sm`).
*   **Estado Hover (Foco do Rato):** Borda transmuta para `teal-500`, sombra expande para `shadow-xl`, o título assume a cor `teal-700` e o cursor muda obrigatoriamente para `pointer`.
*   **Animação:** Transição suave de 200ms (`transition-all duration-200`).

### 4.2. Botões de Ação de Checkout (CTA)
*   **Estado Ativo:** Fundo `teal-600`, texto branco, cantos arredondados (`rounded-xl`), sombra de projeção suave.
*   **Estado Hover:** Fundo `teal-700`.
*   **Estado Desativado (Loading):** Opacidade reduzida a 50% (`disabled:opacity-50`), bloqueio de cliques duplicados e alteração do texto para "A processar...", evitando erros transacionais no Stripe.

---

## 5. Arquitetura de Janelas Flutuantes (Modais de Detalhe)
Em conformidade com a acessibilidade **ISO/IEC 40500**, todo o modal de detalhe expandido de serviço deve obedecer às seguintes diretrizes estruturais:
1.  **Fundo de Isolamento (Overlay):** Uso da classe `bg-gradient-to-b from-slate-900/60 to-slate-950/60` com desfoque de fundo (`backdrop-blur-sm`) para focar a atenção do utilizador exclusivamente na decisão de compra.
2.  **Entrada Fluida:** Aplicação obrigatória da animação customizada `animate-fadeIn` registada no `tailwind.config.ts`, gerando uma transição elegante de opacidade e escala (de 95% para 100% em 0.2 segundos).
3.  **Fecho Acessível:** Botão de fecho claro no canto superior direito (`&times;`) e mapeamento do clique fora da área do modal para abortar a operação com segurança.
