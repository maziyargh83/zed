import { ReactNode } from "react";
import { getPageName, isLazyLoader, isLazyPage } from "../utils/utils";
import {
  AnyRoute,
  createLazyRoute,
  createRoute,
  createRouter,
  lazyFn,
  Outlet,
  RootRoute,
} from "@tanstack/react-router";
import { CreateRouterOptions, PageRouter } from "../types";
import Module from "module";

export function createAppRouter<T>({
  layoutComponent = () => <Outlet />,
  id,
}: CreateRouterOptions) {
  const ScopeRoutes: AnyRoute[] = [];
  const layout = `${id}-layout`;
  const layoutRoute = createRoute({
    getParentRoute: () => getRootRouter(),
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

type Plugin = {
  default: ReturnType<typeof createAppRouter>;
  pages: () => Record<string, Promise<Promise<() => ReactNode>>>;
};

export async function getLoaderFn(path: string, data: Plugin["pages"]) {
  const name = getPageName(path);
  const loaderName = `${name}/loader.ts`;

  const item = Object.entries(data).find(([key]) => key.includes(loaderName));
  if (!item) return;

  return lazyFn(() => item[1](), `loader`);
}

type TpluginRoutesModules = Record<string, any>;
export async function loadRoutes(pluginRoutesModules: TpluginRoutesModules) {
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

type createRouterOptionsType = Exclude<
  Parameters<typeof createRouter>["0"],
  "routeTree"
>;
interface ICreateZedRouterProps extends createRouterOptionsType {
  rootRouter: RootRoute<unknown, any, any, any>;
  plugins: TpluginRoutesModules;
}

const persistedCreateZedRouter = () => {
  let storedRootRouter: RootRoute;
  let storedRouter: ReturnType<typeof createRouter>;
  return {
    createZedRouter: ({
      rootRouter,
      plugins,
      ...tanstakProps
    }: ICreateZedRouterProps) => {
      if (!rootRouter) return;
      if (!storedRootRouter) storedRootRouter = rootRouter;

      const apps = loadRoutes(plugins);
      return apps.then((item) => {
        const routeTree = rootRouter.addChildren(item);

        storedRouter = createRouter({
          routeTree,
          defaultPreload: "intent",
          defaultStaleTime: 5000,
          scrollRestoration: true,
          defaultPendingComponent: () => "uuuuuuu",
          ...tanstakProps,
        });
        return storedRouter;
      });
    },
    getRootRouterFn: () => storedRootRouter,
    getRouter: () => storedRouter,
  };
};

const { createZedRouter, getRootRouterFn, getRouter } =
  persistedCreateZedRouter();

export function getRootRouter() {
  const RootRouter = getRootRouterFn();

  if (!RootRouter) throw Error("Root Router not fount!");
  if ("then" in RootRouter) throw Error("Root Router not created!");
  return RootRouter;
}
export { createZedRouter, getRouter };
