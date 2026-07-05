/**
 * FeatureGrid — Grade genérica de cards de features/serviços.
 * Recebe features tipadas e delega a renderização de ícones (Lucide).
 * Suporta badge de nível, meta (duração/participantes) e bullets.
 */
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import type { ServiceFeature } from "@/config/services";

const toneMap: Record<NonNullable<NonNullable<ServiceFeature["badge"]>["tone"]>, string> = {
  green: "bg-green-100 text-green-800",
  yellow: "bg-yellow-100 text-yellow-800",
  red: "bg-red-100 text-red-800",
  blue: "bg-blue-100 text-blue-800",
};

interface Props {
  features: ServiceFeature[];
  /** Rota do CTA por cartão. Default: /appointment */
  ctaHref?: string;
  ctaLabel?: string;
  /** Prefixo para data-track-click. Ex.: "psicoterapia" */
  trackPrefix?: string;
}

export const FeatureGrid: React.FC<Props> = ({
  features,
  ctaHref = "/appointment",
  ctaLabel = "Saber mais",
  trackPrefix = "service",
}) => (
  <div className="grid md:grid-cols-2 gap-8 mb-12">
    {features.map((f, i) => {
      const Icon = f.icon;
      return (
        <Card
          key={i}
          className="hover:shadow-xl transition-all duration-300 group focus-within:ring-2 focus-within:ring-teal-500"
        >
          <CardContent className="p-8">
            <div
              className="w-16 h-16 bg-gradient-to-r from-teal-600 to-blue-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
              aria-hidden="true"
            >
              <Icon className="w-8 h-8 text-white" />
            </div>

            <div className="flex items-start justify-between gap-3 mb-3">
              <h3 className="text-2xl font-bold text-slate-800">{f.title}</h3>
              {f.badge && (
                <Badge className={toneMap[f.badge.tone ?? "blue"]}>
                  {f.badge.label}
                </Badge>
              )}
            </div>

            <p className="text-slate-600 mb-4 leading-relaxed">{f.description}</p>

            {f.meta && (
              <p className="text-sm text-slate-500 mb-4">
                <span className="font-medium text-slate-700">{f.meta}</span>
              </p>
            )}

            {f.bullets && f.bullets.length > 0 && (
              <ul className="text-sm text-slate-600 mb-6 space-y-1 list-disc list-inside">
                {f.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            )}

            <Link to={ctaHref}>
              <Button
                data-track-click={`${trackPrefix}-feature-${i}`}
                className="w-full bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
              >
                {ctaLabel}
              </Button>
            </Link>
          </CardContent>
        </Card>
      );
    })}
  </div>
);
