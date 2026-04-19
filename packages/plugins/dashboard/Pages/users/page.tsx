import { route } from "@memtori/router";
import { use } from "react";

export default (props) => {
  const routerData = use(route());
  const data = routerData.routesById[props.url_path];

  const res = data.useLoaderData();
  return <h1>hello {res}</h1>;
};
