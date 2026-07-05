/**
 * services.ts — Catálogo tipado das páginas de serviço nomeadas
 * (/services/psicoterapia, /services/cursos, /services/workshops).
 *
 * Este é o único ponto onde vive o conteúdo institucional dessas páginas.
 * Adicionar um serviço = adicionar uma entrada aqui; nenhum código de UI
 * precisa mudar (ver `ServicePageTemplate`).
 *
 * Fonte de dados: reutiliza os componentes visuais já existentes
 * (cards shadcn/ui, gradiente teal→blue) e o helper de SEO em
 * `@/lib/seo/jsonld.ts`. Preços em MZN quando aplicáveis; usar `null`
 * para faixas "sob consulta".
 */

import {
  Heart, Users, Home, Brain, Compass, Zap, Shield,
  MessageCircle, Trophy, type LucideIcon,
} from "lucide-react";

/** Um item exibido no FeatureGrid (cartões principais do serviço). */
export interface ServiceFeature {
  /** Ícone Lucide (componente React). */
  icon: LucideIcon;
  title: string;
  description: string;
  /** Ex.: "60 minutos", "8-12 participantes". Opcional. */
  meta?: string;
  /** Badge secundária (nível, público-alvo). Opcional. */
  badge?: { label: string; tone?: "green" | "yellow" | "red" | "blue" };
  /** Tópicos/módulos listados em bullets. */
  bullets?: string[];
}

/** Uma faixa de preço/pacote no PricingTier. */
export interface PricingTierData {
  id: string;
  name: string;
  /** Preço em MZN. `null` = "Sob consulta". */
  priceMZN: number | null;
  /** Unidade curta ("/sessão", "/mês"). */
  unit?: string;
  description: string;
  features: string[];
  /** Destaque visual (borda dourada + escala). */
  highlighted?: boolean;
  ctaLabel?: string;
  ctaHref?: string;
}

export interface ServiceFAQ {
  question: string;
  answer: string;
}

/** Entrada completa de um serviço institucional. */
export interface ServiceConfig {
  /** Slug usado na rota `/services/:slug`. */
  slug: "psicoterapia" | "cursos" | "workshops";
  /** Tipo Schema.org (`serviceType`). */
  schemaType: string;
  seo: {
    title: string;
    description: string;
    keywords?: string;
  };
  hero: {
    /** Palavra em destaque colorida dentro do H1. */
    highlight: string;
    /** Restante do H1 (renderizado ao redor de `highlight`). */
    titlePrefix?: string;
    titleSuffix?: string;
    subtitle: string;
  };
  features: ServiceFeature[];
  pricing?: PricingTierData[];
  faq?: ServiceFAQ[];
  cta: {
    heading: string;
    body: string;
    primaryLabel: string;
    primaryHref: string;
    /** Telefone WhatsApp opcional (E.164). */
    whatsapp?: string;
    email?: string;
  };
}

// ---------------------------------------------------------------------------
// Preços (extraídos de src/data/services-ecosystem.ts para consistência)
// ---------------------------------------------------------------------------

const WHATSAPP = "258827592980";
const EMAIL = "suporte.oficina.psicologo@proton.me";

