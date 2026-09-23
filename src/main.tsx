import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

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
    <App />
  </React.StrictMode>
);