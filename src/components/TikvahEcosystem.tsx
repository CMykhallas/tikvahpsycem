import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Brain,
  GraduationCap,
  Briefcase,
  Scale,
  Cpu,
  HandHeart,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import {
  TIKVAH_CATEGORIES,
  TIKVAH_INTRO,
  TIKVAH_360_STATEMENT,
  type TikvahServiceCategory,
} from "@/data/tikvah-services";
import { itemHref, categoryHref } from "@/lib/ecosystem-slug";

const ICONS = {
  brain: Brain,
  graduation: GraduationCap,
  briefcase: Briefcase,
  scale: Scale,
  cpu: Cpu,
  handHeart: HandHeart,
} as const;

interface Props {
  /** When true, renders a homepage-friendly compact version with intro + cards only. */
  compact?: boolean;
}

const CategoryCard = ({
  category,
  index,
  compact,
}: {
  category: TikvahServiceCategory;
  index: number;
  compact?: boolean;
}) => {
  const Icon = ICONS[category.icon];
  const itemsToShow = compact ? category.items.slice(0, 4) : category.items;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
      id={`ecosistema-${category.id}`}
      className="scroll-mt-32 h-full"
    >
      <div className="h-full flex flex-col rounded-2xl bg-card border border-border shadow-sm hover:shadow-xl transition-shadow overflow-hidden">
        <Link
          to={categoryHref(category.id)}
          aria-label={`Explorar área: ${category.title}`}
          className={`bg-gradient-to-br ${category.gradient} text-white p-6 block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white`}
        >
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center flex-shrink-0">
              <Icon className="w-6 h-6" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/80">
                Ecossistema Tikvah
              </p>
              <h3 className="text-lg md:text-xl font-bold leading-tight mt-1">
                {category.title}
              </h3>
            </div>
          </div>
          <p className="text-sm text-white/90 mt-4 leading-relaxed">
            {category.summary}
          </p>
          <span className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-white/90 hover:text-white">
            Ver todos os serviços <ArrowRight className="w-3 h-3" aria-hidden="true" />
          </span>
        </Link>

        <div className="p-6 flex-1 flex flex-col">
          <ul className="space-y-3 flex-1">
            {itemsToShow.map((item) => (
              <li key={item.title}>
                <Link
                  to={itemHref(category.id, item)}
                  aria-label={`Ver detalhes: ${item.title}`}
                  className="group/item flex gap-3 -mx-2 px-2 py-2 rounded-lg hover:bg-muted/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors"
                >
                  <CheckCircle2
                    className={`w-5 h-5 ${category.accent} flex-shrink-0 mt-0.5`}
                    aria-hidden="true"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-foreground text-sm group-hover/item:text-primary transition-colors">
                      {item.title}
                    </p>
                    {!compact && (
                      <p className="text-sm text-muted-foreground leading-relaxed mt-1">
                        {item.description}
                      </p>
                    )}
                  </div>
                  <ArrowRight
                    className="w-4 h-4 text-muted-foreground opacity-0 group-hover/item:opacity-100 transition-opacity flex-shrink-0 mt-1"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ul>

          {compact && category.items.length > itemsToShow.length && (
            <Link
              to={categoryHref(category.id)}
              className="text-xs font-semibold text-primary mt-4 pt-4 border-t border-border hover:underline"
            >
              + {category.items.length - itemsToShow.length} serviços nesta área →
            </Link>
          )}
        </div>
      </div>
    </motion.article>
  );
};

export const TikvahEcosystem = ({ compact = false }: Props) => {
  return (
    <section
      aria-labelledby="ecosistema-title"
      className="py-16 md:py-20 bg-gradient-to-br from-slate-50 via-white to-blue-50/40"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center max-w-3xl mx-auto mb-12">
          <p className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
            Modelo de Intervenção 360°
          </p>
          <h2
            id="ecosistema-title"
            className="text-3xl md:text-4xl font-bold text-slate-800 mb-4"
          >
            Ecossistema integrado de serviços Tikvah
          </h2>
          <p className="text-base md:text-lg text-slate-600 leading-relaxed">
            {TIKVAH_INTRO}
          </p>
        </header>

        <div
          className={`grid gap-6 ${
            compact
              ? "md:grid-cols-2 lg:grid-cols-3"
              : "md:grid-cols-2 xl:grid-cols-3"
          }`}
        >
          {TIKVAH_CATEGORIES.map((cat, i) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              index={i}
              compact={compact}
            />
          ))}
        </div>

        {!compact && (
          <motion.aside
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-white p-8 md:p-10"
          >
            <h3 className="text-xl md:text-2xl font-bold mb-3">
              Integração de serviços: um modelo de intervenção 360°
            </h3>
            <p className="text-white/90 leading-relaxed text-sm md:text-base">
              {TIKVAH_360_STATEMENT}
            </p>
          </motion.aside>
        )}
      </div>
    </section>
  );
};
