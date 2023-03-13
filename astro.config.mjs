import { defineConfig } from "astro/config";
import vue from "@astrojs/vue";
import react from "@astrojs/react";

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  integrations: [
    vue({
      appEntrypoint: "/src/pages/_app",
    }),
    react(),
    tailwind(),
  ],
  vite: {
    ssr: {
      noExternal: ["vuetify"],
    },
  },
});
