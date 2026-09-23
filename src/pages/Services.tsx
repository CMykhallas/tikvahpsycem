/**
 * ============================================================================
 * TIKVAH PSYCEM — SERVICES HUB
 * ============================================================================
 *
 * @file Services.tsx
 * @description
 * Página institucional principal para descoberta das áreas de serviços
 * disponibilizadas pela Tikvah Psychological Center & Multiservice.
 *
 * RESPONSABILIDADES
 * -----------------
 * Esta página funciona como HUB institucional de serviços.
 *
 * Ela apresenta:
 * - áreas de intervenção;
 * - subáreas;
 * - programas;
 * - consultoria;
 * - formação;
 * - estágios;
 * - coaching;
 * - outras áreas institucionais relacionadas.
 *
 * NÃO É RESPONSABILIDADE DESTA PÁGINA
 * -----------------------------------
 * Esta página não deve:
 *
 * - definir preços;
 * - calcular IVA;
 * - criar modalidades comerciais;
 * - duplicar preços;
 * - inferir relações entre serviços;
 * - alterar dados do Ecossistema;
 * - criar um segundo catálogo comercial.
 *
 * O catálogo comercial permanece nos módulos:
 *
 *    src/data/tikvah-psycem-services-cms.json  (dados brutos, fonte de verdade)
 *    src/data/tikvah-services-cms.ts            (camada de tipos/exports lidos pelo ServicesCatalog)
 *
 * que constituem a fonte de verdade para:
 *
 * - IDs comerciais;
 * - categorias comerciais;
 * - serviços comercializados;
 * - preços;
 * - IVA;
 * - modalidades;
 * - preços por tipo de cliente.
 *
 * NOTA DE CORREÇÃO (importante para quem editar este ficheiro no futuro):
 * este comentário referia anteriormente "services-ecosystem.ts" como fonte
 * de verdade. Isso estava desatualizado — `ServicesCatalog.tsx` importa de
 * "@/data/tikvah-services-cms", não de "services-ecosystem.ts". O ficheiro
 * services-ecosystem.ts existe no repositório mas não é consumido por
 * nenhuma página confirmada até à data desta correção. Antes de reintroduzir
 * uma dependência nele, confirme que está realmente ligado a algo.
 *
 * ARQUITECTURA
 * ------------
 *
 *                   SERVICE HUB
 *                       │
 *          ┌────────────┴────────────┐
 *          │                         │
 *      Taxonomia                 Ecossistema
 *     institucional               comercial
 *          │                         │
 *          ▼                         ▼
 *      descoberta                preços / IVA
 *     e navegação                modalidades
 *                                    │
 *                                    ▼
 *                               contratação
 *
 * PRINCÍPIOS
 * ----------
 * - Single Source of Truth
 * - Separation of Concerns
 * - DRY
 * - Progressive Enhancement
 * - Accessibility by Design
 * - Secure by Default
 * - Fail Fast
 * - Observability
 * - Testability
 * - Explicit Data Governance
 *
 * ALINHAMENTO
 * -----------
 * Arquitectura preparada para práticas alinhadas com:
 *
 * - ISO 9001 — gestão da qualidade;
 * - ISO/IEC 27001 — segurança da informação;
 * - ISO/IEC/IEEE 29119 — testes de software;
 * - WCAG 2.2 AA — acessibilidade;
 * - OWASP — desenvolvimento seguro.
 *
 * Nota: "alinhado com" não significa certificação formal.
 * ============================================================================
 */

import React, {
  Suspense,
  useCallback,
} from "react";

import { AlertCircle, Loader2 } from "lucide-react";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Skeleton } from "@/components/ui/skeleton";
import LiveServicesGrid from "@/components/services/LiveServicesGrid";


/* ============================================================================
 * 1. IMPORTAÇÃO LAZY DO CATÁLOGO
 * ========================================================================== */

