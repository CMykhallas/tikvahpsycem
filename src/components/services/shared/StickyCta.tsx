/**
 * StickyCta — Barra de conversão persistente no rodapé mobile.
 * Aparece após 300px de scroll, dispensável, respeita safe-area em iOS.
 */
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface Props {
  label: string;
  href: string;
  /** Identificador para data-track-click. */
  trackId: string;
  whatsapp?: string;
}

export const StickyCta: React.FC<Props> = ({ label, href, trackId, whatsapp }) => {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (dismissed || !visible) return null;

  return (
    <div
      role="region"
      aria-label="Ação rápida"
      className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-white/95 backdrop-blur border-t border-slate-200 shadow-[0_-4px_20px_-8px_rgba(0,0,0,0.15)] animate-fade-in"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="flex items-center gap-2 p-3">
        {whatsapp && (
          <a
            href={`https://wa.me/${whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            data-track-click={`${trackId}-whatsapp`}
            className="flex-1 text-center px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors"
          >
            WhatsApp
          </a>
        )}
        <a href={href} className="flex-1">
          <Button
            data-track-click={`${trackId}-primary`}
            className="w-full bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700"
          >
            {label}
          </Button>
        </a>
        <button
          type="button"
          aria-label="Dispensar barra de acção"
          onClick={() => setDismissed(true)}
          className="p-2 text-slate-500 hover:text-slate-800 focus-visible:outline-2 focus-visible:outline-teal-500 rounded"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
