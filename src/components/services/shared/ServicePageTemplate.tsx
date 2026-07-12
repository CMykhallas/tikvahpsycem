/**
 * ServicePageTemplate — Layout único que consome um `ServiceConfig`
 * e monta a página inteira: SEO + Hero + FeatureGrid + Pricing + FAQ +
 * Formulário multi-step + Sticky CTA mobile.
 *
 * Novos serviços = nova entrada em `src/config/services.ts` + rota
 * apontando para este template. Zero código de UI adicional.
 */
import { lazy, Suspense } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BreadcrumbNavigation } from "@/components/BreadcrumbNavigation";
import { SEOHead } from "@/components/SEOHead";
import { getService, getFAQPage, getBreadcrumbList, getOrganization } from "@/lib/seo/jsonld";
import type { ServiceConfig } from "@/config/services";
import { ServiceHero } from "./ServiceHero";
import { FeatureGrid } from "./FeatureGrid";
import { ServiceSkeleton, ServiceEmptyState } from "./ServiceSkeleton";
import { StickyCta } from "./StickyCta";

// Code-splitting: pricing + FAQ + formulário só carregam quando renderizam.
const PricingTier = lazy(() =>
  import("./PricingTier").then((m) => ({ default: m.PricingTier })),
);
const ServiceFAQ = lazy(() =>
  import("./ServiceFAQ").then((m) => ({ default: m.ServiceFAQ })),
);
const MultiStepBudgetForm = lazy(() =>
  import("./MultiStepBudgetForm").then((m) => ({ default: m.MultiStepBudgetForm })),
);

interface Props {
  config: ServiceConfig | null;
  /** Optional sticky sub-nav rendered directly under the breadcrumb. */
  stickyNav?: React.ReactNode;
  /** Optional extra content rendered between FeatureGrid and Pricing. */
  extraContent?: React.ReactNode;
}

export const ServicePageTemplate: React.FC<Props> = ({ config, stickyNav, extraContent }) => {
  if (!config) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navbar />
        <ServiceEmptyState message="Este serviço não está disponível de momento." />
        <Footer />
      </div>
    );
  }

  const canonicalPath = `/services/${config.slug}`;
  const structured: unknown[] = [
    getOrganization(),
    getService({
      name: config.seo.title.split("|")[0].trim(),
      description: config.seo.description,
      path: canonicalPath,
      serviceType: config.schemaType,
    }),
    getBreadcrumbList([
      { name: "Início", path: "/" },
      { name: "Serviços", path: "/services" },
      { name: config.hero.highlight, path: canonicalPath },
    ]),
  ];
  if (config.faq && config.faq.length > 0) {
    structured.push(getFAQPage(config.faq));
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <SEOHead
        title={config.seo.title}
        description={config.seo.description}
        keywords={config.seo.keywords}
        canonicalUrl={`https://tikvahpsycem.lovable.app${canonicalPath}`}
        structuredData={structured}
      />
      <Navbar />
      <BreadcrumbNavigation />
      {stickyNav}

      <main
        id="main-content"
        tabIndex={-1}
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 focus:outline-none"
      >
        <ServiceHero hero={config.hero} />

        <FeatureGrid
          features={config.features}
          ctaHref={config.cta.primaryHref}
          trackPrefix={config.slug}
        />

        {extraContent}

        {config.pricing && config.pricing.length > 0 && (
          <Suspense fallback={<ServiceSkeleton />}>
            <PricingTier tiers={config.pricing} trackPrefix={config.slug} />
          </Suspense>
        )}

        {config.faq && config.faq.length > 0 && (
          <Suspense fallback={null}>
            <ServiceFAQ faqs={config.faq} />
          </Suspense>
        )}

        {/* Bloco de conversão: CTA + formulário */}
        <section
          aria-labelledby="cta-heading"
          className="grid lg:grid-cols-2 gap-8 bg-white rounded-2xl shadow-lg p-6 md:p-10"
        >
          <div>
            <h2 id="cta-heading" className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">
              {config.cta.heading}
            </h2>
            <p className="text-slate-600 mb-6 leading-relaxed">{config.cta.body}</p>
            <div className="flex flex-col sm:flex-row gap-3">
              {config.cta.whatsapp && (
                <a
                  href={`https://wa.me/${config.cta.whatsapp}`}
                  target="_blank" rel="noopener noreferrer"
                  data-track-click={`${config.slug}-cta-whatsapp`}
                  className="inline-flex items-center justify-center px-5 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
                >
                  WhatsApp
                </a>
              )}
              {config.cta.email && (
                <a
                  href={`mailto:${config.cta.email}`}
                  data-track-click={`${config.slug}-cta-email`}
                  className="inline-flex items-center justify-center px-5 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
                >
                  Email
                </a>
              )}
            </div>
          </div>
          <div className="border-t lg:border-t-0 lg:border-l border-slate-200 pt-6 lg:pt-0 lg:pl-8">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Peça um orçamento personalizado
            </h3>
            <Suspense fallback={<div className="text-sm text-slate-500">A carregar formulário…</div>}>
              <MultiStepBudgetForm
                serviceSlug={config.slug}
                serviceLabel={config.hero.highlight}
              />
            </Suspense>
          </div>
        </section>
      </main>

      <StickyCta
        label={config.cta.primaryLabel}
        href={config.cta.primaryHref}
        trackId={`${config.slug}-sticky`}
        whatsapp={config.cta.whatsapp}
      />

      <Footer />
    </div>
  );
};
