// Central JSON-LD generators — single source of truth for Schema.org markup.
// Use these helpers in pages via <SEOHead structuredData={...} />.

import type { BlogPostMeta } from "@/data/blog-posts";

export const SITE_ORIGIN = "https://tikvahpsycem.lovable.app";
export const SITE_NAME = "Tikvah Psychological Center & Multiservice";
export const SITE_LOGO = `${SITE_ORIGIN}/tikvah-logo.jpg`;
export const SITE_DEFAULT_IMAGE = `${SITE_ORIGIN}/og-image.jpg`;
export const SITE_EMAIL = "suporte.oficina.psicologo@proton.me";
export const SITE_PHONE = "+258827592980";

const absUrl = (path: string) =>
  /^https?:\/\//i.test(path)
    ? path
    : `${SITE_ORIGIN}${path.startsWith("/") ? "" : "/"}${path}`;

export const getOrganization = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_ORIGIN}/#organization`,
  name: SITE_NAME,
  alternateName: "Tikvah Center",
  url: `${SITE_ORIGIN}/`,
  logo: SITE_LOGO,
  email: SITE_EMAIL,
  telephone: SITE_PHONE,
  sameAs: [
    "https://facebook.com/consultoriotikvah",
    "https://instagram.com/tikvah_center",
    "https://twitter.com/TikvahMZ",
  ],
});

export const getLocalBusiness = () => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE_ORIGIN}/#localbusiness`,
  name: SITE_NAME,
  url: `${SITE_ORIGIN}/`,
  logo: SITE_LOGO,
  image: SITE_DEFAULT_IMAGE,
  telephone: SITE_PHONE,
  email: SITE_EMAIL,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Av. 24 de Julho, 1.º Andar Direito",
    addressLocality: "Bairro Polana Cimento A",
    addressRegion: "Cidade de Maputo",
    addressCountry: "MZ",
  },
  geo: { "@type": "GeoCoordinates", latitude: -25.9655, longitude: 32.5832 },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "17:00",
    },
  ],
  priceRange: "$$",
  currenciesAccepted: "MZN",
  paymentAccepted: "Cash, M-Pesa, E-mola",
  areaServed: { "@type": "City", name: "Maputo" },
});

export const getBreadcrumbList = (
  items: Array<{ name: string; path: string }>,
) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: item.name,
    item: absUrl(item.path),
  })),
});

export const getBlogPosting = (post: BlogPostMeta) => {
export const getBlogPosting = (post: BlogPostMeta) => {
  const url = `${SITE_ORIGIN}/blog/${post.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title.length > 110 ? post.title.slice(0, 107) + "…" : post.title,
    description: post.description,
    image: {
      "@type": "ImageObject",
      url: absUrl(post.image),
      width: 1200,
      height: 630,
    },
    author: {
      "@type": "Organization",
      name: post.author ?? SITE_NAME,
      url: `${SITE_ORIGIN}/`,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: SITE_LOGO,
        width: 600,
        height: 60,
      },
    },
    datePublished: post.datePublished,
    dateModified: post.dateModified ?? post.datePublished,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    inLanguage: post.inLanguage ?? "pt-MZ",
  };
};


// Strip HTML from FAQ answers/questions — Google accepts limited HTML but
// inconsistent markup is the #1 cause of "Invalid HTML" warnings in Rich Results.
const stripHtml = (s: string) => s.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();

export const getFAQPage = (
  faqs: Array<{ question: string; answer: string }>,
) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: stripHtml(f.question),
    acceptedAnswer: { "@type": "Answer", text: stripHtml(f.answer) },
  })),
});


export interface ServiceInput {
  name: string;
  description: string;
  path: string; // e.g. "/services/psicoterapia"
  serviceType?: string;
  areaServedCity?: string;
}

export const getService = (input: ServiceInput) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name: input.name,
  description: input.description,
  url: absUrl(input.path),
  serviceType: input.serviceType ?? input.name,
  provider: {
    "@type": "Organization",
    "@id": `${SITE_ORIGIN}/#organization`,
    name: SITE_NAME,
    url: `${SITE_ORIGIN}/`,
    logo: SITE_LOGO,
  },
  areaServed: { "@type": "City", name: input.areaServedCity ?? "Maputo" },
});

export interface WebPageInput {
  name: string;
  description: string;
  path: string;
  dateModified?: string;
  inLanguage?: string;
}

export const getWebPage = (input: WebPageInput) => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: input.name,
  description: input.description,
  url: absUrl(input.path),
  inLanguage: input.inLanguage ?? "pt-MZ",
  isPartOf: {
    "@type": "WebSite",
    name: SITE_NAME,
    url: `${SITE_ORIGIN}/`,
  },
  publisher: {
    "@type": "Organization",
    "@id": `${SITE_ORIGIN}/#organization`,
    name: SITE_NAME,
  },
  ...(input.dateModified ? { dateModified: input.dateModified } : {}),
});
