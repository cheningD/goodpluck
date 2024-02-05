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
        "brand-black": "#403C3B",
        "brand-red": "#EE5A44",
        "brand-green": "#4d884a",
        "brand-yellow": "#fbb72c",
        "brand-gray": "#8C8D8D",
        "brand-silver": "#D9D9D9",
        "brand-off-white": "#F6F5ED",
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), preline],
  darkMode: "false",
};
