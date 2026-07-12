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
  esbuild: {
    jsx: "automatic",
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./test-utils/setup.ts"],
    include: [
      "components/**/__tests__/**/*.test.{ts,tsx}",
      "blocks/**/__tests__/**/*.test.{ts,tsx}",
    ],
    globals: true,
    server: {
      deps: {
        // react-tweet ships ESM importing CSS modules; inline it so Vite
        // transforms the .css imports instead of node's ESM loader choking.
        inline: ["react-tweet"],
      },
    },
    coverage: {
      provider: "v8",
      include: ["components/**", "blocks/**", "hooks/**", "utils/**", "lib/**"],
      exclude: ["**/__tests__/**", "**/*.d.ts"],
      reporter: ["json-summary", "lcov"],
      // Regression gate just below the current baseline (2026-07):
      // lines 75.9, statements 75.5, functions 67.0, branches 53.3.
      thresholds: {
        lines: 70,
        statements: 70,
        functions: 62,
        branches: 48,
      },
    },
  },
  resolve: {
    dedupe: ["react", "react-dom"],
    alias: {
      "@repo/shadcn-ui/lib/utils": path.join(shadcnPath, "lib/utils"),
      "@repo/shadcn-ui/components/ui": path.join(shadcnPath, "components/ui"),
      "@repo/shadcn-ui": shadcnPath,
      "@repo/smoothui/components": path.join(smoothuiPath, "components"),
      "@repo/smoothui": smoothuiPath,
      "@smoothui/data": path.resolve(import.meta.dirname, "../data"),
      react: reactPath,
      "react/jsx-runtime": path.join(reactPath, "jsx-runtime"),
      "react/jsx-dev-runtime": path.join(reactPath, "jsx-dev-runtime"),
      "react-dom": reactDomPath,
      "react-dom/client": path.join(reactDomPath, "client"),
    },
  },
});
