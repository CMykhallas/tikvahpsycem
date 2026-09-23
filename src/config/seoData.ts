// ============================================================
// TIKVAH PSYCHOLOGICAL CENTER & MULTISERVICE — CENTRALIZED SEO DATA
// Fonte de dados única para Metadados e JSON-LD (Schema.org)
// ============================================================

export interface RouteSchema {
  title: string;
  description: string;
  keywords: string;
  path: string;
  schemaData: object;
}

const BASE_URL = "https://lovable.app";

export const seoData: Record<string, RouteSchema> = {
  home: {
    title: "Tikvah Psychological Center & Multiservice | Psicologia e Consultoria",
    description: "Centro Multidisciplinar em Moçambique e online. Referência em Psicologia Clínica, Saúde Mental Organizacional, Consultoria Técnica e Desenvolvimento Humano.",
    keywords: "Psicologia em Maputo, consultorio, consultoria Moçambique, saúde mental Moçambique, psicoterapia online, desenvolvimento humano",
    path: "/",
    schemaData: {
      "@context": "https://schema.org",
      "@type": "Medical-Organization-Business",
      "@id": `${BASE_URL}/#organization`,
      "name": "Tikvah Psychological Center & Multiservice",
      "url": BASE_URL,
      "logo": `${BASE_URL}/tikvah-logo.jpg`,
      "telephone": "[+258 82 759 2980](tel:+258827592980)",
      "email": "suporte.oficina.psicologo@proton.me",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Maputo",
        "addressCountry": "MZ"
      },
      "priceRange": "\$\$"
    }
  },
  
  about: {
    title: "Sobre Nós | Tikvah Psychological Center",
    description: "Conheça a história, o compromisso ético e a equipa multidisciplinar da Tikvah. Excelência clínica e corporativa em Moçambique.",
    keywords: "sobre a Tikvah, equipa psicologia Maputo, clínica psicológica Moçambique",
    path: "/about",
    schemaData: {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "mainEntity": {
        "@type": "Organization",
        "name": "Tikvah Psychological Center & Multiservice"
      }
    }
  },

  // --- ECOSSISTEMA DE SERVIÇOS NUCLEARES ---
  psicoterapia: {
    title: "Psicoterapia e Apoio Emocional | Tikvah",
    description: "Consultas de psicoterapia individuais, de casal e familiares. Atendimento clínico presencial em Maputo e suporte psicológico online.",
    keywords: "psicoterapia Maputo, terapia de casal Moçambique, psicólogo clínico, saúde mental",
    path: "/services/psicoterapia",
    schemaData: {
      "@context": "https://schema.org",
      "@type": "MedicalTherapy",
      "name": "Psicoterapia e Apoio Emocional",
      "provider": {
        "@type": "MedicalBusiness",
        "name": "Tikvah Psychological Center"
      }
    }
  },

  consultoria: {
    title: "Consultoria Empresarial e Organizacional | Tikvah",
    description: "Soluções corporativas avançadas: Psicologia Organizacional, consultoria de gestão, TI, contabilidade e auditoria em Moçambique.",
    keywords: "consultoria empresarial Maputo, psicologia organizacional Moçambique, auditoria Moçambique, consultoria TI",
    path: "/services/consultoria",
    schemaData: {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Consultoria Empresarial e Organizacional",
      "provider": {
        "@type": "Organization",
        "name": "Tikvah Psychological Center & Multiservice"
      }
    }
  },

  cursos: {
    title: "Cursos e Formação Profissional | Tikvah",
    description: "Capacitação técnica e humana. Cursos e formações avançadas com foco em saúde mental, liderança corporativa e conformidade ISO.",
    keywords: "cursos de psicologia Maputo, formação profissional Moçambique, workshops corporativos",
    path: "/services/cursos",
    schemaData: {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": "Programas de Formação Profissional Tikvah",
      "description": "Cursos focados em saúde mental e desenvolvimento técnico corporativo."
    }
  },

  // --- CONTEÚDOS TÉCNICOS (BLOG DE PESQUISA) ---
  blogAct: {
    title: "Terapia ACT em Contextos Africanos | Blog Tikvah",
    description: "Análise científica sobre a aplicação da Terapia de Aceitação e Compromisso (ACT) adaptada às realidades e culturas do ecossistema africano.",
    keywords: "terapia ACT, psicologia cultural, psicoterapia áfrica, resiliência cultural",
    path: "/blog/act-terapia-contextos-africanos",
    schemaData: {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": "Terapia ACT em Contextos Africanos",
      "datePublished": "2024-08-19",
      "author": {
        "@type": "Organization",
        "name": "Tikvah Psychological Center & Multiservice"
      }
    }
  },

  blogMbsr: {
    title: "Meta-Análise de Eficácia do MBSR | Pesquisa Tikvah",
    description: "Evidências científicas e meta-análise sobre a eficácia da Redução do Stress Baseada em Mindfulness (MBSR) na saúde mental.",
    keywords: "MBSR meta analise, eficácia mindfulness, redução de stress, pesquisa psicologia",
    path: "/blog/mbsr-meta-analise-eficacia",
    schemaData: {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      "headline": "MBSR: Meta-Análise de Eficácia",
      "datePublished": "2024-08-01",
      "author": {
        "@type": "Organization",
        "name": "Tikvah Psychological Center & Multiservice"
      }
    }
  },

  blogOrganizacional: {
    title: "Psicologia Organizacional na Transformação Digital | Blog Tikvah",
    description: "Como a transformação digital impacta a saúde mental no trabalho. Estratégias de adaptação humana e conformidade com o bem-estar.",
    keywords: "psicologia organizacional, transformação digital, saúde mental no trabalho, recursos humanos Maputo",
    path: "/blog/psicologia-organizacional-transformacao-digital",
    schemaData: {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": "Psicologia Organizacional na Transformação Digital",
      "datePublished": "2024-08-19",
      "author": {
        "@type": "Organization",
        "name": "Tikvah Psychological Center & Multiservice"
      }
    }
  }
};
