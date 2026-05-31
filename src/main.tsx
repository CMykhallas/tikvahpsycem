import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Mecanismo de Engenharia contra Frontend-Backend Mismatch (Recomendação Vercel)
if (typeof window !== "undefined" && "serviceWorker" in navigator) {
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    window.location.reload();
  });
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
