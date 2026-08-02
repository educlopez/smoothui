import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  cacheDir: path.resolve(import.meta.dirname, "node_modules/.vite-risk"),
  resolve: {
    alias: {
      "@docs": path.resolve(import.meta.dirname, "apps/docs"),
      "@smoothui/data": path.resolve(import.meta.dirname, "packages/data"),
    },
  },
  test: {
    environment: "node",
    include: ["scripts/**/*.test.ts", "apps/docs/app/api/v1/**/*.test.ts"],
    restoreMocks: true,
  },
});
