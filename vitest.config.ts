import { getViteConfig } from "astro/config";
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
});
