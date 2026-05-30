// Catálogo institucional Tikvah — fonte única para a página /services e
// para a secção "Nossos Serviços" da homepage. Reflecte o documento oficial
// "Serviços Tikvah" (modelo de intervenção 360°).

export interface TikvahServiceItem {
  title: string;
  description: string;
}

export interface TikvahServiceCategory {
  id: string;
  title: string;
  short: string;
  summary: string;
  gradient: string; // tailwind gradient classes
  accent: string; // tailwind text color
  icon:
    | "brain"
    | "graduation"
    | "briefcase"
    | "scale"
    | "cpu"
    | "handHeart";
  items: TikvahServiceItem[];
}

export const TIKVAH_INTRO =
  "A Tikvah estrutura os seus serviços como um ecossistema integrado, pensado para gerar impacto mensurável em pessoas, organizações e comunidades. Aliamos psicologia fundamentada em evidência, gestão estratégica, tecnologia, direito, finanças e responsabilidade social num modelo de intervenção centrado em eficiência, rigor técnico e sustentabilidade.";

export const TIKVAH_360_STATEMENT =
  "A Tikvah integra saúde mental, terapia da fala (incluindo Língua Gestual), terapia ocupacional, formação, estágios, voluntariado, gestão empresarial, gestão de negócios, recursos humanos, fiscalidade, contabilidade, tecnologia, direito, responsabilidade social e comunidade num único modelo de intervenção 360°. Cada intervenção é desenhada de forma estratégica, com base em diagnóstico rigoroso, acompanhamento contínuo e avaliação sistemática de impacto, adaptada ao contexto institucional, económico e cultural em que a organização atua.";

