import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["components/index.ts"],
  outDir: "dist",
  format: ["esm"],
  dts: true,
  splitting: false,
  clean: true,
  external: [
    "react",
    "react-dom",
    "motion",
    "motion/react",
    "@repo/shadcn-ui",
    "@repo/shadcn-ui/lib/utils",
  ],
});
