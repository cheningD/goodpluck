/** @type {import('tailwindcss').Config} */

export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["AventaSemiBold", "sans-serif"],
      },
      colors: {
        "brand-black": "#000000",
        "brand-red": "#f45c4d",
        "brand-green": "#4d884a",
        "brand-yellow": "#fbb72c",
        "brand-off-white": "#faf2ea",
        "custom-gray": "#8c8d8d",
        "custom-silver": "#d9d9d9",
        green: {
          50: "#edf3ed",
          100: "#dbe7db",
          200: "#b8cfb7",
          300: "#94b892",
          400: "#71a06e",
          500: "#4d884a",
          600: "#3e6d3b",
          700: "#2e522c",
          800: "#1f361e",
          900: "#0f1b0f",
        },
        yellow: {
          50: "#fff8ea",
          100: "#fef1d5",
          200: "#fde2ab",
          300: "#fdd480",
          400: "#fcc556",
          500: "#fbb72c",
          600: "#c99223",
          700: "#976e1a",
          800: "#644912",
          900: "#322509",
        },
        red: {
          50: "#feefed",
          100: "#fddedb",
          200: "#fbbeb8",
          300: "#f89d94",
          400: "#f67d71",
          500: "#f45c4d",
          600: "#c34a3e",
          700: "#92372e",
          800: "#62251f",
          900: "#31120f",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
  darkMode: "false",
};
