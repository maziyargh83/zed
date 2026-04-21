import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";

import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    react(),
    dts({
      entryRoot: "src",
    }),
  ],
  build: {
    lib: {
      entry: resolve(import.meta.dirname, "src/index.tsx"),
      name: "MyLib",
      // the proper extensions will be added
      fileName: "my-lib",
    },
    rolldownOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ["React"],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          React: "React",
        },
      },
    },
  },
});
