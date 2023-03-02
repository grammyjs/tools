import { serve } from "https://deno.land/std@0.176.0/http/server.ts";
import { type Context, createServer } from "ultra/server.ts";
import { build } from "unocss-cli";
import App from "./src/app.tsx";

// React Router
import { StaticRouter } from "react-router-dom/server";

const server = await createServer({
  importMapPath: import.meta.resolve("./importMap.json"),
  browserEntrypoint: import.meta.resolve("./client.tsx"),
});

function ServerApp({ context }: { context: Context }) {
  return (
    <StaticRouter location={new URL(context.req.url).pathname}>
      <App />
    </StaticRouter>
  );
}

server.get("*", async (context) => {
  /**
   * Render the request
   */
  const result = await server.render(<ServerApp context={context} />);

  return context.body(result, 200, {
    "content-type": "text/html; charset=utf-8",
  });
});
if (import.meta.main) {
  await build({
    patterns: ["src/**/*"],
    outFile: "public/main.css",
    watch: true,
  });
  serve(server.fetch);
}
export default server;
