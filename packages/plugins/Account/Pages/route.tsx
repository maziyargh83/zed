import { createAppRouter } from "@zed/router";
import rootRoute from "../../dashboard/Pages/route";
export const pages = import.meta.glob([
  "./**/page.tsx",
  "./**/page.lazy.tsx",
  "./**/loader.ts",
]);
const RootAccountRouter = createAppRouter({
  id: "Account",
  rootRoute: rootRoute.route(false),
});
export default RootAccountRouter;
