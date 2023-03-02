import useAsset from "ultra/hooks/use-asset.js";
import { getFontStyles } from "./utilities/font_styles.tsx";

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>grammY tools</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" href={useAsset("/favicon.ico")} />
        <link rel="stylesheet" href={useAsset("/modern-normalize.css")} />
        <link rel="stylesheet" href={useAsset("/vars.css")} />
        <link rel="stylesheet" href={useAsset("/main.css")} />
        <style dangerouslySetInnerHTML={{ __html: getFontStyles() }} />
      </head>
      <body className="bg-background">
        <main></main>
      </body>
    </html>
  );
}
