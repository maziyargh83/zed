import { useRouter } from "@zed/router";

export default (props) => {
  const route = useRouter();
  const data = route.routesById[props.url_path];

  const res = data.useRouteContext();

  const recalc = () => {
    route.invalidate();
  };

  return (
    <h1>
      lazy loading page {res.hello()}
      <button onClick={recalc}>recalc</button>
      <p>{Date.now()}</p>
    </h1>
  );
};
