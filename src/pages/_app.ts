import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import type { App } from "vue";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import colors from "vuetify/lib/util/colors";

export default (app: App) => {
  if (typeof window !== "undefined") {
    // @ts-ignore
    window.MonacoEnvironment = {
      // @ts-ignore
      getWorker(_, label) {
        if (label === "json") {
          return new jsonWorker();
        }

        return new editorWorker();
      },
    };
  }

  const vuetify = createVuetify({
    components,
    directives,
    theme: {
      defaultTheme: "dark",
      themes: {
        dark: {
          colors: {
            primary: colors.indigo.base,
            secondary: colors.amber.base,
          },
        },
      },
    },
  });

  app.use(vuetify);
};
