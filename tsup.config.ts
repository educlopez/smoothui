import { readFileSync } from "node:fs";
import { defineConfig } from "tsup";

const packageJson = JSON.parse(
  readFileSync(new URL("./package.json", import.meta.url), "utf8")
) as { version: string };

export default defineConfig({
  banner: {
    js: "#!/usr/bin/env node",
  },
  clean: true,
  define: {
    __CLI_VERSION__: JSON.stringify(packageJson.version),
  },
  dts: false,
  entry: ["scripts/index.ts"],
  format: ["esm"],
  minify: true,
  noExternal: [/.*/],
  outDir: "dist",
  sourcemap: false,
  target: "node22.13",
});
