import { AnyRoute, RouteComponent } from "@tanstack/react-router";

export interface CreateRouterOptions {
  layoutComponent?: RouteComponent;
  id: string;
  useIdPrefix?: boolean;
  rootRoute?: AnyRoute;
}

export interface PageRouter {
  path: string;
  component: RouteComponent;
  lazy?: boolean;
  lazyPath?: any;
}
