/**
 * ServiceSkeleton — Placeholder shimmer para páginas de serviço
 * enquanto dados assíncronos carregam. Acessível via aria-busy.
 */
export const ServiceSkeleton: React.FC = () => (
  <div
    role="status"
    aria-busy="true"
    aria-live="polite"
    aria-label="A carregar conteúdo do serviço"
    className="animate-pulse max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
  >
    <div className="h-10 w-2/3 bg-slate-200 rounded mx-auto mb-4" />
    <div className="h-5 w-1/2 bg-slate-200 rounded mx-auto mb-12" />
    <div className="grid md:grid-cols-2 gap-8 mb-12">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="rounded-xl border border-slate-200 p-8 bg-white">
          <div className="w-16 h-16 bg-slate-200 rounded-lg mb-6" />
          <div className="h-6 w-3/4 bg-slate-200 rounded mb-3" />
          <div className="h-4 w-full bg-slate-200 rounded mb-2" />
          <div className="h-4 w-5/6 bg-slate-200 rounded mb-6" />
          <div className="h-10 w-full bg-slate-200 rounded" />
        </div>
      ))}
    </div>
    <span className="sr-only">A carregar…</span>
  </div>
);

/** Empty state elegante para quando não há dados. */
export const ServiceEmptyState: React.FC<{ message?: string }> = ({
  message = "Sem informação disponível de momento.",
}) => (
  <div
    role="status"
    className="max-w-xl mx-auto text-center py-16 px-4"
  >
    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center text-3xl">
      📭
    </div>
    <p className="text-slate-600">{message}</p>
  </div>
);
