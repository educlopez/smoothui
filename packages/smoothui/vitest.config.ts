import path from "node:path";
import { defineConfig } from "vitest/config";

const shadcnPath = path.resolve(import.meta.dirname, "../shadcn-ui");
const smoothuiPath = path.resolve(import.meta.dirname, ".");
const reactPath = path.resolve(import.meta.dirname, "node_modules/react");
const reactDomPath = path.resolve(
  import.meta.dirname,
  "node_modules/react-dom"
);

export default defineConfig({
  // Without this, Vite writes its transform cache to a folder named after a
  // random 21-character id at the repo root, which is both unignorable by glob
  // and easy to commit by accident — 7.5MB of it once did.
  cacheDir: path.resolve(import.meta.dirname, "node_modules/.vite"),
  esbuild: {
    jsx: "automatic",
  },
  resolve: {
    alias: {
      "@repo/shadcn-ui": shadcnPath,
      "@repo/shadcn-ui/components/ui": path.join(shadcnPath, "components/ui"),
      "@repo/shadcn-ui/lib/utils": path.join(shadcnPath, "lib/utils"),
      "@repo/smoothui": smoothuiPath,
      "@repo/smoothui/components": path.join(smoothuiPath, "components"),
      "@smoothui/data": path.resolve(import.meta.dirname, "../data"),
      react: reactPath,
      "react-dom": reactDomPath,
      "react-dom/client": path.join(reactDomPath, "client"),
      "react/jsx-dev-runtime": path.join(reactPath, "jsx-dev-runtime"),
      "react/jsx-runtime": path.join(reactPath, "jsx-runtime"),
    },
    dedupe: ["react", "react-dom"],
  },
  test: {
    coverage: {
      exclude: ["**/__tests__/**", "**/*.d.ts"],
      include: [
        "components/**",
        "blocks/**",
        "templates/**",
        "hooks/**",
        "utils/**",
        "lib/**",
      ],
      provider: "v8",
      reporter: ["json-summary", "lcov"],
      // Regression gate just below the current baseline (2026-07):
      // lines 75.9, statements 75.5, functions 67.0, branches 53.3.
      thresholds: {
        branches: 48,
        functions: 62,
        lines: 70,
        statements: 70,
      },
    },
    environment: "jsdom",
    globals: true,
    include: [
      "components/**/__tests__/**/*.test.{ts,tsx}",
      "blocks/**/__tests__/**/*.test.{ts,tsx}",
      "templates/**/__tests__/**/*.test.{ts,tsx}",
      // Package-wide guards that belong to no single component.
      "__tests__/**/*.test.{ts,tsx}",
    ],
    server: {
      deps: {
        // react-tweet ships ESM importing CSS modules; inline it so Vite
        // transforms the .css imports instead of node's ESM loader choking.
        inline: ["react-tweet"],
      },
    },
    setupFiles: ["./test-utils/setup.ts"],
  },
});
