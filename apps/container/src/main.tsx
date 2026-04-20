import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Router } from "./router";
import { createRootRoute, createZedRouter } from "@zed/router";
const rootRouter = createRootRoute({
  notFoundComponent: () => <div>Not Found</div>,
});
const router = createZedRouter({
  rootRouter: rootRouter,
});
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router router={router} />
  </StrictMode>
);
