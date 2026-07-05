/**
 * ServiceHero — Cabeçalho padronizado para páginas de serviço.
 * Renderiza H1 com palavra em destaque + subtítulo. Puramente apresentacional.
 */
import type { ServiceConfig } from "@/config/services";

interface Props {
  hero: ServiceConfig["hero"];
}

export const ServiceHero: React.FC<Props> = ({ hero }) => (
  <header className="text-center mb-12 animate-fade-in">
    <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
      {hero.titlePrefix}
      <span className="text-teal-600">{hero.highlight}</span>
      {hero.titleSuffix}
    </h1>
    <p className="text-xl text-slate-600 max-w-3xl mx-auto">{hero.subtitle}</p>
  </header>
);
