import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getAllPackageNameMapping: vi.fn(),
  getBlockCatalog: vi.fn(),
  getComponentCatalog: vi.fn(),
  getPackage: vi.fn(),
}));

vi.mock("@docs/lib/component-catalog", () => ({
  getBlockCatalog: mocks.getBlockCatalog,
  getComponentCatalog: mocks.getComponentCatalog,
}));
vi.mock("@docs/lib/package", () => ({
  getAllPackageNameMapping: mocks.getAllPackageNameMapping,
  getPackage: mocks.getPackage,
}));

import { errorResponse, jsonResponse, OPTIONS } from "./_shared";
import {
  generateStaticParams as generateBlockParams,
  GET as getBlock,
} from "./blocks/[name]/route";
import { GET as listBlocks } from "./blocks/route";
import {
  generateStaticParams as generateComponentParams,
  GET as getComponent,
} from "./components/[name]/route";
import { GET as listComponents } from "./components/route";

const component = (name: string, overrides: Record<string, unknown> = {}) => ({
  animationType: "spring",
  category: "basic-ui",
  complexity: "simple",
  name,
  tags: ["overlay"],
  ...overrides,
});

const block = (name: string, overrides: Record<string, unknown> = {}) => ({
  blockType: "hero",
  name,
  tags: ["marketing"],
  ...overrides,
});

const detailContext = (name: string) => ({ params: Promise.resolve({ name }) });
const request = (path: string): NextRequest =>
  new NextRequest(`https://smoothui.dev${path}`);

const expectJsonContract = (response: Response, status = 200): void => {
  expect(response.status).toBe(status);
  expect(response.headers.get("content-type")).toContain("application/json");
  expect(response.headers.get("access-control-allow-origin")).toBe("*");
  expect(response.headers.get("access-control-allow-methods")).toBe(
    "GET, OPTIONS"
  );
  expect(response.headers.get("access-control-allow-headers")).toBe(
    "Content-Type"
  );
};

describe("v1 shared responses", () => {
  it("applies JSON and CORS headers to success and error responses", async () => {
    const success = jsonResponse({ ok: true });
    const failure = errorResponse("Nope", 422);

    expectJsonContract(success);
    expectJsonContract(failure, 422);
    await expect(success.json()).resolves.toEqual({ ok: true });
    await expect(failure.json()).resolves.toEqual({
      error: "Nope",
      status: 422,
    });
  });

  it("returns a bodyless CORS preflight response", async () => {
    const response = OPTIONS();

    expect(response.status).toBe(204);
    expect(response.headers.get("access-control-allow-origin")).toBe("*");
    expect(await response.text()).toBe("");
  });
});

describe.each([
  {
    catalogMock: mocks.getComponentCatalog,
    entity: component("dialog"),
    generateParams: generateComponentParams,
    get: getComponent,
    kind: "Component",
    responseKey: "component",
  },
  {
    catalogMock: mocks.getBlockCatalog,
    entity: block("hero-1"),
    generateParams: generateBlockParams,
    get: getBlock,
    kind: "Block",
    responseKey: "block",
  },
])("v1 $responseKey detail", (contract) => {
  beforeEach(() => {
    vi.clearAllMocks();
    contract.catalogMock.mockResolvedValue([contract.entity]);
    mocks.getAllPackageNameMapping.mockResolvedValue(
      new Map([[contract.entity.name, `smoothui/${contract.entity.name}`]])
    );
    mocks.getPackage.mockResolvedValue({
      files: [
        { content: "export const first = true;", path: "first.ts" },
        { content: "export const second = true;", path: "second.ts" },
      ],
    });
  });

  it("returns the catalog entity without loading source by default", async () => {
    const response = await contract.get(
      request(`/api/v1/${contract.responseKey}s/${contract.entity.name}`),
      detailContext(contract.entity.name)
    );

    expectJsonContract(response);
    await expect(response.json()).resolves.toEqual({
      [contract.responseKey]: contract.entity,
    });
    expect(mocks.getAllPackageNameMapping).not.toHaveBeenCalled();
    expect(mocks.getPackage).not.toHaveBeenCalled();
  });

  it("returns a standardised 404", async () => {
    const response = await contract.get(
      request(`/api/v1/${contract.responseKey}s/missing`),
      detailContext("missing")
    );

    expectJsonContract(response, 404);
    await expect(response.json()).resolves.toEqual({
      error: `${contract.kind} "missing" not found`,
      status: 404,
    });
  });

  it("combines package files when include=source is requested", async () => {
    const response = await contract.get(
      request(
        `/api/v1/${contract.responseKey}s/${contract.entity.name}?include=source`
      ),
      detailContext(contract.entity.name)
    );

    await expect(response.json()).resolves.toEqual({
      [contract.responseKey]: contract.entity,
      source:
        "// --- first.ts ---\nexport const first = true;\n\n// --- second.ts ---\nexport const second = true;",
    });
  });

  it("omits source when mapping is missing or retrieval fails", async () => {
    mocks.getAllPackageNameMapping.mockResolvedValueOnce(new Map());
    const missingMapping = await contract.get(
      request(
        `/api/v1/${contract.responseKey}s/${contract.entity.name}?include=source`
      ),
      detailContext(contract.entity.name)
    );
    mocks.getPackage.mockRejectedValueOnce(new Error("filesystem unavailable"));
    const failedSource = await contract.get(
      request(
        `/api/v1/${contract.responseKey}s/${contract.entity.name}?include=source`
      ),
      detailContext(contract.entity.name)
    );

    await expect(missingMapping.json()).resolves.toEqual({
      [contract.responseKey]: contract.entity,
    });
    await expect(failedSource.json()).resolves.toEqual({
      [contract.responseKey]: contract.entity,
    });
  });

  it("generates one static parameter per public catalog entry", async () => {
    contract.catalogMock.mockResolvedValue([
      contract.entity,
      { ...contract.entity, name: "another" },
    ]);

    await expect(contract.generateParams()).resolves.toEqual([
      { name: contract.entity.name },
      { name: "another" },
    ]);
  });
});

