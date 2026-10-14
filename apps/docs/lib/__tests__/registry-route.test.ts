import { readFileSync } from "node:fs";
import { join } from "node:path";
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const NOT_FOUND_CALL = /notFound\s*\(/;

const mocks = vi.hoisted(() => ({
  getAllPackageNameMapping: vi.fn(),
  getAllPackageNames: vi.fn(),
  getCustomTheme: vi.fn(),
  getPackage: vi.fn(),
  getSkill: vi.fn(),
  getTheme: vi.fn(),
  getTokensItem: vi.fn(),
}));

vi.mock("@docs/lib/package", () => ({
  getAllPackageNameMapping: mocks.getAllPackageNameMapping,
  getAllPackageNames: mocks.getAllPackageNames,
  getPackage: mocks.getPackage,
}));
vi.mock("@docs/lib/registry-skill", () => ({
  getSkill: mocks.getSkill,
  SKILL_ITEM_NAME: "skill",
}));
vi.mock("@docs/lib/registry-themes", () => ({
  getAllThemeNames: () => [],
  getTheme: mocks.getTheme,
}));
vi.mock("@docs/lib/registry-tokens", () => ({
  getTokensItem: mocks.getTokensItem,
  TOKENS_ITEM_NAME: "tokens",
}));
vi.mock("@docs/lib/studio-preset", () => ({
  getCustomTheme: mocks.getCustomTheme,
}));

import { GET as getStyled } from "../../app/r/[name]/[component]/route";
import { GET } from "../../app/r/[name]/route";

const request = () =>
  new NextRequest("https://smoothui.dev/r/basic-modal.json");
const context = (name: string) => ({ params: Promise.resolve({ name }) });
const styleContext = (style: string, component: string) => ({
  params: Promise.resolve({ component, name: style }),
});

describe("/r/{name}.json", () => {
  beforeEach(() => {
    mocks.getAllPackageNameMapping.mockReset();
    mocks.getPackage.mockReset();
    mocks.getTheme.mockReset();
    mocks.getCustomTheme.mockReset();
    mocks.getAllPackageNameMapping.mockResolvedValue(
      new Map([
        ["dialog", "smoothui/components/dialog"],
        ["tabs", "smoothui/components/tabs"],
      ])
    );
    mocks.getPackage.mockResolvedValue({ name: "dialog", type: "registry:ui" });
    mocks.getTheme.mockReturnValue(undefined);
    mocks.getCustomTheme.mockReturnValue(undefined);
  });

  it("serves the new package JSON under the old registry name", async () => {
    const response = await GET(request(), context("basic-modal.json"));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ name: "dialog" });
    expect(mocks.getPackage).toHaveBeenCalledWith(
      "smoothui/components/dialog",
      null
    );
  });

  it("returns 404 for an unknown name, never 500", async () => {
    const response = await GET(request(), context("not-a-package.json"));

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      error: "Package not found",
    });
    expect(mocks.getPackage).not.toHaveBeenCalled();
  });

  it("returns 404 for /r/index.json", async () => {
    const response = await GET(request(), context("index.json"));

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      error: "Package not found",
    });
  });

  it("returns 500 when packaging fails, not a swallowed notFound", async () => {
    mocks.getPackage.mockRejectedValueOnce(new Error("filesystem unavailable"));

    const response = await GET(request(), context("dialog.json"));

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toMatchObject({
      error: "Failed to get package",
    });
  });
});

describe("/r/{style}/{name}.json", () => {
  beforeEach(() => {
    mocks.getAllPackageNameMapping.mockReset();
    mocks.getPackage.mockReset();
    mocks.getAllPackageNameMapping.mockResolvedValue(
      new Map([["dialog", "smoothui/components/dialog"]])
    );
    mocks.getPackage.mockResolvedValue({ name: "dialog", type: "registry:ui" });
  });

  it("passes a known style through to getPackage", async () => {
    const response = await getStyled(
      request(),
      styleContext("radix-nova", "dialog.json")
    );

    expect(response.status).toBe(200);
    expect(mocks.getPackage).toHaveBeenCalledWith(
      "smoothui/components/dialog",
      "radix-nova"
    );
  });

  it("returns 404 for an unknown style, never 500", async () => {
    const response = await getStyled(
      request(),
      styleContext("not-a-style", "dialog.json")
    );

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      error: "Package not found",
    });
    expect(mocks.getPackage).not.toHaveBeenCalled();
  });

  it("returns 404 for an unknown component, never 500", async () => {
    const response = await getStyled(
      request(),
      styleContext("base-nova", "not-a-package.json")
    );

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      error: "Package not found",
    });
    expect(mocks.getPackage).not.toHaveBeenCalled();
  });
});

describe("registry routes do not swallow notFound()", () => {
  it("never calls notFound() inside a try/catch", () => {
    const routesDir = join(import.meta.dirname, "../../app/r");
    const sources = [
      readFileSync(join(routesDir, "[name]/route.ts"), "utf-8"),
      readFileSync(join(routesDir, "[name]/[component]/route.ts"), "utf-8"),
      readFileSync(
        join(import.meta.dirname, "../registry-response.ts"),
        "utf-8"
      ),
    ];

    for (const source of sources) {
      expect(source).not.toMatch(NOT_FOUND_CALL);
    }
  });
});
