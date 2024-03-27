import { defineConfig } from "astro/config";
import solid from "@astrojs/solid-js";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel/serverless";
import sentry from "@sentry/astro";

// https://astro.build/config
export default defineConfig({
  integrations: [
    solid(),
    tailwind(),
    ...(process.env.SENTRY_AUTH_TOKEN
      ? [
          sentry({
            dsn: "https://d21f5663db71cc4c293c404620df7421@o469653.ingest.us.sentry.io/4506963324174336",
            sourceMapsUploadOptions: {
              project: "goodpluck",
              authToken: process.env.SENTRY_AUTH_TOKEN,
            },
          }),
        ]
      : []),
  ],
  output: "server",
  adapter: vercel(),
});
