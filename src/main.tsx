import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./app/styles/global.css.ts";
import "./app/styles/loadFonts";
import App from "./app/App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
