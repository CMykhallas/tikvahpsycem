import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Calendar, Mail } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import {
  findCategory,
  findItem,
  itemHref,
  categoryHref,
} from "@/lib/ecosystem-slug";
import NotFound from "./NotFound";

const Container = ({ children }: { children: React.ReactNode }) => (
  <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">{children}</div>
);

const Breadcrumbs = ({ trail }: { trail: { label: string; href?: string }[] }) => (
  <nav aria-label="Trilho de navegação" className="mb-6 text-sm text-slate-600">
    <ol className="flex flex-wrap items-center gap-2">
      {trail.map((t, i) => (
        <li key={i} className="flex items-center gap-2">
          {t.href ? (
            <Link to={t.href} className="hover:text-primary underline-offset-2 hover:underline">
              {t.label}
            </Link>
          ) : (
            <span className="text-slate-900 font-medium">{t.label}</span>
          )}
          {i < trail.length - 1 && <span aria-hidden="true">/</span>}
        </li>
      ))}
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
      Marque uma consulta inicial ou solicite uma proposta formal adaptada ao seu
      contexto institucional, familiar ou individual.
    </p>
    <div className="flex flex-col sm:flex-row gap-3">
      <Link to="/appointment">
        <Button size="lg" variant="secondary" className="gap-2">
          <Calendar className="w-4 h-4" aria-hidden="true" /> Agendar consulta
        </Button>
      </Link>
      <Link to="/contact">
        <Button
          size="lg"
          variant="outline"
          className="gap-2 bg-transparent border-white text-white hover:bg-white/10 hover:text-white"
        >
          <Mail className="w-4 h-4" aria-hidden="true" /> Pedir proposta
        </Button>
      </Link>
    </div>
  </aside>
);

const ItemDetailView = ({ categoryId, itemSlug }: { categoryId: string; itemSlug: string }) => {
  const found = findItem(categoryId, itemSlug);
  if (!found) return <NotFound />;
  const { category, item } = found;

  return (
    <>
      <SEOHead
        title={`${item.title} — Tikvah`}
        description={item.description.slice(0, 155)}
        canonicalUrl={`https://tikvahpsycem.lovable.app${itemHref(category.id, item)}`}
      />
      <Navbar />
      <main>
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
            className="inline-flex items-center gap-2 text-sm text-primary hover:underline mb-4"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Voltar a {category.short}
          </Link>

          <header className={`rounded-2xl bg-gradient-to-br ${category.gradient} text-white p-8 md:p-10 mb-8`}>
            <p className="text-xs font-semibold uppercase tracking-wider text-white/80 mb-2">
              {category.title}
            </p>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">{item.title}</h1>
          </header>

          <article className="prose prose-slate max-w-none">
            <h2 className="text-xl font-bold text-slate-800">Descrição do serviço</h2>
            <p className="text-base text-slate-700 leading-relaxed">{item.description}</p>

            <h2 className="text-xl font-bold text-slate-800 mt-8">O que está incluído</h2>
            <ul className="space-y-2 not-prose">
              {[
                "Diagnóstico inicial e formulação de objetivos",
                "Plano de intervenção estruturado e personalizado",
                "Acompanhamento contínuo por equipa qualificada",
                "Relatórios técnicos e avaliação de impacto",
                "Confidencialidade e conformidade com a proteção de dados",
              ].map((line) => (
                <li key={line} className="flex gap-3 items-start">
                  <CheckCircle2 className={`w-5 h-5 ${category.accent} flex-shrink-0 mt-0.5`} aria-hidden="true" />
                  <span className="text-slate-700">{line}</span>
                </li>
              ))}
            </ul>

            <h2 className="text-xl font-bold text-slate-800 mt-8">Outros serviços nesta área</h2>
            <ul className="grid sm:grid-cols-2 gap-3 not-prose">
              {category.items
                .filter((i) => i.title !== item.title)
                .map((sibling) => (
                  <li key={sibling.title}>
                    <Link
                      to={itemHref(category.id, sibling)}
                      className="block p-4 rounded-xl border border-border bg-card hover:shadow-md hover:border-primary/40 transition"
                    >
                      <p className="font-semibold text-slate-900 text-sm">{sibling.title}</p>
                    </Link>
                  </li>
                ))}
            </ul>
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
  if (!category) return <NotFound />;

  return (
    <>
      <SEOHead
        title={`${category.title} — Ecossistema Tikvah`}
        description={category.summary}
        canonicalUrl={`https://tikvahpsycem.lovable.app${categoryHref(category.id)}`}
      />
      <Navbar />
      <main>
        <Container>
          <Breadcrumbs
            trail={[
              { label: "Serviços", href: "/services" },
              { label: category.short },
            ]}
          />

          <header className={`rounded-2xl bg-gradient-to-br ${category.gradient} text-white p-8 md:p-10 mb-8`}>
            <p className="text-xs font-semibold uppercase tracking-wider text-white/80 mb-2">
              Ecossistema Tikvah
            </p>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">{category.title}</h1>
            <p className="text-white/90 mt-4 leading-relaxed">{category.summary}</p>
          </header>

          <h2 className="text-xl font-bold text-slate-800 mb-4">Serviços nesta área</h2>
          <ul className="grid md:grid-cols-2 gap-4">
            {category.items.map((item) => (
              <li key={item.title}>
                <Link
                  to={itemHref(category.id, item)}
                  className="block h-full p-5 rounded-xl border border-border bg-card hover:shadow-lg hover:border-primary/40 transition"
                >
                  <h3 className="font-semibold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                  <span className="inline-block mt-3 text-xs font-semibold text-primary">
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
  if (!categoryId || !itemSlug) return <NotFound />;
  return <ItemDetailView categoryId={categoryId} itemSlug={itemSlug} />;
};

export const EcosystemCategoryPage = () => {
  const { categoryId } = useParams();
  if (!categoryId) return <NotFound />;
  return <CategoryDetailView categoryId={categoryId} />;
};

export default EcosystemItemPage;
