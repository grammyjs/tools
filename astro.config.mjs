import { defineConfig } from "astro/config"
import unocss from '@unocss/astro'
import vue from "@astrojs/vue"
import presetWind from "@unocss/preset-wind"
import react from "@astrojs/react"

// https://astro.build/config
export default defineConfig({
  integrations: [
    vue({
      appEntrypoint: "/src/pages/_app"
    }),
    react(),
    unocss({
      presets: [presetWind()],
      shortcuts: { "link": "text-grammy hover:underline" },
      theme: {
        colors: {
          foreground: "var(--foreground)",
          background: "var(--background)",
          "translucentbackground": "var(--translucentbackground)",
          "altbackground": "var(--altbackground)",
          grammy: "#009dca",
        },
      },
    })
  ],
  vite: {
    ssr: {
      noExternal: ["vuetify"]
    }
  }
})