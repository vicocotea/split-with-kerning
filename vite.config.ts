import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { resolve } from "path";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "SplitWithKerning",
      fileName: "index",
      formats: ["es", "umd"],
    },
  },
  plugins: [dts()],
  root: ".",
  publicDir: "public",
  server: {
    open: '/examples/index.html',
    fs: {
      allow: ['..']
    }
  }
});
