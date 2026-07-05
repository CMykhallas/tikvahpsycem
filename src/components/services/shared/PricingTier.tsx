/**
 * PricingTier — Cartões de faixa/pacote. Formata preço em MZN (locale pt-MZ).
 */
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import type { PricingTierData } from "@/config/services";

interface Props {
  tiers: PricingTierData[];
  trackPrefix?: string;
}

const priceFmt = new Intl.NumberFormat("pt-MZ", {
  style: "currency",
  currency: "MZN",
  maximumFractionDigits: 0,
});

/** Formata o preço; usa "Sob consulta" quando `priceMZN` é null. */
export const formatServicePrice = (
  priceMZN: number | null,
  unit?: string,
): string => {
  if (priceMZN === null) return "Sob consulta";
  return `${priceFmt.format(priceMZN)}${unit ? ` ${unit}` : ""}`;
};

export const PricingTier: React.FC<Props> = ({ tiers, trackPrefix = "service" }) => (
  <section aria-labelledby="pricing-heading" className="mb-16">
    <h2 id="pricing-heading" className="text-3xl font-bold text-center text-slate-800 mb-2">
      Investimento
    </h2>
    <p className="text-center text-slate-600 mb-8 max-w-2xl mx-auto">
      Escolha a modalidade mais adequada. Valores em MZN, com IVA incluído.
    </p>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tiers.map((t) => (
        <Card
          key={t.id}
          className={
            "relative flex flex-col transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 " +
            (t.highlighted
              ? "border-2 border-amber-400 shadow-lg scale-[1.02]"
              : "border border-slate-200")
          }
        >
          {t.highlighted && (
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-900 text-xs font-semibold px-3 py-1 rounded-full">
              Mais escolhido
            </span>
          )}
          <CardContent className="p-6 flex-1 flex flex-col">
            <h3 className="text-xl font-bold text-slate-800">{t.name}</h3>
            <p className="text-sm text-slate-500 mt-1 mb-4">{t.description}</p>
            <div className="mb-6">
              <p className="text-3xl font-bold text-slate-900">
                {t.priceMZN === null ? "Sob consulta" : priceFmt.format(t.priceMZN)}
              </p>
              {t.priceMZN !== null && t.unit && (
                <p className="text-sm text-slate-500">{t.unit}</p>
              )}
            </div>
            <ul className="space-y-2 mb-6 flex-1">
              {t.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-slate-700">
                  <Check className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" aria-hidden="true" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Link to={t.ctaHref ?? "/appointment"} className="mt-auto">
              <Button
                data-track-click={`${trackPrefix}-tier-${t.id}`}
                className="w-full bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700"
              >
                {t.ctaLabel ?? "Escolher"}
              </Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  </section>
);
