import { createAppRouter } from "@zed/router";

export const pages = import.meta.glob([
  "./**/page.tsx",
  "./**/page.lazy.tsx",
  "./**/loader.ts",
]);
const RootDashboardRouter = createAppRouter({
  id: "dashboard",
});
export default RootDashboardRouter;
