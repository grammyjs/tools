import hydrate from "ultra/hydrate.js";
import { BrowserRouter } from "react-router-dom";
import App from "./src/app.tsx";

function ClientApp() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

hydrate(document, <ClientApp />);
