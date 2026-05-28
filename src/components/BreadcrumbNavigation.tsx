
import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";
import { getBreadcrumbList } from "@/lib/seo/jsonld";

const breadcrumbNameMap: Record<string, string> = {
  'about': 'Sobre Nós',
  'services': 'Serviços',
  'psicoterapia': 'Psicoterapia',
  'consultoria': 'Consultoria',
  'cursos': 'Cursos',
  'workshops': 'Workshops',
  'contact': 'Contato',
  'blog': 'Blog',
  'team': 'Equipe',
  'values': 'Valores',
  'mission': 'Missão',
  'approach': 'Abordagem',
  'faq': 'Perguntas Frequentes',
  'testimonials': 'Depoimentos',
  'career': 'Carreira',
  'appointment': 'Agendamento',
  'feedback': 'Feedback',
  'location': 'Localização',
  'administration': 'Administração',
  'obrigado': 'Obrigado',
  'politica-de-privacidade': 'Política de Privacidade',
  'propostas': 'Propostas',
  'proximos-passos': 'Próximos Passos',
  'loja': 'Loja',
  'carrinho': 'Carrinho',
  'checkout': 'Checkout',
  'produto': 'Produto',
  'success': 'Sucesso',
};

const humanize = (slug: string) =>
  breadcrumbNameMap[slug] ||
  slug
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ');

export const BreadcrumbNavigation: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Inject BreadcrumbList JSON-LD for SEO on every internal page.
  useEffect(() => {
    document.querySelectorAll('script[data-seo="breadcrumb"]').forEach((el) => el.remove());

    if (pathnames.length === 0) return;

    const items = [
      { name: 'Início', path: '/' },
      ...pathnames.map((_, idx) => {
        const segment = pathnames[idx];
        return {
          name: humanize(segment),
          path: `/${pathnames.slice(0, idx + 1).join('/')}`,
        };
      }),
    ];

    const el = document.createElement('script');
    el.type = 'application/ld+json';
    el.setAttribute('data-seo', 'breadcrumb');
    el.textContent = JSON.stringify(getBreadcrumbList(items));
    document.head.appendChild(el);

    return () => {
      document.querySelectorAll('script[data-seo="breadcrumb"]').forEach((el) => el.remove());
    };
  }, [location.pathname]);

  // Não mostrar breadcrumb na página inicial
  if (pathnames.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Navegação estrutural" className="bg-white border-b border-slate-200 py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/" className="flex items-center hover:text-teal-600 transition-colors">
                  <Home className="w-4 h-4 mr-1" />
                  Início
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            {pathnames.map((pathname, index) => {
              const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
              const isLast = index === pathnames.length - 1;
              const breadcrumbName = humanize(pathname);

              return (
                <React.Fragment key={pathname}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage className="text-teal-600 font-medium">
                        {breadcrumbName}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link to={routeTo} className="hover:text-teal-600 transition-colors">
                          {breadcrumbName}
                        </Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </nav>
  );
};
