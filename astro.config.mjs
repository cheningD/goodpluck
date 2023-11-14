import cloudflare from "@astrojs/cloudflare";
import { defineConfig } from "astro/config";
import sentry from "@sentry/astro";
import solid from "@astrojs/solid-js";
import tailwind from "@astrojs/tailwind";

const SENTRY_AUTH_TOKEN = "process.env.SENTRY_AUTH_TOKEN";

// https://astro.build/config
export default defineConfig({
  integrations: [
    solid(),
    tailwind(),
    sentry({
      dsn: "https://2e3c5757571691fb195c2e89dfd7bf57@o469653.ingest.sentry.io/4506223026634752",
      sourceMapsUploadOptions: {
        project: "javascript-astro",
        authToken: SENTRY_AUTH_TOKEN,
        org: "goodpluck",
      },
      debug: true,
    }),
  ],
  output: "server",
  adapter: cloudflare(),
  vite: {
    define: {
      "process.env.SENTRY_AUTH_TOKEN": process.env.SENTRY_AUTH_TOKEN,
    },
  },
});
