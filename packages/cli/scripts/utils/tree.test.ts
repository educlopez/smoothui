import { beforeEach, describe, expect, it, vi } from "vitest";
import type { RegistryItem } from "../types.js";

const registryMocks = vi.hoisted(() => ({
  fetchComponent: vi.fn(),
}));

vi.mock("./registry.js", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./registry.js")>();
  return { ...actual, fetchComponent: registryMocks.fetchComponent };
});

import { collectNpmDeps, flattenTree, resolveTree } from "./tree.js";

const item = (
  name: string,
  options: Partial<RegistryItem> = {}
): RegistryItem => ({
  files: [],
  name,
  type: "registry:ui",
  ...options,
});

describe("dependency trees", () => {
  beforeEach(() => {
    registryMocks.fetchComponent.mockReset();
  });

  it("resolves SmoothUI dependencies once and ignores external registries", async () => {
    const components = new Map([
      [
        "root",
        item("root", {
          registryDependencies: [
            "https://smoothui.dev/r/shared.json",
            "https://ui.shadcn.com/r/button.json",
            "https://smoothui.dev/r/shared.json",
          ],
        }),
      ],
      [
        "shared",
        item("shared", {
          registryDependencies: ["https://smoothui.dev/r/root.json"],
        }),
      ],
    ]);
    registryMocks.fetchComponent.mockImplementation((name: string) => {
      const component = components.get(name);
      if (!component) {
        throw new Error(`Missing fixture: ${name}`);
      }
      return Promise.resolve(component);
    });

    const tree = await resolveTree("root");

    expect(flattenTree(tree).map(({ name }) => name)).toEqual([
      "root",
      "shared",
    ]);
    expect(registryMocks.fetchComponent).toHaveBeenCalledTimes(2);
    expect(registryMocks.fetchComponent).not.toHaveBeenCalledWith("button");
  });

  it("deduplicates packages and promotes a package to a regular dependency", () => {
    const result = collectNpmDeps([
      item("first", {
        dependencies: ["motion", "react", "shared-package"],
        devDependencies: ["vitest", "shared-package", "typescript"],
      }),
      item("second", {
        dependencies: ["motion"],
        devDependencies: ["vitest"],
      }),
    ]);

    expect(result).toEqual({
      dependencies: ["motion", "shared-package"],
      devDependencies: ["vitest"],
    });
  });
});
