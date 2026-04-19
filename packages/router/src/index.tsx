import {
  AnyRoute,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouteComponent,
  createLazyRoute,
  lazyFn,
} from "@tanstack/react-router";
import { ReactNode } from "react";

const rootRoute = createRootRoute({
  notFoundComponent: () => <div>Not Found</div>,
});

interface CreateRouterOptions {
  layoutComponent?: RouteComponent;
  id: string;
}

interface PageRouter {
  path: string;
  component: RouteComponent;
  lazy?: boolean;
  lazyPath?: any;
}
export function createAppRouter<T>({
  layoutComponent = () => <Outlet />,
  id,
}: CreateRouterOptions) {
  const ScopeRoutes: AnyRoute[] = [];
  const layout = `${id}-layout`;
  const layoutRoute = createRoute({
    getParentRoute: () => rootRoute,
    id: layout,
    component: layoutComponent,
    notFoundComponent(props) {
      return "no no no 2";
    },
  });

  const createPage =
    (routes: AnyRoute[]) =>
    ({
      component,
      path,
      loader,
      lazy,
      lazyPath,
    }: PageRouter & Partial<Parameters<typeof createRoute>["0"]>) => {
      const pages: AnyRoute[] = [];
      const url = `/${id}/${path}`;
      const url_path = `/${layout}/${id}/${path}`;

      console.log({
        url,
        url_path,
      });

      const pageRoute = createRoute({
        getParentRoute: () => layoutRoute,
        path: url,
        component: lazy
          ? undefined
          : (props) => component({ ...props, url_path }),

        loader,
        notFoundComponent(props) {
          return "no no no 4";
        },
      });

      if (lazyPath) {
        pageRoute.lazy(() =>
          lazyPath().then((res: any) => {
            const lazy = createLazyRoute(url)({
              component: (props) => res.default({ ...props, url_path }),
              pendingComponent: () => "vvvvvvv...",
            });

            return lazy;
          })
        );
      }
      routes.push(pageRoute);
      return pageApi(pages);
    };
  const pageApi = (pages: AnyRoute[]) => ({
    page: createPage(pages),
  });
  return {
    route: () => {
      layoutRoute.addChildren(ScopeRoutes);
      return layoutRoute;
    },
    ...pageApi(ScopeRoutes),
  };
}

const pluginRoutesModules = import.meta.glob(
  "../../plugins/**/Pages/**/route.tsx",

  {}
);
type Plugin = {
  default: ReturnType<typeof createAppRouter>;
  pages: () => Record<string, Promise<Promise<() => ReactNode>>>;
};
function getPageName(path: string) {
  const name = path.split("/");
  const index = name.findIndex(
    (item) => item == "page.tsx" || item == "page.lazy.tsx"
  );
  return name.at(index - 1);
}
function isLazyPage(path: string) {
  return path.includes("lazy");
}
function isLazyLoader(path: string) {
  return path.includes("loader.ts");
}
async function getLoaderFn(path: string, data: Plugin["pages"]) {
  const name = getPageName(path);
  const loaderName = `${name}/loader.ts`;

  const item = Object.entries(data).find(([key]) => key.includes(loaderName));
  if (!item) return;

  return lazyFn(() => item[1](), `loader`);
}
async function loadRoutes() {
  const apps: AnyRoute[] = [];
  for (let [path, file] of Object.entries(pluginRoutesModules)) {
    const plugin = (await await file()) as Plugin;
    const appRootRoue = plugin.default;
    for (let [pagePath, pageFile] of Object.entries(plugin.pages)) {
      if (isLazyLoader(pagePath)) continue;
      const url = getPageName(pagePath);
      if (!url) continue;
      const isLazy = isLazyPage(pagePath);
      const page = isLazy ? undefined : await await pageFile();
      const lazyComponent = isLazy ? pageFile : undefined;
      const loader = isLazy
        ? await getLoaderFn(pagePath, plugin.pages)
        : page?.loader;
      console.log({ loader });

      appRootRoue.page({
        path: url,
        component: page?.default,
        loader,
        lazy: isLazy,
        lazyPath: lazyComponent,
      });
    }
    apps.push(appRootRoue.route());
  }
  return apps;
}
export const apps = loadRoutes();

const getRoute = () => {
  const route = apps.then((item) => {
    const routeTree = rootRoute.addChildren(item);

    const router = createRouter({
      routeTree,
      defaultPreload: "intent",
      defaultStaleTime: 5000,
      scrollRestoration: true,
      defaultPendingComponent: () => "uuuuuuu",
    });
    return router;
  });
  return () => {
    return route;
  };
};

export {
  RouterProvider,
  createRouter,
  type AnyRouter,
  notFound,
  lazyFn,
} from "@tanstack/react-router";
export { rootRoute };
export const route = getRoute();
