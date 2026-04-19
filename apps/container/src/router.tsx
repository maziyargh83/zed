import { RouterProvider, type AnyRouter } from "@memtori/router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Fragment, use } from "react";

export const Router = ({ router }: { router: Promise<AnyRouter> }) => {
  const appRouter = use(router);

  return (
    <Fragment>
      <RouterProvider router={appRouter} />
      <TanStackRouterDevtools router={appRouter} />
    </Fragment>
  );
};
