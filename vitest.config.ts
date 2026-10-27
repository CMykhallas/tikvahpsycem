import { configDefaults, defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config";

export default mergeConfig(viteConfig({ mode: "test", command: "serve" }), defineConfig({
  test: {
    globals: true,
    exclude: [...configDefaults.exclude, "e2e/**"],
  },
}));
