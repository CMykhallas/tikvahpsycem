import { useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Calendar, Mail, AlertTriangle } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import {
  findCategory,
  findItem,
  itemHref,
  categoryHref,
} from "@/lib/ecosystem-slug";
import {
  getService,
  getBreadcrumbList,
  getWebPage,
  SITE_ORIGIN,
} from "@/lib/seo/jsonld";

const Container = ({ children }: { children: React.ReactNode }) => (
  <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
    {children}
  </div>
);

/** Accessible 404/500 fallback shell — keeps Navbar/Footer + role=alert message. */
const EcosystemFallback = ({
  title,
  description,
  status = 404,
}: {
  title: string;
  description: string;
  status?: 404 | 500;
}) => (
  <>
    <SEOHead
      title={`${title} — Tikvah`}
      description={description}
      ogType="website"
    />
    <Navbar />
    <main id="main-content" tabIndex={-1}>
      <Container>
        <div
          role="alert"
          aria-live="polite"
          className="rounded-2xl border border-amber-300 bg-amber-50 p-8 md:p-10 text-center"
        >
          <AlertTriangle
            className="w-10 h-10 text-amber-600 mx-auto mb-4"
            aria-hidden="true"
          />
          <p className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-2">
            Erro {status}
          </p>
          <h1
            tabIndex={-1}
            className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 focus:outline-none"
          >
            {title}
          </h1>
          <p className="text-slate-700 max-w-xl mx-auto mb-6">{description}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild variant="default">
              <Link to="/services" aria-label="Voltar ao catálogo de serviços">
                Ver todos os serviços
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/" aria-label="Voltar à página inicial">
                Página inicial
              </Link>
            </Button>
          </div>
        </div>
      </Container>
    </main>
    <Footer />
  </>
);

const NotFoundFallback = () => (
  <EcosystemFallback
    status={404}
    title="Serviço não encontrado"
    description="O serviço ou área que procura não está disponível ou foi movido. Use as opções abaixo para continuar a navegar."
  />
);

const ErrorFallback = () => (
  <EcosystemFallback
    status={500}
    title="Não foi possível carregar este serviço"
    description="Ocorreu um erro inesperado ao renderizar esta página. A equipa técnica foi notificada — por favor tente novamente."
  />
);


const Breadcrumbs = ({
  trail,
}: {
  trail: { label: string; href?: string }[];
}) => (
  <nav aria-label="Trilho de navegação" className="mb-6 text-sm text-slate-600">
    <ol className="flex flex-wrap items-center gap-2">
      {trail.map((t, i) => {
        const isLast = i === trail.length - 1;
        return (
          <li key={i} className="flex items-center gap-2">
            {t.href && !isLast ? (
              <Link
                to={t.href}
                className="rounded hover:text-primary underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                {t.label}
              </Link>
            ) : (
              <span
                aria-current={isLast ? "page" : undefined}
                className="text-slate-900 font-medium"
              >
                {t.label}
              </span>
            )}
            {!isLast && (
              <span aria-hidden="true" className="text-slate-400">
                /
              </span>
            )}
          </li>
        );
      })}
    </ol>
  </nav>
);

const CtaBlock = () => (
  <aside
    aria-labelledby="cta-title"
    className="mt-12 rounded-2xl bg-gradient-to-br from-teal-600 to-blue-700 text-white p-8 md:p-10"
  >
    <h2 id="cta-title" className="text-2xl font-bold mb-3">
      Quer avançar com este serviço?
    </h2>
    <p className="text-white/90 mb-6 leading-relaxed">
      Marque uma consulta inicial ou solicite uma proposta formal adaptada ao
      seu contexto institucional, familiar ou individual.
    </p>
    <div className="flex flex-col sm:flex-row gap-3">
      <Button asChild size="lg" variant="secondary" className="gap-2">
        <Link to="/appointment" aria-label="Agendar consulta inicial">
          <Calendar className="w-4 h-4" aria-hidden="true" /> Agendar consulta
        </Link>
      </Button>
      <Button
        asChild
        size="lg"
        variant="outline"
        className="gap-2 bg-transparent border-white text-white hover:bg-white/10 hover:text-white"
      >
        <Link to="/contact" aria-label="Pedir proposta formal por e-mail">
          <Mail className="w-4 h-4" aria-hidden="true" /> Pedir proposta
        </Link>
      </Button>
    </div>
  </aside>
);

/** Move focus to the page heading on mount for SR/keyboard users navigating SPAs. */
const useFocusHeading = () => {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    ref.current?.focus({ preventScroll: true });
  }, []);
  return ref;
};

