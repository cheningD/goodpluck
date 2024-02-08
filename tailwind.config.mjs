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
        sans: ["AventaVariable", "sans-serif"],
      },
      colors: {
        "brand-black": "#000000",
        "brand-red": "#f45c4d",
        "brand-green": "#4d884a",
        "brand-yellow": "#fbb72c",
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), preline],
  darkMode: "false",
};
