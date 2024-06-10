/// <reference types="vitest" />
import { getViteConfig } from "astro/config";
import solidPlugin from "vite-plugin-solid";

export default getViteConfig({
  plugins: [solidPlugin()],
  test: {
    environment: "jsdom",
    include: ["**/tests/unit/*"],
    exclude: ["**/node_modules/**", "**/dist/**", "**/e2e/**"],
    setupFiles: ["tests/vitest-setup.ts"],
  },
});
