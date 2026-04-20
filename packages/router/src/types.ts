import { RouteComponent } from "@tanstack/react-router";

export interface CreateRouterOptions {
  layoutComponent?: RouteComponent;
  id: string;
}

export interface PageRouter {
  path: string;
  component: RouteComponent;
  lazy?: boolean;
  lazyPath?: any;
}
