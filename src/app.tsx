import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import useAsset from "ultra/hooks/use-asset.js";
import { getFontStyles } from "./utilities/font_styles.tsx";

const Index = lazy(() => import("./routes/index.tsx"));
const AnotherRoute = lazy(() => import("./routes/another-route.tsx"));
const _404 = lazy(() => import("./routes/_404.tsx"));

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>grammY tools</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" href={useAsset("/favicon.ico")} />
        <link rel="stylesheet" href={useAsset("/preflight.css")} />
        <link rel="stylesheet" href={useAsset("/vars.css")} />
        <link rel="stylesheet" href={useAsset("/main.css")} />
        <style dangerouslySetInnerHTML={{ __html: getFontStyles() }} />
      </head>
      <body className="bg-background text-foreground">
        <Suspense
          fallback={
            <main>
              <p>Loading...</p>
            </main>
          }
        >
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/another-route" element={<AnotherRoute />} />
            <Route path="*" element={<_404 />} />
          </Routes>
        </Suspense>
      </body>
    </html>
  );
}
