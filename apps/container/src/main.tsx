import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Router } from "./router";
import { createRootRouteWithContext, createZedRouter } from "@zed/router";
const rootRouter = createRootRouteWithContext()({
  notFoundComponent: () => <div>Not Found</div>,
  context: () => ({
    hello: () => Date.now(),
  }),
});
const router = createZedRouter({
  rootRouter: rootRouter,
});
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router router={router} />
  </StrictMode>
);
