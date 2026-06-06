import React, { Suspense } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Loader2 } from "lucide-react";
import LiveServicesGrid from "@/components/services/LiveServicesGrid";

const ServicesCatalog = React.lazy(() => import("./ServicesCatalog"));

const CatalogSkeleton = () => (
  <div
    data-testid="services-catalog-loading"
    aria-busy="true"
    aria-live="polite"
    className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
  >
    <div className="flex items-center justify-center gap-2 text-slate-600 mb-8">
      <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
      <span className="text-sm font-medium">A carregar catálogo de serviços…</span>
    </div>
    <Skeleton className="h-10 w-2/3 mx-auto mb-4" />
    <Skeleton className="h-5 w-3/4 mx-auto mb-10" />
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-48 rounded-xl" />
      ))}
    </div>
  </div>
);

const CatalogFallback = () => (
  <div
    role="alert"
    data-testid="services-catalog-error"
    className="max-w-3xl mx-auto my-16 p-8 border border-red-200 bg-red-50 rounded-2xl text-center"
  >
    <AlertCircle className="w-10 h-10 mx-auto text-red-500 mb-3" aria-hidden="true" />
    <h2 className="text-xl font-bold text-red-800 mb-2">
      Não foi possível carregar o catálogo de serviços
    </h2>
    <p className="text-sm text-red-700 mb-4">
      Ocorreu um problema ao mostrar a Consultoria e o ecossistema Tikvah. Tente recarregar a
      página ou contacte-nos diretamente.
    </p>
    <button
      onClick={() => window.location.reload()}
      className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700"
    >
      Recarregar
    </button>
  </div>
);

const ServicesPage = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <SEOHead
        title="Serviços — Catálogo Tikvah Psychological Center"
        description="Catálogo completo de serviços Tikvah: Psicoterapia, Consultoria, Cursos e Workshops em Maputo."
        canonicalUrl="https://tikvahpsycem.lovable.app/services"
      />
      <Navbar />
      <main data-testid="services-page-main">
        <ErrorBoundary>
          <LiveServicesGrid />
        </ErrorBoundary>
        <ErrorBoundary>
          <Suspense fallback={<CatalogSkeleton />}>
            <ErrorBoundary>
              <ServicesCatalog />
            </ErrorBoundary>
          </Suspense>
        </ErrorBoundary>
        <noscript>
          <CatalogFallback />
        </noscript>
      </main>
      <Footer />
    </div>
  );
};

export default ServicesPage;
