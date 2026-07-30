import { useServicesCatalog, type CatalogService } from "@/hooks/useServicesCatalog";
import { AlertCircle, Loader2, Database } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const formatPrice = (value: number | null, currency: string | null) => {
  if (typeof value !== "number") return "—";
  try {
    return value.toLocaleString("pt-MZ", {
      style: "currency",
      currency: currency || "MZN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  } catch {
    return `${value} ${currency || "MZN"}`;
  }
};

/**
 * Live, backend-driven catalog read from the Supabase `services` table via RLS
 * (anon SELECT allowed where `active = true`).
 *
 * Renders skeletons while loading and an accessible alert on failure so the
 * static ecosystem catalog below is never blocked by a backend outage.
 */
export const LiveServicesGrid = () => {
  const { data, isLoading, isError, error, refetch } = useServicesCatalog();

  if (isLoading) {
    return (
      <section
        aria-busy="true"
        aria-live="polite"
        data-testid="live-services-loading"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
      >
        <div className="flex items-center gap-2 text-slate-700 mb-6">
          <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
          <span className="text-sm font-semibold">A carregar catálogo ao vivo do backend…</span>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl bg-slate-200" />
          ))}
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section
        role="alert"
        data-testid="live-services-error"
        className="max-w-3xl mx-auto my-10 p-6 border border-amber-300 bg-amber-50 rounded-2xl shadow-sm"
      >
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-700 mt-0.5" aria-hidden="true" />
          <div className="flex-1">
            <h3 className="text-sm font-bold text-amber-950">
              Catálogo ao vivo indisponível
            </h3>
            <p className="text-xs font-medium text-amber-900 mt-1">
              {(error as Error)?.message ||
                "Não foi possível ligar ao backend. O catálogo de referência abaixo permanece disponível."}
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-3 px-3.5 py-2 text-xs font-bold rounded-md bg-amber-700 text-white hover:bg-amber-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-800 transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </section>
    );
  }

  const services = data ?? [];

  if (!services.length) {
    return null;
  }

  return (
    <section
      aria-labelledby="live-services-heading"
      data-testid="live-services-grid"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12"
    >
      <div className="flex items-center gap-2 mb-6">
        <Database className="w-4 h-4 text-teal-700" aria-hidden="true" />
        <h2
          id="live-services-heading"
          className="text-sm font-bold uppercase tracking-wider text-teal-800"
        >
          Catálogo ao vivo ({services.length})
        </h2>
      </div>
      <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-4" role="list">
        {services.map((svc: CatalogService) => (
          <li
            key={svc.id}
            className="bg-white border border-slate-300 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="font-bold text-slate-900 text-base">{svc.title}</h3>
            {svc.area_name && (
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-700 mt-1">
                {svc.area_name}
              </p>
            )}
            {svc.short_description && (
              <p className="text-sm font-normal text-slate-700 mt-2 line-clamp-3">
                {svc.short_description}
              </p>
            )}
            <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-700">
                {svc.duration_label || "—"}
              </span>
              <span className="font-bold text-slate-900 text-sm">
                {formatPrice(svc.price_from, svc.currency)}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default LiveServicesGrid;
