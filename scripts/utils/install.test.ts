import {
  linkSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ProjectConfig, RegistryItem } from "../types.js";

const processMocks = vi.hoisted(() => ({ spawnSync: vi.fn() }));
const filesystemMocks = vi.hoisted(() => ({
  beforeOpen: null as (() => void) | null,
  closedDescriptors: [] as number[],
}));
const SYMBOLIC_LINK_ERROR = /symbolic link/i;
const HARD_LINK_ERROR = /hard link/i;

vi.mock("node:child_process", () => ({ spawnSync: processMocks.spawnSync }));
vi.mock("node:fs", async (importOriginal) => {
  const actual = await importOriginal<typeof import("node:fs")>();
  return {
    ...actual,
    closeSync: ((descriptor: number) => {
      filesystemMocks.closedDescriptors.push(descriptor);
      return actual.closeSync(descriptor);
    }) as typeof actual.closeSync,
    openSync: ((...args: unknown[]) => {
      filesystemMocks.beforeOpen?.();
      filesystemMocks.beforeOpen = null;
      return Reflect.apply(actual.openSync, actual, args);
    }) as typeof actual.openSync,
  };
});

import { installDependencies, writeComponent } from "./install.js";

const originalCwd = process.cwd();
let testDirectory: string;

const config: ProjectConfig = {
  alias: "~",
  componentPath: "src/components/ui",
  packageManager: "pnpm",
};

const component = (files: RegistryItem["files"]): RegistryItem => ({
  files,
  name: "fixture",
  type: "registry:ui",
});