/**
 * O catálogo é carregado de forma lazy para:
 *
 * - reduzir o JavaScript inicial;
 * - melhorar o carregamento da página;
 * - separar o shell institucional da camada de catálogo;
 * - permitir evolução independente do componente.
 */
const ServicesCatalog = React.lazy(
  () => import("./ServicesCatalog")
);


/* ============================================================================
 * 2. CONSTANTES DA PÁGINA
 * ========================================================================== */

const SERVICES_PAGE = {
  title:
    "Serviços — Tikvah Psychological Center & Multiservice",

  description:
    "Conheça as áreas de serviços, intervenção, consultoria, formação, estágios, coaching e programas da Tikvah Psychological Center & Multiservice.",

  // ⚠️ DECISÃO PENDENTE: mesmo domínio canónico discutido para o index.html
  // (lovable.app vs vercel.app). Mantido como estava até essa decisão ser
  // tomada — não resolvido unilateralmente aqui.
  canonicalUrl:
    "https://tikvahpsycem.lovable.app/services",
} as const;


/* ============================================================================
 * 3. LOADING STATE
 * ========================================================================== */

/**
 * Estado de carregamento do catálogo.
 *
 * Requisitos de acessibilidade:
 * - role="status";
 * - aria-busy;
 * - aria-live;
 * - conteúdo textual;
 * - indicadores visuais sem dependência exclusiva de cor.
 */
const CatalogSkeleton = () => (
  <section
    aria-labelledby="services-catalog-loading-title"
    aria-busy="true"
    aria-live="polite"
    data-testid="services-catalog-loading"
    className="
      max-w-7xl
      mx-auto
      px-4
      sm:px-6
      lg:px-8
      py-12
    "
  >
    <div
      className="
        flex
        items-center
        justify-center
        gap-2
        text-slate-700
        mb-8
      "
    >
      <Loader2
        className="w-5 h-5 animate-spin"
        aria-hidden="true"
      />

      <span
        id="services-catalog-loading-title"
        className="text-sm font-semibold"
      >
        A carregar os serviços…
      </span>
    </div>

    <Skeleton
      aria-hidden="true"
      className="
        h-10
        w-full
        max-w-2xl
        mx-auto
        mb-4
        bg-slate-200
      "
    />

    <Skeleton
      aria-hidden="true"
      className="
        h-5
        w-full
        max-w-3xl
        mx-auto
        mb-10
        bg-slate-200
      "
    />

    <div
      aria-hidden="true"
      className="
        grid
        md:grid-cols-2
        lg:grid-cols-3
        gap-6
      "
    >
      {Array.from(
        { length: 6 },
        (_, index) => (
          <Skeleton
            key={`service-catalog-skeleton-${index}`}
            className="
              h-48
              rounded-xl
              bg-slate-200
            "
          />
        )
      )}
    </div>
  </section>
);


/* ============================================================================
 * 4. ERROR STATE
 * ========================================================================== */

/**
 * Estado de erro apresentado quando o catálogo não consegue ser carregado.
 *
 * O componente não expõe detalhes técnicos internos ao utilizador.
 * Os detalhes técnicos devem ser tratados pelo sistema de logging/
 * observabilidade da aplicação.
 */
