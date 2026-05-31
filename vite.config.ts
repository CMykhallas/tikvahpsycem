import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { fileURLToPath, URL } from "node:url";
import { componentTagger } from "lovable-tagger";

// Diretivas de Engenharia sob especificações do Vite 7 e Otimização Vercel
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    strictPort: true
  },
  plugins: [
    react(), // Ativa a transpilação ultra-rápida via Rust (SWC)
    mode === "development" && componentTagger() // Injeta tags visuais apenas em ambiente local
  ].filter(Boolean),
  resolve: {
    alias: {
      // Padrão ESM moderno para resolução de caminhos do Shadcn UI (@/*) no Vite 7
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Reduz Render-blocking requests dividindo pacotes massivos em caminhos assíncronos paralelos
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("@radix-ui") || id.includes("lucide-react")) {
              return "ui-core";
            }
            if (id.includes("@supabase")) {
              return "supabase-vendor";
            }
            if (id.includes("framer-motion")) {
              return "animations";
            }
            return "vendor";
          }
        },
        // Sincronização estrita de hash imutável para os cabeçalhos de longa duração do vercel.json
        entryFileNames: "assets/js/[name]-[hash].js",
        chunkFileNames: "assets/js/[name]-[hash].js",
        assetFileNames: "assets/[ext]/[name]-[hash].[ext]"
      }
    }
  }
}));