describe("component installation", () => {
  beforeEach(() => {
    testDirectory = mkdtempSync(join(tmpdir(), "smoothui-install-"));
    process.chdir(testDirectory);
    processMocks.spawnSync.mockReset();
    filesystemMocks.beforeOpen = null;
    filesystemMocks.closedDescriptors.length = 0;
  });

  afterEach(() => {
    process.chdir(originalCwd);
    rmSync(testDirectory, { force: true, recursive: true });
  });

  it("uses file targets, strips registry prefixes, and rewrites aliases", async () => {
    const result = await writeComponent(
      component([
        {
          content: 'import { cn } from "@/components/ui/utils";',
          path: "ignored.ts",
          target: "components/nested/example.ts",
          type: "registry:ui",
        },
      ]),
      config,
      false,
      vi.fn()
    );

    expect(result).toEqual({
      skipped: [],
      written: ["nested/example.ts"],
    });
    expect(
      readFileSync(
        join(testDirectory, "src/components/ui/nested/example.ts"),
        "utf8"
      )
    ).toBe('import { cn } from "~/components/ui/utils";');
  });

  it("supports skip and overwrite-all without prompting for later files", async () => {
    const targetRoot = join(testDirectory, config.componentPath);
    mkdirSync(targetRoot, { recursive: true });
    const firstPath = join(targetRoot, "first.ts");
    const secondPath = join(targetRoot, "second.ts");
    writeFileSync(firstPath, "old first", { encoding: "utf8", flag: "w" });
    writeFileSync(secondPath, "old second", { encoding: "utf8", flag: "w" });
    const promptOverwrite = vi
      .fn<(filename: string) => Promise<"skip" | "all">>()
      .mockResolvedValueOnce("skip")
      .mockResolvedValueOnce("all");

    const result = await writeComponent(
      component([
        { content: "new first", path: "first.ts", type: "registry:ui" },
        { content: "new second", path: "second.ts", type: "registry:ui" },
        { content: "new third", path: "third.ts", type: "registry:ui" },
      ]),
      config,
      false,
      promptOverwrite
    );

    expect(promptOverwrite).toHaveBeenCalledTimes(2);
    expect(result).toEqual({
      skipped: ["first.ts"],
      written: ["second.ts", "third.ts"],
    });
    expect(readFileSync(firstPath, "utf8")).toBe("old first");
    expect(readFileSync(secondPath, "utf8")).toBe("new second");
  });

  it("overwrites one existing file without enabling overwrite-all", async () => {
    const targetRoot = join(testDirectory, config.componentPath);
    mkdirSync(targetRoot, { recursive: true });
    writeFileSync(join(targetRoot, "first.ts"), "old first", "utf8");
    writeFileSync(join(targetRoot, "second.ts"), "old second", "utf8");
    const promptOverwrite = vi.fn().mockResolvedValue("overwrite");

    await writeComponent(
      component([
        { content: "new first", path: "first.ts", type: "registry:ui" },
        { content: "new second", path: "second.ts", type: "registry:ui" },
      ]),
      config,
      false,
      promptOverwrite
    );

    expect(promptOverwrite).toHaveBeenCalledTimes(2);
    expect(readFileSync(join(targetRoot, "first.ts"), "utf8")).toBe(
      "new first"
    );
    expect(readFileSync(join(targetRoot, "second.ts"), "utf8")).toBe(
      "new second"
    );
  });

  it("rejects registry path traversal before writing outside the target", async () => {
    const outsidePath = join(testDirectory, "escaped.ts");

    await expect(
      writeComponent(
        component([
          {
            content: "unsafe",
            path: "../../../escaped.ts",
            type: "registry:ui",
          },
        ]),
        config,
        false,
        vi.fn()
      )
    ).rejects.toThrow("Invalid registry file path");
    expect(() => readFileSync(outsidePath, "utf8")).toThrow();
  });

  it("rejects a symlinked directory that escapes the component root", async () => {
    const targetRoot = join(testDirectory, config.componentPath);
    const outsideDirectory = join(testDirectory, "outside");
    mkdirSync(targetRoot, { recursive: true });
    mkdirSync(outsideDirectory);
    symlinkSync(outsideDirectory, join(targetRoot, "linked-directory"));

    await expect(
      writeComponent(
        component([
          {
            content: "unsafe",
            path: "linked-directory/escaped.ts",
            type: "registry:ui",
          },
        ]),
        config,
        true,
        vi.fn()
      )
    ).rejects.toThrow(SYMBOLIC_LINK_ERROR);
    expect(() =>
      readFileSync(join(outsideDirectory, "escaped.ts"), "utf8")
    ).toThrow();
  });

  it("rejects an existing target-file symlink before overwrite", async () => {
    const targetRoot = join(testDirectory, config.componentPath);
    const outsidePath = join(testDirectory, "outside.ts");
    mkdirSync(targetRoot, { recursive: true });
    writeFileSync(outsidePath, "outside", "utf8");
    symlinkSync(outsidePath, join(targetRoot, "linked-file.ts"));

    await expect(
      writeComponent(
        component([
          {
            content: "unsafe",
            path: "linked-file.ts",
            type: "registry:ui",
          },
        ]),
        config,
        true,
        vi.fn()
      )
    ).rejects.toThrow(SYMBOLIC_LINK_ERROR);
    expect(readFileSync(outsidePath, "utf8")).toBe("outside");
  });

  it("rejects a dangling target-file symlink before creating its destination", async () => {
    const targetRoot = join(testDirectory, config.componentPath);
    const outsidePath = join(testDirectory, "not-created.ts");
    mkdirSync(targetRoot, { recursive: true });
    symlinkSync(outsidePath, join(targetRoot, "dangling-file.ts"));

    await expect(
      writeComponent(
        component([
          {
            content: "unsafe",
            path: "dangling-file.ts",
            type: "registry:ui",
          },
        ]),
        config,
        true,
        vi.fn()
      )
    ).rejects.toThrow(SYMBOLIC_LINK_ERROR);
    expect(() => readFileSync(outsidePath, "utf8")).toThrow();
  });

  it("rejects a symlinked ancestor before creating a missing component root", async () => {
    const outsideDirectory = join(testDirectory, "outside-root");
    const linkedAncestor = join(testDirectory, "workspace-link");
    mkdirSync(outsideDirectory);
    symlinkSync(outsideDirectory, linkedAncestor);
    const missingRootConfig: ProjectConfig = {
      ...config,
      componentPath: "workspace-link/components/ui",
    };

    await expect(
      writeComponent(
        component([
          { content: "unsafe", path: "escaped.ts", type: "registry:ui" },
        ]),
        missingRootConfig,
        true,
        vi.fn()
      )
    ).rejects.toThrow(SYMBOLIC_LINK_ERROR);
    expect(() =>
      readFileSync(join(outsideDirectory, "components/ui/escaped.ts"), "utf8")
    ).toThrow();
  });

  it("does not follow a target swapped to a symlink at open time", async () => {
    const targetRoot = join(testDirectory, config.componentPath);
    const targetPath = join(targetRoot, "race.ts");
    const outsidePath = join(testDirectory, "outside-race.ts");
    mkdirSync(targetRoot, { recursive: true });
    writeFileSync(targetPath, "safe original", "utf8");
    writeFileSync(outsidePath, "outside original", "utf8");
    filesystemMocks.beforeOpen = () => {
      rmSync(targetPath);
      symlinkSync(outsidePath, targetPath);
    };

    await expect(
      writeComponent(
        component([
          { content: "unsafe", path: "race.ts", type: "registry:ui" },
        ]),
        config,
        true,
        vi.fn()
      )
    ).rejects.toThrow();
    expect(readFileSync(outsidePath, "utf8")).toBe("outside original");
  });

  it("rejects an existing target hard-linked to an external file", async () => {
    const targetRoot = join(testDirectory, config.componentPath);
    const targetPath = join(targetRoot, "hard-linked.ts");
    const outsidePath = join(testDirectory, "outside-hard-link.ts");
    mkdirSync(targetRoot, { recursive: true });
    writeFileSync(outsidePath, "outside original", "utf8");
    linkSync(outsidePath, targetPath);

    await expect(
      writeComponent(
        component([
          { content: "unsafe", path: "hard-linked.ts", type: "registry:ui" },
        ]),
        config,
        true,
        vi.fn()
      )
    ).rejects.toThrow(HARD_LINK_ERROR);
    expect(readFileSync(outsidePath, "utf8")).toBe("outside original");
  });

  it("closes the descriptor when hard-link validation fails after opening", async () => {
    const targetRoot = join(testDirectory, config.componentPath);
    const targetPath = join(targetRoot, "hard-link-race.ts");
    mkdirSync(targetRoot, { recursive: true });
    writeFileSync(targetPath, "safe original", "utf8");
    filesystemMocks.beforeOpen = () => {
      linkSync(targetPath, join(targetRoot, "hard-link-alias.ts"));
    };

    await expect(
      writeComponent(
        component([
          {
            content: "unsafe",
            path: "hard-link-race.ts",
            type: "registry:ui",
          },
        ]),
        config,
        true,
        vi.fn()
      )
    ).rejects.toThrow(HARD_LINK_ERROR);
    expect(filesystemMocks.closedDescriptors).toHaveLength(1);
    expect(readFileSync(targetPath, "utf8")).toBe("safe original");
  });

  it.each([
    ["npm", ["npm", "install", "motion"], ["npm", "install", "-D", "vitest"]],
    ["pnpm", ["pnpm", "add", "motion"], ["pnpm", "add", "-D", "vitest"]],
    ["yarn", ["yarn", "add", "motion"], ["yarn", "add", "-D", "vitest"]],
    ["bun", ["bun", "add", "motion"], ["bun", "add", "-d", "vitest"]],
  ] as const)(
    "installs runtime and development packages with %s flags",
    (packageManager, runtimeCommand, developmentCommand) => {
      processMocks.spawnSync.mockReturnValue({ status: 0 });

      expect(installDependencies(["motion"], ["vitest"], packageManager)).toBe(
        true
      );
      const [runtimeExecutable, ...runtimeArguments] = runtimeCommand;
      const [developmentExecutable, ...developmentArguments] =
        developmentCommand;
      expect(processMocks.spawnSync).toHaveBeenNthCalledWith(
        1,
        runtimeExecutable,
        runtimeArguments,
        { stdio: "pipe" }
      );
      expect(processMocks.spawnSync).toHaveBeenNthCalledWith(
        2,
        developmentExecutable,
        developmentArguments,
        { stdio: "pipe" }
      );
    }
  );

  it.each(["npm", "pnpm", "yarn", "bun"] as const)(
    "reports a %s development-install failure",
    (packageManager) => {
      processMocks.spawnSync
        .mockReturnValueOnce({ status: 0 })
        .mockReturnValueOnce({ status: 1 });

      expect(installDependencies(["motion"], ["vitest"], packageManager)).toBe(
        false
      );
      expect(processMocks.spawnSync).toHaveBeenCalledTimes(2);
    }
  );

  it.each(["npm", "pnpm", "yarn", "bun"] as const)(
    "does not spawn %s when dependency lists are empty",
    (packageManager) => {
      expect(installDependencies([], [], packageManager)).toBe(true);
      expect(processMocks.spawnSync).not.toHaveBeenCalled();
    }
  );
});
