import { route } from "@zed/router";
import { use } from "react";

export default (props) => {
  const routerData = use(route());
  const data = routerData.routesById[props.url_path];

  const res = data.useLoaderData();

  return <h1>lazy loading page {res}</h1>;
};
