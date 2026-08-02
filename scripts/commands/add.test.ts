import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { RegistryItem, TreeNode } from "../types.js";

const mocks = vi.hoisted(() => ({
  bar: vi.fn(),
  cancelToken: Symbol("cancel"),
  confirm: vi.fn(),
  detectConfig: vi.fn(),
  done: vi.fn(),
  error: vi.fn(),
  getAvailableComponents: vi.fn(),
  installDependencies: vi.fn(),
  printTree: vi.fn(),
  resolveTree: vi.fn(),
  searchMultiselect: vi.fn(),
  select: vi.fn(),
  spinnerStart: vi.fn(),
  spinnerStop: vi.fn(),
  success: vi.fn(),
  writeComponent: vi.fn(),
}));

vi.mock("@clack/prompts", () => ({
  confirm: mocks.confirm,
  isCancel: (value: unknown) => value === mocks.cancelToken,
  select: mocks.select,
  spinner: () => ({ start: mocks.spinnerStart, stop: mocks.spinnerStop }),
}));

vi.mock("../prompts/search-multiselect.js", () => ({
  searchMultiselect: mocks.searchMultiselect,
}));

vi.mock("../utils/colors.js", () => ({
  active: vi.fn(),
  bar: mocks.bar,
  done: mocks.done,
  error: mocks.error,
  header: vi.fn(),
  success: mocks.success,
}));

vi.mock("../utils/detect.js", () => ({ detectConfig: mocks.detectConfig }));
vi.mock("../utils/install.js", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../utils/install.js")>();
  return {
    ...actual,
    installDependencies: mocks.installDependencies,
    writeComponent: mocks.writeComponent,
  };
});
vi.mock("../utils/registry.js", () => ({
  getAvailableComponents: mocks.getAvailableComponents,
}));
vi.mock("../utils/tree.js", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../utils/tree.js")>();
  return {
    ...actual,
    printTree: mocks.printTree,
    resolveTree: mocks.resolveTree,
  };
});

import { add } from "./add.js";

const item = (
  name: string,
  options: Partial<RegistryItem> = {}
): RegistryItem => ({ files: [], name, type: "registry:ui", ...options });

const tree = (
  component: RegistryItem,
  children: TreeNode[] = []
): TreeNode => ({
  children,
  component,
});

describe("add command", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "log").mockImplementation(() => undefined);
    mocks.detectConfig.mockReturnValue({
      alias: "@",
      componentPath: "components/ui",
      packageManager: "pnpm",
    });
    mocks.confirm.mockResolvedValue(true);
    mocks.installDependencies.mockReturnValue(true);
    mocks.writeComponent.mockResolvedValue({ skipped: [], written: [] });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("stops cleanly when the interactive picker is cancelled", async () => {
    mocks.getAvailableComponents.mockResolvedValue(["dialog"]);
    mocks.searchMultiselect.mockResolvedValue(null);

    await add([], {});

    expect(mocks.done).toHaveBeenCalledWith("No components selected.");
    expect(mocks.resolveTree).not.toHaveBeenCalled();
    expect(mocks.writeComponent).not.toHaveBeenCalled();
  });

  it("resolves explicit components once and deduplicates their packages", async () => {
    const shared = item("shared", {
      dependencies: ["motion"],
      devDependencies: ["vitest"],
    });
    const dialog = item("dialog", { dependencies: ["motion"] });
    mocks.resolveTree.mockImplementation((name: string) => {
      if (name === "dialog") {
        return Promise.resolve(tree(dialog, [tree(shared)]));
      }
      return Promise.resolve(tree(shared));
    });
    mocks.writeComponent.mockResolvedValue({
      skipped: [],
      written: ["index.tsx"],
    });

    await add(["dialog", "shared"], { path: "src/ui" });

    expect(mocks.resolveTree).toHaveBeenCalledTimes(1);
    expect(mocks.writeComponent).toHaveBeenCalledTimes(2);
    expect(mocks.writeComponent).toHaveBeenCalledWith(
      dialog,
      expect.objectContaining({ componentPath: "src/ui" }),
      false,
      expect.any(Function)
    );
    expect(mocks.installDependencies).toHaveBeenCalledWith(
      ["motion"],
      ["vitest"],
      "pnpm"
    );
  });

  it("does not confirm, write, or install after dependency resolution fails", async () => {
    mocks.resolveTree.mockRejectedValue(new Error("registry unavailable"));

    await add(["dialog"], {});

    expect(mocks.error).toHaveBeenCalledWith(
      "Failed to resolve dialog: registry unavailable"
    );
    expect(mocks.confirm).not.toHaveBeenCalled();
    expect(mocks.writeComponent).not.toHaveBeenCalled();
    expect(mocks.installDependencies).not.toHaveBeenCalled();
  });

  it.each([false, mocks.cancelToken])(
    "does not write when confirmation returns %s",
    async (confirmation) => {
      mocks.resolveTree.mockResolvedValue(tree(item("dialog")));
      mocks.confirm.mockResolvedValue(confirmation);

      await add(["dialog"], {});

      expect(mocks.done).toHaveBeenCalledWith("Installation cancelled.");
      expect(mocks.writeComponent).not.toHaveBeenCalled();
    }
  );

  it("passes overwrite-all across components", async () => {
    const first = item("first");
    const second = item("second");
    mocks.resolveTree
      .mockResolvedValueOnce(tree(first))
      .mockResolvedValueOnce(tree(second));
    mocks.select.mockResolvedValue("all");
    mocks.writeComponent.mockImplementation(
      async (
        _item: RegistryItem,
        _config: unknown,
        _overwriteAll: boolean,
        promptOverwrite: (name: string) => Promise<string>
      ) => {
        if (_item.name === "first") {
          await promptOverwrite("index.tsx");
        }
        return { skipped: [], written: [] };
      }
    );

    await add(["first", "second"], {});

    expect(mocks.writeComponent).toHaveBeenNthCalledWith(
      2,
      second,
      expect.any(Object),
      true,
      expect.any(Function)
    );
  });

  it.each([
    [
      "npm",
      "Run manually: npm install motion",
      "Run manually: npm install -D vitest",
    ],
    [
      "pnpm",
      "Run manually: pnpm add motion",
      "Run manually: pnpm add -D vitest",
    ],
    [
      "yarn",
      "Run manually: yarn add motion",
      "Run manually: yarn add -D vitest",
    ],
    ["bun", "Run manually: bun add motion", "Run manually: bun add -d vitest"],
  ] as const)(
    "prints exact %s manual commands when installation fails",
    async (packageManager, runtimeCommand, developmentCommand) => {
      mocks.detectConfig.mockReturnValue({
        alias: "@",
        componentPath: "components/ui",
        packageManager,
      });
      mocks.resolveTree.mockResolvedValue(
        tree(
          item("dialog", {
            dependencies: ["motion"],
            devDependencies: ["vitest"],
          })
        )
      );
      mocks.installDependencies.mockReturnValue(false);

      await add(["dialog"], {});

      expect(mocks.bar).toHaveBeenCalledWith(runtimeCommand);
      expect(mocks.bar).toHaveBeenCalledWith(developmentCommand);
      expect(mocks.spinnerStop).toHaveBeenCalledWith(
        "Failed to install dependencies"
      );
    }
  );
});
