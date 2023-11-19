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
    },
  },
  plugins: [require("@tailwindcss/forms"), preline],
  darkMode: "false",
};
