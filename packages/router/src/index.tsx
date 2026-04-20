import { getRoute } from "./loader/pageLoader";

export {
  RouterProvider,
  createRouter,
  type AnyRouter,
  notFound,
  lazyFn,
} from "@tanstack/react-router";

export * from "./loader/pageLoader";
export const route = getRoute();