const ItemDetailView = ({
  categoryId,
  itemSlug,
}: {
  categoryId: string;
  itemSlug: string;
}) => {
  const found = findItem(categoryId, itemSlug);
  const headingRef = useFocusHeading();

  if (!found) return <NotFoundFallback />;
  const { category, item } = found;
  const path = itemHref(category.id, item);

  const structuredData = [
    getService({
      name: item.title,
      description: item.description,
      path,
      serviceType: category.short,
    }),
    getBreadcrumbList([
      { name: "Início", path: "/" },
      { name: "Serviços", path: "/services" },
      { name: category.short, path: categoryHref(category.id) },
      { name: item.title, path },
    ]),
  ];

  return (
    <>
      <SEOHead
        title={`${item.title} — ${category.short} | Tikvah`}
        description={item.description.slice(0, 155)}
        canonicalUrl={`${SITE_ORIGIN}${path}`}
        ogType="article"
        structuredData={structuredData}
      />
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <Container>
          <Breadcrumbs
            trail={[
              { label: "Serviços", href: "/services" },
              { label: category.short, href: categoryHref(category.id) },
              { label: item.title },
            ]}
          />

          <Link
            to={categoryHref(category.id)}
            className="inline-flex items-center gap-2 text-sm text-primary hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded mb-4"
            aria-label={`Voltar à área ${category.short}`}
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Voltar a{" "}
            {category.short}
          </Link>

          <header
            className={`rounded-2xl bg-gradient-to-br ${category.gradient} text-white p-8 md:p-10 mb-8`}
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-white/80 mb-2">
              {category.title}
            </p>
            <h1
              ref={headingRef}
              tabIndex={-1}
              className="text-3xl md:text-4xl font-bold leading-tight focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 rounded"
            >
              {item.title}
            </h1>
          </header>

          <article className="prose prose-slate max-w-none">
            <h2 className="text-xl font-bold text-slate-800">
              Descrição do serviço
            </h2>
            <p className="text-base text-slate-700 leading-relaxed">
              {item.description}
            </p>

            <h2 className="text-xl font-bold text-slate-800 mt-8">
              O que está incluído
            </h2>
            <ul className="space-y-2 not-prose" aria-label="Componentes incluídos no serviço">
              {[
                "Diagnóstico inicial e formulação de objetivos",
                "Plano de intervenção estruturado e personalizado",
                "Acompanhamento contínuo por equipa qualificada",
                "Relatórios técnicos e avaliação de impacto",
                "Confidencialidade e conformidade com a proteção de dados",
              ].map((line) => (
                <li key={line} className="flex gap-3 items-start">
                  <CheckCircle2
                    className={`w-5 h-5 ${category.accent} flex-shrink-0 mt-0.5`}
                    aria-hidden="true"
                  />
                  <span className="text-slate-700">{line}</span>
                </li>
              ))}
            </ul>

            {category.items.filter((i) => i.title !== item.title).length > 0 && (
              <>
                <h2 className="text-xl font-bold text-slate-800 mt-8">
                  Outros serviços nesta área
                </h2>
                <ul
                  className="grid sm:grid-cols-2 gap-3 not-prose"
                  aria-label={`Outros serviços em ${category.short}`}
                >
                  {category.items
                    .filter((i) => i.title !== item.title)
                    .map((sibling) => (
                      <li key={sibling.title}>
                        <Link
                          to={itemHref(category.id, sibling)}
                          aria-label={`Abrir detalhes do serviço ${sibling.title}`}
                          className="block p-4 rounded-xl border border-border bg-card hover:shadow-md hover:border-primary/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition"
                        >
                          <p className="font-semibold text-slate-900 text-sm">
                            {sibling.title}
                          </p>
                        </Link>
                      </li>
                    ))}
                </ul>
              </>
            )}
          </article>

          <CtaBlock />
        </Container>
      </main>
      <Footer />
    </>
  );
};

const CategoryDetailView = ({ categoryId }: { categoryId: string }) => {
  const category = findCategory(categoryId);
  const headingRef = useFocusHeading();
  if (!category) return <NotFoundFallback />;

  const path = categoryHref(category.id);
  const structuredData = [
    getWebPage({
      name: `${category.title} — Ecossistema Tikvah`,
      description: category.summary,
      path,
    }),
    getBreadcrumbList([
      { name: "Início", path: "/" },
      { name: "Serviços", path: "/services" },
      { name: category.short, path },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: category.title,
      itemListElement: category.items.map((it, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: it.title,
        url: `${SITE_ORIGIN}${itemHref(category.id, it)}`,
      })),
    },
  ];

  return (
    <>
      <SEOHead
        title={`${category.title} — Ecossistema Tikvah`}
        description={category.summary.slice(0, 155)}
        canonicalUrl={`${SITE_ORIGIN}${path}`}
        structuredData={structuredData}
      />
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <Container>
          <Breadcrumbs
            trail={[
              { label: "Serviços", href: "/services" },
              { label: category.short },
            ]}
          />

          <header
            className={`rounded-2xl bg-gradient-to-br ${category.gradient} text-white p-8 md:p-10 mb-8`}
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-white/80 mb-2">
              Ecossistema Tikvah
            </p>
            <h1
              ref={headingRef}
              tabIndex={-1}
              className="text-3xl md:text-4xl font-bold leading-tight focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 rounded"
            >
              {category.title}
            </h1>
            <p className="text-white/90 mt-4 leading-relaxed">
              {category.summary}
            </p>
          </header>

          <h2 className="text-xl font-bold text-slate-800 mb-4">
            Serviços nesta área
          </h2>
          <ul
            className="grid md:grid-cols-2 gap-4"
            aria-label={`Lista de serviços em ${category.short}`}
          >
            {category.items.map((item) => (
              <li key={item.title}>
                <Link
                  to={itemHref(category.id, item)}
                  aria-label={`Abrir detalhes do serviço ${item.title}`}
                  className="block h-full p-5 rounded-xl border border-border bg-card hover:shadow-lg hover:border-primary/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition"
                >
                  <h3 className="font-semibold text-slate-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                  <span
                    className="inline-block mt-3 text-xs font-semibold text-primary"
                    aria-hidden="true"
                  >
                    Ver detalhes →
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <CtaBlock />
        </Container>
      </main>
      <Footer />
    </>
  );
};

export const EcosystemItemPage = () => {
  const { categoryId, itemSlug } = useParams();
  if (!categoryId || !itemSlug) return <NotFoundFallback />;
  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <ItemDetailView
        key={`${categoryId}/${itemSlug}`}
        categoryId={categoryId}
        itemSlug={itemSlug}
      />
    </ErrorBoundary>
  );
};

export const EcosystemCategoryPage = () => {
  const { categoryId } = useParams();
  if (!categoryId) return <NotFoundFallback />;
  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <CategoryDetailView key={categoryId} categoryId={categoryId} />
    </ErrorBoundary>
  );
};

export default EcosystemItemPage;