export const TIKVAH_CATEGORIES: TikvahServiceCategory[] = [
  {
    id: "saude-mental",
    title: "Saúde mental, reabilitação e intervenção",
    short: "Saúde Mental",
    summary:
      "Avaliação, psicoterapia e reabilitação multidisciplinar com foco em autonomia e bem-estar.",
    gradient: "from-teal-600 to-emerald-600",
    accent: "text-emerald-600",
    icon: "brain",
    items: [
      {
        title: "Psicologia clínica, social e organizacional",
        description:
          "Avaliação psicológica, formulação de caso, planeamento de intervenção individualizado e acompanhamento continuado, com foco em saúde mental, trauma, resiliência e desempenho pessoal e profissional.",
      },
      {
        title: "Terapia da Fala",
        description:
          "Avaliação fonética, fonológica e linguística, com reabilitação de perturbações de fala, comunicação e linguagem em desenvolvimento infantil e reabilitação de adultos.",
      },
      {
        title: "Terapia da Fala em Língua Gestual",
        description:
          "Apoio especializado a pessoas com deficiência auditiva, focado em comunicação acessível, mediação linguística, integração escolar e ajuste de materiais pedagógicos e institucionais.",
      },
      {
        title: "Terapia Ocupacional",
        description:
          "Avaliação funcional e (re)habilitação de atividades de vida diária, com foco em autonomia, participação social e adaptação de ambientes domésticos, educativos e clínicos.",
      },
      {
        title: "Apoio psicológico em crises",
        description:
          "Intervenção protocolada em situações de emergência, desastre, trauma, violência e transições críticas, com equipas de resposta rápida e suporte a vítimas e acompanhantes.",
      },
      {
        title: "Terapias individuais, familiares e de grupo",
        description:
          "Programas terapêuticos estruturados baseados em evidência (TCC, abordagens sistémicas e outras modalidades), com metas de curto, médio e longo prazo.",
      },
    ],
  },
  {
    id: "formacao",
    title: "Formação, estágios, P&D e capacitação avançada",
    short: "Formação & P&D",
    summary:
      "Cursos certificados, estágios supervisionados e investigação aplicada em saúde mental e ciências sociais.",
    gradient: "from-blue-600 to-indigo-600",
    accent: "text-blue-600",
    icon: "graduation",
    items: [
      {
        title: "Cursos e treinamentos",
        description:
          "Formação técnica, psicológica, organizacional e socioeducativa, com foco em transferência de competências práticas para contextos de saúde, educação, justiça e sociedade civil.",
      },
      {
        title: "Primeiros Socorros Psicológicos (PSP)",
        description:
          "Módulos de resgate psicológico inicial, resposta em desastres e apoio em emergências, dirigidos a profissionais de saúde, educação, segurança pública e organizações de socorro.",
      },
      {
        title: "Estágios supervisionados",
        description:
          "Estágios clínicos, educativos e comunitários em psicologia, terapia da fala, terapia ocupacional, saúde mental e intervenção social, com supervisão regular e contrato de estágio.",
      },
      {
        title: "Programas de Estágio Profissional (PEP)",
        description:
          "Estágios práticos em contexto de mercado, desenhados em parceria com instituições de ensino superior e organizações de saúde, educação e serviços sociais.",
      },
      {
        title: "Monitoria e Avaliação de Projetos (M&E)",
        description:
          "Desenvolvimento de indicadores, quadros lógicos, planos de avaliação e sistemas de relatoria de impacto para projetos sociais, de saúde, educacionais e comunitários.",
      },
      {
        title: "Pesquisa e Desenvolvimento (P&D)",
        description:
          "Investigação aplicada em psicologia, saúde mental, educação, políticas sociais, justiça, pós-desastre e modelos de intervenção em contextos de vulnerabilidade.",
      },
    ],
  },
  {
    id: "gestao-projetos",
    title: "Gestão de projetos, administração e operações institucionais",
    short: "Projetos & Operações",
    summary:
      "Ciclo de projeto completo, gestão de ONGs, voluntariado estruturado e operações institucionais.",
    gradient: "from-amber-500 to-orange-600",
    accent: "text-amber-600",
    icon: "briefcase",
    items: [
      {
        title: "Gestão completa de projetos sociais, de saúde e institucionais",
        description:
          "Diagnóstico, planeamento, captação de recursos, implementação, monitoria, avaliação e relato de resultados, com foco em eficácia programática.",
      },
      {
        title: "Administração e operações",
        description:
          "Desenho de sistemas administrativos, fluxos de trabalho, manuais de procedimento, gestão documental e conformidade institucional.",
      },
      {
        title: "Gestão de organizações sem fins lucrativos",
        description:
          "Suporte em recursos humanos, logística, contratação de servidores e parceiros, e gestão de parcerias com agências e financiadores internacionais.",
      },
      {
        title: "Voluntariado estruturado",
        description:
          "Programas em psicologia social, assistência social, psicologia clínica, educação de infância, nutrição, saúde e terapias, com ficha de enquadramento e avaliação de impacto.",
      },
      {
        title: "Voluntariado comunitário",
        description:
          "Apoio pós-desastre, atividades de saúde mental, sensibilização comunitária, ações de limpeza, educação e suporte psicossocial em parceria com comunidades locais.",
      },
    ],
  },
  {
    id: "gestao-empresarial",
    title: "Gestão empresarial, negócios, RH, economia e fiscalidade",
    short: "Empresarial & RH",
    summary:
      "Estratégia, processos, pessoas e desempenho económico para PMEs e instituições.",
    gradient: "from-slate-700 to-slate-900",
    accent: "text-slate-700",
    icon: "scale",
    items: [
      {
        title: "Gestão Empresarial",
        description:
          "Diagnóstico organizacional, definição de estratégia institucional, alinhamento de processos internos, gestão de mudança e otimização do desempenho de equipas.",
      },
      {
        title: "Gestão de Negócios",
        description:
          "Planeamento estratégico, modelagem de negócio, objetivos de mercado, análise de risco e indicadores de desempenho para organizações de diversos setores.",
      },
      {
        title: "Consultoria em Negócios",
        description:
          "Conceção e implementação de projetos comerciais, expansão de portfólio, reestruturação de modelos operacionais e reengenharia de processos.",
      },
      {
        title: "Gestão e Administração de Recursos Humanos",
        description:
          "Recrutamento e seleção, avaliação de desempenho, planos de desenvolvimento, políticas de carreira, remuneração, benefícios, clima e bem-estar no trabalho.",
      },
      {
        title: "Planeamento de Recursos Humanos",
        description:
          "Estimativa de necessidades de pessoal, planeamento de sucessão, gestão de competências e alinhamento entre talento e estratégia de longo prazo.",
      },
      {
        title: "Gestão de Clima Organizacional",
        description:
          "Diagnósticos de ambiente de trabalho, resolução de conflitos, gestão de stress e burnout, fortalecimento de cultura e culturas de segurança e confiança.",
      },
      {
        title: "Análise Económica aplicada",
        description:
          "Avaliação de impacto de políticas e programas, análise de custo-benefício, modelagem de cenários financeiros e suporte à decisão estratégica.",
      },
      {
        title: "Economia de Recursos Humanos",
        description:
          "Articulação entre RH, custos operacionais, produtividade e desempenho, com foco em reduzir desperdícios e melhorar o retorno do investimento em capital humano.",
      },
      {
        title: "Contabilidade e Auditoria",
        description:
          "Sistemas contabilísticos, demonstrações financeiras, contabilidade de gestão, auditoria interna e garantia de transparência e conformidade regulatória.",
      },
      {
        title: "Fiscalidade corporativa",
        description:
          "Planeamento fiscal, enquadramento legal, obrigações de impostos, regularização de débitos e orientação em conformidade com a legislação fiscal local.",
      },
      {
        title: "Jurisprudência aplicada",
        description:
          "Pareceres jurídicos, suporte em processos administrativos e contenciosos, com foco em direitos humanos, saúde mental, proteção de dados e responsabilidade institucional.",
      },
      {
        title: "Assessoria empresarial e institucional",
        description:
          "Governança, políticas internas, gestão de risco, compliance e desenvolvimento de normas internas alinhadas com standards internacionais.",
      },
    ],
  },
  {
    id: "tecnologia",
    title: "Tecnologia, inovação e comunicação",
    short: "Tecnologia",
    summary:
      "Infraestrutura segura, plataformas digitais especializadas e produção de conteúdos.",
    gradient: "from-violet-600 to-purple-700",
    accent: "text-violet-600",
    icon: "cpu",
    items: [
      {
        title: "Tecnologias de Informação (TI)",
        description:
          "Gestão de infraestrutura de rede, sistemas de informação, segurança de dados, gestão documental eletrónica e suporte técnico a equipas psicossociais e de campo.",
      },
      {
        title: "Desenvolvimento de soluções digitais",
        description:
          "Plataformas para gestão de pacientes, sessões terapêuticas, beneficiários, projetos, indicadores de impacto e M&E, com foco em segurança, privacidade e usabilidade.",
      },
      {
        title: "Publicações e Mídia",
        description:
          "Produção de conteúdos técnicos, divulgativos e educativos, relatórios institucionais, materiais de formação, campanhas de sensibilização e comunicação digital.",
      },
    ],
  },
  {
    id: "sustentabilidade",
    title: "Sustentabilidade, responsabilidade social e comunidade",
    short: "Comunidade & RSC",
    summary:
      "Programas de impacto social, outreach comunitário e voluntariado alinhado a M&E.",
    gradient: "from-rose-600 to-pink-600",
    accent: "text-rose-600",
    icon: "handHeart",
    items: [
      {
        title: "Sustentabilidade organizacional",
        description:
          "Modelos de sustento a longo prazo, diversificação de fontes de financiamento e integração de práticas de responsabilidade social na missão e valores.",
      },
      {
        title: "Responsabilidade Social",
        description:
          "Desenho e implementação de programas de impacto social em educação, saúde, nutrição, proteção de grupos vulneráveis e terapia comunitária, com monitoria sistemática.",
      },
      {
        title: "Outreach e Suporte Comunitário",
        description:
          "Intervenções de proximidade, serviços móveis, sensibilização, grupos de apoio e parcerias com lideranças comunitárias e organizações locais.",
      },
      {
        title: "Engajamento comunitário e voluntariado",
        description:
          "Programas estruturados e ações pontuais em saúde mental, educação, assistência básica e apoio pós-desastre, alinhados a planos de programa e sistemas de M&E.",
      },
    ],
  },
];
