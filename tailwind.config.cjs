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
        background: "var(--grammy-background)",
        translucentbackground: "var(--translucentbackground)",
        altbackground: "var(--altbackground)",
        grammy: "var(--grammy)",
        "grammy-darken-10": "var(--grammy-darken-10)",
        "grammy-darken-20": "var(--grammy-darken-20)",
        "grammy-darken-50": "var(--grammy-darken-50)"
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
};
