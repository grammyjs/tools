import hydrate from "ultra/hydrate.js";
import App from "./src/app.tsx";

// React Router
import { BrowserRouter } from "react-router-dom";

function ClientApp() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

hydrate(document, <ClientApp />);
