import { spawnSync } from "node:child_process";
import { chmodSync, existsSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONFIG_PATH = path.join(
  ROOT,
  "packages/smoothui/tsconfig.blocks-radix.generated.json"
);

describe("typecheck-blocks-radix", () => {
  it("restores the generated tsconfig even when tsc fails", () => {
    const dir = mkdtempSync(path.join(tmpdir(), "typecheck-blocks-radix-"));
    const fakeTsc = path.join(dir, "tsc");
    writeFileSync(fakeTsc, "#!/bin/sh\nexit 1\n");
    chmodSync(fakeTsc, 0o755);

    const result = spawnSync(
      path.join(ROOT, "node_modules/.bin/tsx"),
      ["scripts/typecheck-blocks-radix.mts"],
      {
        cwd: ROOT,
        encoding: "utf8",
        env: { ...process.env, SMOOTHUI_TSC_BIN: fakeTsc },
      }
    );

    expect(result.status).not.toBe(0);
    expect(existsSync(CONFIG_PATH)).toBe(false);
  });
});
