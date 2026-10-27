import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { PRELOAD_RELOAD_KEY } from "./utils/preloadRecovery";
import "./index.css";

let preloadReloaded = false;
try {
  preloadReloaded = Boolean(sessionStorage.getItem(PRELOAD_RELOAD_KEY));
} catch {
  preloadReloaded = true;
}

window.addEventListener("vite:preloadError", (event) => {
  if (preloadReloaded) return;
  try {
    sessionStorage.setItem(PRELOAD_RELOAD_KEY, "1");
  } catch {
    return;
  }
  preloadReloaded = true;
  event.preventDefault();
  window.location.reload();
});

// Tratamento de erro global para capturar falhas críticas não tratadas no ciclo de vida da UI
window.addEventListener("error", (event) => {
  console.error("Erro crítico capturado globalmente:", event.error);
});

window.addEventListener("unhandledrejection", (event) => {
  console.error("Promise rejeitada não tratada:", event.reason);
});

// Mecanismo de Engenharia contra Frontend-Backend Mismatch (Recomendação Vercel para PWA/Service Workers)
if (typeof window !== "undefined" && "serviceWorker" in navigator) {
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    window.location.reload();
  });
}

// Montagem segura da aplicação React 18 com verificação de tipo do elemento root
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Elemento raiz '#root' não foi encontrado no DOM. Verifique o seu index.html.");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ErrorBoundary fallback={
      <div role="alert" className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center">
        <h1 className="text-2xl font-bold">Não foi possível apresentar esta página</h1>
        <p>Ocorreu um erro inesperado. Por favor, recarregue a página para tentar novamente.</p>
        <button className="underline" onClick={() => window.location.reload()}>
          Recarregar página
        </button>
      </div>
    }>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);