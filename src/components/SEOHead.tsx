import { useEffect } from 'react';

const SITE_ORIGIN = 'https://tikvahpsycem.lovable.app';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  structuredData?: any | any[];
}

const toAbsolute = (url: string) => {
  if (!url) return url;
  if (/^https?:\/\//i.test(url)) return url;
  return `${SITE_ORIGIN}${url.startsWith('/') ? '' : '/'}${url}`;
};

const currentUrl = () => {
  if (typeof window === 'undefined') return SITE_ORIGIN + '/';
  return `${SITE_ORIGIN}${window.location.pathname}`;
};

export const SEOHead: React.FC<SEOHeadProps> = ({
  title = 'Tikvah Psychological Center & Multiservice',
  description = 'Psicologia, consultoria organizacional e multisserviços em Maputo. Atendimento presencial e online, com ética, confidencialidade e foco em resultados.',
  keywords = 'psicologia, terapia, consultoria, desenvolvimento humano, Maputo, Moçambique, saúde mental, coaching, mindfulness',
  canonicalUrl,
  ogImage = '/og-image.jpg',
  ogType = 'website',
  structuredData,
}) => {
  useEffect(() => {
    const canonical = canonicalUrl || currentUrl();
    const absoluteOgImage = toAbsolute(ogImage);

    document.title = title;

    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);

    updateMetaTag('og:title', title, 'property');
    updateMetaTag('og:description', description, 'property');
    updateMetaTag('og:image', absoluteOgImage, 'property');
    updateMetaTag('og:type', ogType, 'property');
    updateMetaTag('og:url', canonical, 'property');

    updateMetaTag('twitter:title', title, 'name');
    updateMetaTag('twitter:description', description, 'name');
    updateMetaTag('twitter:image', absoluteOgImage, 'name');

    updateCanonicalTag(canonical);

    if (structuredData) {
      updateStructuredData(structuredData);
    }
  }, [title, description, keywords, canonicalUrl, ogImage, ogType, structuredData]);

  return null;
};

const updateMetaTag = (name: string, content: string, attribute: string = 'name') => {
  let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  element.content = content;
};

const updateCanonicalTag = (url: string) => {
  let element = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!element) {
    element = document.createElement('link');
    element.rel = 'canonical';
    document.head.appendChild(element);
  }
  element.href = url;
};

const updateStructuredData = (data: any | any[]) => {
  // Remove previous route-scoped JSON-LD scripts
  document
    .querySelectorAll('script[data-seo="route"]')
    .forEach((el) => el.remove());

  const items = Array.isArray(data) ? data : [data];
  items.forEach((item, idx) => {
    const el = document.createElement("script");
    el.type = "application/ld+json";
    el.setAttribute("data-seo", "route");
    el.setAttribute("data-seo-index", String(idx));
    el.textContent = JSON.stringify(item);
    document.head.appendChild(el);
  });
};
