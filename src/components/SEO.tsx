import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  schemaData?: object | object[];
}

export const SEO = ({
  title,
  description,
  keywords,
  canonicalUrl = "https://tikvahpsycem.lovable.app/",
  ogImage = "https://tikvahpsycem.lovable.app/og-image.jpg",
  schemaData
}: SEOProps) => {
  const baseKeywords = "Tikvah Psychological Center, Tikvah PSYCEM, psicologia em Maputo, psicologia Moçambique";
  const fullKeywords = keywords ? `${keywords}, ${baseKeywords}` : baseKeywords;

  return (
    <Helmet>
      {/* Primary SEO */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={fullKeywords} />
      <meta name="author" content="Tikvah Psychological Center & Multiservice" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="Tikvah Psychological Center & Multiservice" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="pt_MZ" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@tikvahpsycem" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Structured Data (JSON-LD) */}
      {schemaData && (
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
      )}
    </Helmet>
  );
};
