import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Router } from "./router";
import { createRootRouteWithContext, createZedRouter } from "@zed/router";
const rootRouter = createRootRouteWithContext()({
  notFoundComponent: () => <div>Not Found</div>,
});
const plugins = import.meta.glob([
  "../../../packages/plugins/**/Pages/**/route.tsx",
  "./routes/**/route.tsx",
]);
const router = createZedRouter({
  rootRouter: rootRouter,
  plugins,
});
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router router={router} />
  </StrictMode>
);
