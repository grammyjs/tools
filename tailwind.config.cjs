/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      animation: {
        blink: "pulse 0.5s ease-in-out infinite",
      },
      colors: {
        foreground: "var(--foreground)",
        background: "var(--grammy-background)",
        translucentbackground: "var(--translucentbackground)",
        altbackground: "var(--altbackground)",
        grammy: {
          50: "#e5f9ff",
          100: "#b3eeff",
          200: "#80e3ff",
          300: "#4dd7ff",
          400: "#1accff",
          500: "#00b2e6",
          600: "var(--grammy)",
          700: "#008bb3",
          800: "#006380",
          900: "#003b4d",
          950: "#00141a"
        }
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
  safelist: [
    {
      pattern: /^(bg|border|text)-(red|green|slate|grammy).*/,
      variants: ["hover", "active", "disabled"],
    },
    {
      pattern: /p-\d+/
    }
  ],
};
