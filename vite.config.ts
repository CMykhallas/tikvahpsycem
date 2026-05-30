import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
<<<<<<< HEAD
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
=======
import { fileURLToPath, URL } from "node:url";
import { componentTagger } from "lovable-tagger";

>>>>>>> a861c0b3b9ddfa91d07dcbf633b72e20d3991424
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
<<<<<<< HEAD
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
=======
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
>>>>>>> a861c0b3b9ddfa91d07dcbf633b72e20d3991424
    },
  },
}));
