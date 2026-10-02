import { defineConfig } from "tsup";

export default defineConfig({
  clean: true,
  dts: true,
  entry: ["components/index.ts"],
  external: [
    "react",
    "react-dom",
    "motion",
    "motion/react",
    "@repo/smoothui-utils",
  ],
  format: ["esm"],
  outDir: "dist",
  splitting: false,
});