describe("v1 catalogs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("filters components and clamps pagination size", async () => {
    mocks.getComponentCatalog.mockResolvedValue([
      component("dialog"),
      component("ai-orb", {
        animationType: "tween",
        category: "ai",
        complexity: "complex",
        tags: ["agent"],
      }),
    ]);

    const response = await listComponents(
      request(
        "/api/v1/components?category=ai&complexity=complex&animationType=tween&tag=AGENT&pageSize=999"
      )
    );

    expectJsonContract(response);
    await expect(response.json()).resolves.toMatchObject({
      data: [expect.objectContaining({ name: "ai-orb" })],
      page: 1,
      pageSize: 100,
      total: 1,
      totalPages: 1,
    });
  });

  it("filters and paginates blocks", async () => {
    mocks.getBlockCatalog.mockResolvedValue([
      block("hero-1"),
      block("footer-1", { blockType: "footer", tags: ["navigation"] }),
      block("footer-2", { blockType: "footer", tags: ["navigation"] }),
    ]);

    const response = await listBlocks(
      request(
        "/api/v1/blocks?blockType=footer&tag=NAVIGATION&page=2&pageSize=1"
      )
    );

    expectJsonContract(response);
    await expect(response.json()).resolves.toMatchObject({
      data: [expect.objectContaining({ name: "footer-2" })],
      page: 2,
      pageSize: 1,
      total: 2,
      totalPages: 2,
    });
  });

  it.each([
    ["malformed", "page=wat&pageSize=nope", 1, 50, 3],
    ["fractional", "page=2.5&pageSize=2.5", 1, 50, 3],
    ["zero", "page=0&pageSize=0", 1, 1, 1],
    ["negative", "page=-3&pageSize=-9", 1, 1, 1],
    ["non-finite", "page=Infinity&pageSize=Infinity", 1, 50, 3],
  ] as const)(
    "normalizes %s component pagination",
    async (_case, query, expectedPage, expectedPageSize, expectedDataLength) => {
      mocks.getComponentCatalog.mockResolvedValue([
        component("first"),
        component("second"),
        component("third"),
      ]);

      const response = await listComponents(
        request(`/api/v1/components?${query}`)
      );
      const body = await response.json();

      expect(body).toMatchObject({
        page: expectedPage,
        pageSize: expectedPageSize,
        total: 3,
      });
      expect(body.data).toHaveLength(expectedDataLength);
      expect(Number.isFinite(body.page)).toBe(true);
      expect(Number.isFinite(body.pageSize)).toBe(true);
      expect(Number.isFinite(body.totalPages)).toBe(true);
    }
  );

  it.each([
    ["malformed", "page=wat&pageSize=nope", 1, 50, 3],
    ["fractional", "page=2.5&pageSize=2.5", 1, 50, 3],
    ["zero", "page=0&pageSize=0", 1, 1, 1],
    ["negative", "page=-3&pageSize=-9", 1, 1, 1],
    ["non-finite", "page=Infinity&pageSize=Infinity", 1, 50, 3],
  ] as const)(
    "normalizes %s block pagination",
    async (_case, query, expectedPage, expectedPageSize, expectedDataLength) => {
      mocks.getBlockCatalog.mockResolvedValue([
        block("first"),
        block("second"),
        block("third"),
      ]);

      const response = await listBlocks(request(`/api/v1/blocks?${query}`));
      const body = await response.json();

      expect(body).toMatchObject({
        page: expectedPage,
        pageSize: expectedPageSize,
        total: 3,
      });
      expect(body.data).toHaveLength(expectedDataLength);
      expect(Number.isFinite(body.page)).toBe(true);
      expect(Number.isFinite(body.pageSize)).toBe(true);
      expect(Number.isFinite(body.totalPages)).toBe(true);
    }
  );
});
