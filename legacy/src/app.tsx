import { Suspense, lazy } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import useAsset from "ultra/hooks/use-asset.js";
import Main from "./components/Main.tsx";
import { getFontStyles } from "./utilities/font_styles.tsx";

const Index = lazy(() => import("./routes/index.tsx"));
const FilterQueryBrowser = lazy(
  () => import("./routes/filter-query-browser.tsx")
);
const _404 = lazy(() => import("./routes/_404.tsx"));

const tools: Record<string, string> = {
  "/filter-query-browser": "Filter Query Browser",
};

export default function App() {
  const location = useLocation();

  return (
    <html lang="en" className="scroll-smooth">
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
        <header className="px-4 py-2 sticky top-0 bg-translucentbackground b-b b-gray-200 @dark:b-gray-800">
          <div className="max-w-screen-sm mx-auto select-none flex flex-col">
            {typeof tools[location.pathname] === "string" ? (
              <>
                <Link
                  to="/"
                  className="hover:opacity-70 font-['Red_Hat_Display'] font-bold text-xs"
                >
                  grammY tools
                </Link>{" "}
                <a href="#" className="hover:opacity-70 text-lg">
                  {tools[location.pathname]}
                </a>
              </>
            ) : (
              <Link
                to="/"
                className="hover:opacity-70 font-['Red_Hat_Display'] font-bold text-lg"
              >
                grammY tools
              </Link>
            )}
          </div>
        </header>
        <Suspense fallback={<Main>Loading...</Main>}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route
              path="/filter-query-browser"
              element={<FilterQueryBrowser />}
            />
            <Route path="*" element={<_404 />} />
          </Routes>
        </Suspense>
      </body>
    </html>
  );
}