export const SERVICES_CONFIG: Record<ServiceConfig["slug"], ServiceConfig> = {
  psicoterapia: {
    slug: "psicoterapia",
    schemaType: "Psychotherapy",
    seo: {
      title: "Psicoterapia em Maputo | Tikvah Psycem",
      description:
        "Psicoterapia individual, de casal e familiar com abordagens baseadas em evidência (TCC, ACT, MBSR). Presencial em Maputo e online.",
      keywords:
        "psicoterapia Maputo, terapia individual, terapia casal, terapia familiar, TCC, avaliação psicológica",
    },
    hero: {
      titlePrefix: "Serviços de ",
      highlight: "Psicoterapia",
      subtitle:
        "Atendimento psicológico especializado com abordagens baseadas em evidência científica.",
    },
    features: [
      {
        icon: Heart,
        title: "Psicoterapia Individual",
        description:
          "Atendimento personalizado para ansiedade, depressão, luto e desenvolvimento pessoal.",
        meta: "60 minutos",
      },
      {
        icon: Users,
        title: "Terapia de Casal",
        description:
          "Apoio especializado para casais que buscam melhorar comunicação e vínculo relacional.",
        meta: "90 minutos",
      },
      {
        icon: Home,
        title: "Terapia Familiar",
        description:
          "Intervenção sistémica para famílias que enfrentam conflitos e desafios relacionais.",
        meta: "90 minutos",
      },
      {
        icon: Brain,
        title: "Avaliação Psicológica",
        description:
          "Avaliação completa para diagnóstico e orientação terapêutica personalizada.",
        meta: "120 minutos",
      },
    ],
    pricing: [
      {
        id: "individual",
        name: "Individual",
        priceMZN: 2500,
        unit: "/sessão",
        description: "Ideal para acompanhamento contínuo pessoal.",
        features: [
          "60 min por sessão",
          "Modalidade presencial ou online",
          "Plano terapêutico personalizado",
          "Relatório mensal opcional",
        ],
        ctaLabel: "Agendar",
        ctaHref: "/appointment",
      },
      {
        id: "casal",
        name: "Casal",
        priceMZN: 3800,
        unit: "/sessão",
        description: "Foco em comunicação, vínculo e resolução de conflitos.",
        features: [
          "90 min por sessão",
          "Dois terapeutas quando indicado",
          "Diagnóstico relacional",
          "Follow-up entre sessões",
        ],
        highlighted: true,
        ctaLabel: "Agendar",
        ctaHref: "/appointment",
      },
      {
        id: "familiar",
        name: "Familiar",
        priceMZN: null,
        unit: "sob consulta",
        description: "Intervenção sistémica adaptada à dinâmica familiar.",
        features: [
          "Sessões de 90–120 min",
          "Diagnóstico sistémico inicial",
          "Modalidade presencial",
          "Plano por objetivos",
        ],
        ctaLabel: "Solicitar orçamento",
        ctaHref: "/contact",
      },
    ],
    faq: [
      {
        question: "Quanto tempo dura o tratamento?",
        answer:
          "Varia conforme demanda. Terapias breves focais duram 8–16 sessões; processos de longo prazo são reavaliados a cada 3 meses.",
      },
      {
        question: "Vocês atendem online?",
        answer:
          "Sim. Atendimento por videochamada segura, com o mesmo padrão ético e clínico do presencial.",
      },
      {
        question: "Aceitam seguros de saúde?",
        answer:
          "Trabalhamos com reembolso mediante recibo detalhado. Consulte-nos para convenções específicas.",
      },
    ],
    cta: {
      heading: "Pronto para começar?",
      body: "Nossa equipa clínica está disponível para uma primeira conversa e orientação sobre o percurso terapêutico mais adequado.",
      primaryLabel: "Agendar Consulta",
      primaryHref: "/appointment",
      whatsapp: WHATSAPP,
      email: EMAIL,
    },
  },

  cursos: {
    slug: "cursos",
    schemaType: "EducationalOccupationalProgram",
    seo: {
      title: "Cursos de Psicologia e Desenvolvimento Humano | Tikvah Psycem",
      description:
        "Cursos certificados em inteligência emocional, liderança, comunicação e desenvolvimento pessoal. Presencial em Maputo e online.",
      keywords:
        "cursos psicologia Maputo, inteligência emocional, liderança, comunicação, desenvolvimento humano",
    },
    hero: {
      highlight: "Cursos",
      titleSuffix: " de Formação",
      subtitle:
        "Programas certificados com metodologia prática e conteúdo baseado em evidência.",
    },
    features: [
      {
        icon: Brain,
        title: "Inteligência Emocional",
        description:
          "Competências emocionais para melhor relacionamento pessoal e profissional.",
        meta: "4h",
        badge: { label: "Iniciante", tone: "green" },
        bullets: ["Autoconhecimento", "Autorregulação", "Empatia", "Habilidades sociais"],
      },
      {
        icon: Users,
        title: "Liderança e Gestão",
        description:
          "Técnicas avançadas de liderança e gestão de equipas para maximizar resultados.",
        meta: "6h",
        badge: { label: "Intermediário", tone: "yellow" },
        bullets: ["Estilos de liderança", "Motivação", "Delegação", "Gestão de conflitos"],
      },
      {
        icon: MessageCircle,
        title: "Comunicação Eficaz",
        description:
          "Habilidades de comunicação para relacionamentos mais produtivos.",
        meta: "3h",
        badge: { label: "Iniciante", tone: "green" },
        bullets: ["Comunicação verbal", "Linguagem corporal", "Escuta ativa", "Feedback"],
      },
      {
        icon: Trophy,
        title: "Desenvolvimento Pessoal",
        description:
          "Programa completo para autodesenvolvimento e realização de objetivos.",
        meta: "5h",
        badge: { label: "Todos os níveis", tone: "blue" },
        bullets: ["Definição de metas", "Produtividade", "Mindset", "Planeamento"],
      },
    ],
    pricing: [
      {
        id: "individual",
        name: "Inscrição Individual",
        priceMZN: 4500,
        unit: "/curso",
        description: "Certificado digital e material de apoio incluso.",
        features: [
          "Acesso a todas as sessões",
          "Certificado de conclusão",
          "Material didático em PDF",
          "Suporte pós-curso (30 dias)",
        ],
      },
      {
        id: "corporate",
        name: "Corporativo",
        priceMZN: null,
        unit: "sob consulta",
        description: "Turmas fechadas na sua organização, conteúdo customizado.",
        features: [
          "Mínimo 8 colaboradores",
          "Conteúdo adaptado ao setor",
          "Relatório de avaliação",
          "Follow-up trimestral opcional",
        ],
        highlighted: true,
        ctaLabel: "Solicitar proposta",
        ctaHref: "/contact",
      },
    ],
    faq: [
      {
        question: "Os cursos são certificados?",
        answer:
          "Sim. Todos os participantes recebem certificado digital verificável emitido pela Tikvah.",
      },
      {
        question: "Existe modalidade online?",
        answer:
          "Sim. Todos os cursos podem ser realizados online por videoconferência, com material entregue digitalmente.",
      },
    ],
    cta: {
      heading: "Quer inscrever a sua equipa?",
      body: "Montamos turmas fechadas na sua organização com conteúdo customizado ao setor.",
      primaryLabel: "Solicitar proposta",
      primaryHref: "/contact",
      whatsapp: WHATSAPP,
      email: EMAIL,
    },
  },

  workshops: {
    slug: "workshops",
    schemaType: "Event",
    seo: {
      title: "Workshops e Formações Práticas | Tikvah Psycem",
      description:
        "Workshops experienciais sobre liderança, gestão de stress, comunicação e bem-estar, conduzidos por psicólogos da Tikvah em Maputo.",
      keywords:
        "workshops Maputo, mindfulness, gestão stress, trabalho equipa, resolução conflitos",
    },
    hero: {
      highlight: "Workshops",
      titleSuffix: " Práticos",
      subtitle:
        "Experiências de aprendizado intensivo com foco na aplicação prática dos conhecimentos.",
    },
    features: [
      {
        icon: Compass,
        title: "Mindfulness e Bem-estar",
        description:
          "Técnicas práticas de mindfulness para redução do stress e qualidade de vida.",
        meta: "3h · 8–12 pessoas",
        bullets: ["Meditação", "Respiração", "Atenção plena", "Relaxamento"],
      },
      {
        icon: Zap,
        title: "Gestão de Stress",
        description:
          "Estratégias para identificar, compreender e gerir o stress no dia a dia.",
        meta: "4h · 6–10 pessoas",
        bullets: ["Identificação do stress", "Técnicas de relaxamento", "Time management", "Autocuidado"],
      },
      {
        icon: Users,
        title: "Trabalho em Equipa",
        description:
          "Competências para colaboração eficaz e sinergia em equipas de trabalho.",
        meta: "5h · 8–15 pessoas",
        bullets: ["Comunicação", "Confiança", "Papéis & responsabilidades", "Dinâmicas de grupo"],
      },
      {
        icon: Shield,
        title: "Resolução de Conflitos",
        description:
          "Técnicas de mediação e resolução construtiva de conflitos interpessoais.",
        meta: "4h · 6–12 pessoas",
        bullets: ["Mediação", "Negociação", "Comunicação assertiva", "Gestão emocional"],
      },
    ],
    pricing: [
      {
        id: "in-company",
        name: "In-company",
        priceMZN: null,
        unit: "sob consulta",
        description: "Workshop fechado na sua organização, conteúdo customizado.",
        features: [
          "Diagnóstico prévio",
          "Facilitador sénior",
          "Material impresso",
          "Relatório final",
        ],
        highlighted: true,
        ctaLabel: "Solicitar orçamento",
        ctaHref: "/contact",
      },
      {
        id: "aberta",
        name: "Turma Aberta",
        priceMZN: 2200,
        unit: "/participante",
        description: "Inscrição individual em workshops mensais.",
        features: [
          "Turmas de 8–15 pessoas",
          "Certificado de participação",
          "Coffee break incluso",
          "Material digital",
        ],
      },
    ],
    faq: [
      {
        question: "Podem ser feitos na nossa empresa?",
        answer:
          "Sim. A modalidade in-company é a mais procurada. Desenhamos o programa em função dos objectivos e do público da organização.",
      },
    ],
    cta: {
      heading: "Vamos desenhar o workshop ideal para si?",
      body: "Fale connosco para receber uma proposta customizada em até 48h úteis.",
      primaryLabel: "Solicitar orçamento",
      primaryHref: "/contact",
      whatsapp: WHATSAPP,
      email: EMAIL,
    },
  },
};

/** Recupera a config de um serviço pelo slug, ou `null` se inexistente. */
export const getServiceConfig = (
  slug: string,
): ServiceConfig | null =>
  (SERVICES_CONFIG as Record<string, ServiceConfig>)[slug] ?? null;
