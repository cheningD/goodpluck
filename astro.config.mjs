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
            dsn: "https://b6e371214433705eb55c814b184fba23@o4506955454152704.ingest.us.sentry.io/4506955579457536",
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
