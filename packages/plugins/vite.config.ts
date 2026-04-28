import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  logLevel: "info",
  build: {
    minify: false,
    sourcemap: true,
    rollupOptions: {
      input: resolve(import.meta.dirname, "src/main.ts"),
      external: ["react", "react-dom", "@tanstack/react-router", "@zed/router"],
      output: {
        format: "es",
        dir: "dist",
        preserveModules: true,
        preserveModulesRoot: "src",
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
      },
    },
  },
});
