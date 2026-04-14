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
    include: ["components/**/__tests__/**/*.test.{ts,tsx}"],
    globals: true,
  },
  resolve: {
    dedupe: ["react", "react-dom"],
    alias: {
      "@repo/shadcn-ui/lib/utils": path.join(shadcnPath, "lib/utils"),
      "@repo/shadcn-ui/components/ui": path.join(shadcnPath, "components/ui"),
      "@repo/shadcn-ui": shadcnPath,
      "@repo/smoothui/components": path.join(smoothuiPath, "components"),
      "@repo/smoothui": smoothuiPath,
      react: reactPath,
      "react/jsx-runtime": path.join(reactPath, "jsx-runtime"),
      "react/jsx-dev-runtime": path.join(reactPath, "jsx-dev-runtime"),
      "react-dom": reactDomPath,
      "react-dom/client": path.join(reactDomPath, "client"),
    },
  },
});
