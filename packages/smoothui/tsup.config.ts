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
    "@repo/shadcn-ui",
    "@repo/shadcn-ui/lib/utils",
  ],
  format: ["esm"],
  outDir: "dist",
  splitting: false,
});
