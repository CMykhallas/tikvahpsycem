// Central blog metadata — imported by blog pages, sitemap generator, and SEO helpers.
// Adding/updating a post here propagates to JSON-LD and sitemap lastmod automatically.

export interface BlogPostMeta {
  slug: string;
  title: string;
  description: string;
  image: string;
  datePublished: string; // ISO date (YYYY-MM-DD)
  dateModified?: string; // ISO date (YYYY-MM-DD) — defaults to datePublished
  author?: string;
  inLanguage?: string;
}

const DEFAULT_IMAGE = "/og-image.jpg";

export const BLOG_POSTS: BlogPostMeta[] = [
  {
    slug: "act-terapia-contextos-africanos",
    title: "ACT: Terapia de Aceitação e Compromisso em Contextos Africanos",
    description:
      "Aplicação da Acceptance and Commitment Therapy (ACT) em contextos africanos, com adaptação cultural e integração com valores comunitários tradicionais.",
    image: DEFAULT_IMAGE,
    datePublished: "2024-08-19",
    dateModified: "2024-08-19",
  },
  {
    slug: "mbsr-meta-analise-eficacia",
    title: "MBSR: Meta-Análise da Eficácia em Saúde Mental",
    description:
      "Revisão sistemática e meta-análise sobre a eficácia do Mindfulness-Based Stress Reduction (MBSR) em diversas populações clínicas.",
    image: DEFAULT_IMAGE,
    datePublished: "2024-08-01",
    dateModified: "2024-08-01",
  },
  {
    slug: "psicologia-organizacional-transformacao-digital",
    title: "Psicologia Organizacional e Transformação Digital",
    description:
      "Como a psicologia organizacional apoia processos de transformação digital, gestão da mudança e bem-estar no trabalho.",
    image: DEFAULT_IMAGE,
    datePublished: "2024-08-19",
    dateModified: "2024-08-19",
  },
  {
    slug: "trauma-cultural-resiliencia-pos-colonial",
    title: "Trauma Cultural e Resiliência Pós-Colonial",
    description:
      "Compreender o trauma cultural em contextos pós-coloniais africanos e estratégias de resiliência comunitária.",
    image: DEFAULT_IMAGE,
    datePublished: "2024-07-28",
    dateModified: "2024-07-28",
  },
];

export const getBlogPost = (slug: string) =>
  BLOG_POSTS.find((p) => p.slug === slug);
