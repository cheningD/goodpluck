/** @type {import('tailwindcss').Config} */
import preline from "preline/plugin.js";

export default {
  content: [
    "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
    "node_modules/preline/dist/*.js",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Arial", "sans-serif"],
      },
      colors: {
        "brand-black": "#000000",
        "brand-red": "#F45C4D",
        "brand-green": "#4D884A",
        "brand-yellow": "#FBB72C",
        "brand-off-white": "#FAF2EA",
        "custom-gray": "#8C8D8D",
        "custom-silver": "#D9D9D9",
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), preline],
  darkMode: "false",
};
