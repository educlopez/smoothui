import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, unlinkSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SMOOTHUI = path.join(ROOT, "packages/smoothui");
const COMPONENTS = path.join(SMOOTHUI, "components");
const CONFIG_NAME = "tsconfig.blocks-radix.generated.json";
const configPath = path.join(SMOOTHUI, CONFIG_NAME);

const twinPaths: Record<string, string[]> = {};

for (const entry of readdirSync(COMPONENTS, { withFileTypes: true })) {
  if (!entry.isDirectory()) {
    continue;
  }
  const radixFile = path.join(
    COMPONENTS,
    entry.name,
    `${entry.name}.radix.tsx`
  );
  if (existsSync(radixFile)) {
    twinPaths[`@repo/smoothui/components/${entry.name}`] = [
      `./components/${entry.name}/${entry.name}.radix.tsx`,
    ];
  }
}

const tsconfig = {
  compilerOptions: {
    baseUrl: ".",
    jsx: "preserve",
    lib: ["es2022", "DOM", "DOM.Iterable"],
    module: "ESNext",
    moduleResolution: "Bundler",
    noEmit: true,
    paths: {
      ...twinPaths,
      "@repo/smoothui-utils": ["../smoothui-utils"],
      "@repo/smoothui-utils/*": ["../smoothui-utils/*"],
      "@repo/smoothui/*": ["./*"],
      "@repo/smoothui/components/*": ["./components/*/index.tsx"],
    },
    skipLibCheck: true,
    types: ["node", "react", "react-dom"],
  },
  exclude: ["**/__tests__/**", "**/node_modules/**", "**/dist/**"],
  extends: "@repo/typescript-config/nextjs.json",
  include: [
    "blocks/**/index.tsx",
    path.join(ROOT, "scripts/css-modules-shim.d.ts"),
  ],
};

writeFileSync(configPath, `${JSON.stringify(tsconfig, null, 2)}\n`);

try {
  const tsc = path.join(ROOT, "node_modules/.bin/tsc");
  const result = spawnSync(tsc, ["--pretty", "false", "-p", CONFIG_NAME], {
    cwd: SMOOTHUI,
    encoding: "utf8",
  });

  if (result.stdout) {
    process.stdout.write(result.stdout);
  }
  if (result.stderr) {
    process.stderr.write(result.stderr);
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
} finally {
  if (existsSync(configPath)) {
    unlinkSync(configPath);
  }
}