const CatalogErrorFallback = () => {
  /**
   * Recarregamento controlado da página.
   *
   * Mantém o comportamento simples e previsível para o utilizador.
   */
  const handleReload = useCallback(() => {
    window.location.reload();
  }, []);

  return (
    <section
      role="alert"
      aria-labelledby="services-catalog-error-title"
      data-testid="services-catalog-error"
      className="
        max-w-3xl
        mx-auto
        my-16
        px-4
        sm:px-6
      "
    >
      <div
        className="
          p-8
          border
          border-red-300
          bg-red-50
          rounded-2xl
          text-center
          shadow-sm
        "
      >
        <AlertCircle
          className="
            w-10
            h-10
            mx-auto
            text-red-600
            mb-4
          "
          aria-hidden="true"
        />

        <h2
          id="services-catalog-error-title"
          className="
            text-xl
            font-bold
            text-red-900
            mb-3
          "
        >
          Não foi possível carregar os serviços
        </h2>

        <p
          className="
            text-sm
            leading-6
            font-medium
            text-red-800
            mb-6
          "
        >
          O catálogo de serviços não pôde ser apresentado neste momento.
          Tente novamente ou contacte a Tikvah através dos canais
          institucionais disponíveis.
        </p>

        <button
          type="button"
          onClick={handleReload}
          aria-label="Recarregar a página de serviços"
          className="
            inline-flex
            items-center
            justify-center
            px-5
            py-2.5
            rounded-lg
            bg-red-700
            text-white
            text-sm
            font-semibold
            hover:bg-red-800
            focus:outline-none
            focus-visible:ring-2
            focus-visible:ring-red-600
            focus-visible:ring-offset-2
            transition-colors
          "
        >
          Tentar novamente
        </button>
      </div>
    </section>
  );
};


/* ============================================================================
 * 5. ERROR BOUNDARY
 * ========================================================================== */

/**
 * Wrapper do catálogo.
 *
 * Mantemos o ErrorBoundary na fronteira da funcionalidade que pode falhar,
 * evitando que uma falha do catálogo derrube todo o shell institucional
 * da página.
 */
const ServicesCatalogBoundary = () => (
  <ErrorBoundary
    fallback={<CatalogErrorFallback />}
  >
    <Suspense fallback={<CatalogSkeleton />}>
      <ServicesCatalog />
    </Suspense>
  </ErrorBoundary>
);


/* ============================================================================
 * 6. PÁGINA PRINCIPAL
 * ========================================================================== */

/**
 * Página principal de serviços da Tikvah Psycem.
 *
 * @returns React.JSX.Element
 */
const ServicesPage = () => {
  return (
    <div
      className="
        min-h-screen
        bg-slate-50
        text-slate-900
      "
    >
      {/* ======================================================================
       * SEO
       * ==================================================================== */}

      <SEOHead
        title={SERVICES_PAGE.title}
        description={SERVICES_PAGE.description}
        canonicalUrl={
          SERVICES_PAGE.canonicalUrl
        }
      />

      {/* ======================================================================
       * HEADER
       * ==================================================================== */}

      <Navbar />

      {/* ======================================================================
       * CONTEÚDO PRINCIPAL
       * ==================================================================== */}

      <main
        id="main-content"
        data-testid="services-page-main"
      >
        {/* ====================================================================
         * DISCOVERY LAYER
         * ================================================================== */}
        <section
          aria-labelledby="services-discovery-title"
          data-testid="services-discovery"
        >
          <LiveServicesGrid />
        </section>

        {/* ====================================================================
         * COMMERCIAL CATALOGUE LAYER
         * ================================================================== */}
        <section
          aria-labelledby="services-catalog-title"
          data-testid="services-catalog"
        >
          <ServicesCatalogBoundary />
        </section>
      </main>

      {/* ======================================================================
       * FOOTER
       * ==================================================================== */}

      <Footer />
    </div>
  );
};


/* ============================================================================
 * 7. EXPORTAÇÃO
 * ============================================================================
 *
 * A página é exportada como default para integração com o sistema de
 * routing da aplicação.
 *
 * A camada de apresentação não é responsável por:
 * - preços;
 * - IVA;
 * - regras comerciais;
 * - cálculo de valores;
 * - criação de serviços;
 * - inferência de ligações comerciais.
 *
 * Essas responsabilidades permanecem nos módulos especializados do
 * Ecossistema de Serviços (ver NOTA DE CORREÇÃO no topo).
 * ========================================================================== */

/**
 * Página institucional principal de serviços da Tikvah Psycem.
 *
 * @public
 */
export default ServicesPage;