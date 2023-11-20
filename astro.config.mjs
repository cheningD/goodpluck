import cloudflare from "@astrojs/cloudflare";
import { defineConfig } from "astro/config";
import solid from "@astrojs/solid-js";
import tailwind from "@astrojs/tailwind";

//https://astro.build/config
export default defineConfig({
  integrations: [solid(), tailwind()],
  output: "server",
  adapter: cloudflare(),
  vite: {
    define: {
      "process.env.STYTCH_PROJECT_ID": JSON.stringify(
        process.env.STYTCH_PROJECT_ID,
      ),
      "process.env.STYTCH_PROJECT_SECRET": JSON.stringify(
        process.env.STYTCH_PROJECT_SECRET,
      ),
      "process.env.SWELL_STORE_ID": JSON.stringify(process.env.SWELL_STORE_ID),
      "process.env.SWELL_SECRET_KEY": JSON.stringify(
        process.env.SWELL_SECRET_KEY,
      ),
    },
  },
});
