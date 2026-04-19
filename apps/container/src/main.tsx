import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Router } from "./router";
import { route } from "@memtori/router";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router router={route()} />
  </StrictMode>
);
