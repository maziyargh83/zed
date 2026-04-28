import { Generator, getConfig } from "@tanstack/router-generator";
import { existsSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = dirname(fileURLToPath(import.meta.url));

// Load all routes from plugins
const plugins = import.meta.glob("./**/main.tsx");

(async () => {
  for (const item of Object.keys(plugins)) {
    const pluginMainPath = resolve(currentDir, item);
    const routesAbsolute = resolve(dirname(pluginMainPath), "routes");
    console.log(item);

    if (!existsSync(routesAbsolute)) {
      continue;
    }

    const routes = relative(currentDir, routesAbsolute);
    const config = getConfig({
      routesDirectory: routes,
      generatedRouteTree: resolve(routes, "..", "routeTree.gen.ts"),
      disableTypes: true,
      routeTreeFileFooter: ["conole.log('heello')"],
    });
    const generator = new Generator({
      config,
      root: "./asdasdas",
    });
    console.log(generator.targetTemplate);
  }
})();
