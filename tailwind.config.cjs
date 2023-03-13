/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        foreground: "var(--foreground)",
        background: "var(--background)",
        "translucentbackground": "var(--translucentbackground)",
        "altbackground": "var(--altbackground)",
        grammy: "#009dca",
      },
    },
  },
  plugins: [],
};
