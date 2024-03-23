import { getViteConfig } from "astro/config";
import path from "path";
import solidPlugin from "vite-plugin-solid";

export default getViteConfig({
  plugins: [solidPlugin()],
  test: {
    /* for example, use global to avoid globals imports (describe, test, expect): */
    // globals: true,
    dir: "./tests/unit",
    environment: "jsdom",
    setupFiles: ["tests/vitest-setup.ts"],
  },
  resolve: {
    alias: {
      "@src": path.resolve(__dirname, "./src"),
    },
  },
});
