/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      animation: {
        blink: 'pulse 0.5s ease-in-out infinite'
      },
      colors: {
        foreground: "var(--foreground)",
        background: "var(--background)",
        "translucentbackground": "var(--translucentbackground)",
        "altbackground": "var(--altbackground)",
        grammy: "#009dca",
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
};
