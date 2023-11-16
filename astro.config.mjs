import { defineConfig } from "astro/config";
import solid from "@astrojs/solid-js";
import tailwind from "@astrojs/tailwind";
import cloudflare from "@astrojs/cloudflare";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";
import AutoImport from "unplugin-auto-import/vite";
import solidPlugin from "vite-plugin-solid";

//https://astro.build/config
export default defineConfig({
  integrations: [solid(), tailwind()],
  output: "server",
  adapter: cloudflare(),
  vite: {
    resolve: {
      alias: {
        "@": "./src",
      },
    },
    plugins: [
      // solidPlugin(),
      /* ... */
      AutoImport({
        resolvers: [
          IconsResolver({
            prefix: "Icon",
            extension: "jsx",
          }),
        ],
      }),
      Icons({
        compiler: "solid", // or 'solid',
        autoInstall: true,
      }),
    ],
  },
});
