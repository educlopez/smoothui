import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const GITHUB_REPO_URL = "https://api.github.com/repos/educlopez/smoothui";

const githubPayload = {
  forks_count: 12,
  full_name: "educlopez/smoothui",
  html_url: "https://github.com/educlopez/smoothui",
  stargazers_count: 345,
};

const expectedStats = {
  forks: 12,
  name: "educlopez/smoothui",
  stars: 345,
  url: "https://github.com/educlopez/smoothui",
};

const loadRoute = async () => {
  vi.resetModules();
  return await import("../../app/api/github/route");
};

describe("/api/github", () => {
  const originalFetch = globalThis.fetch;
  const originalToken = process.env.GITHUB_TOKEN;

  beforeEach(() => {
    process.env.GITHUB_TOKEN = "should-not-be-sent";
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    if (originalToken === undefined) {
      Reflect.deleteProperty(process.env, "GITHUB_TOKEN");
    } else {
      process.env.GITHUB_TOKEN = originalToken;
    }
  });

  it("returns pinned repo stats and ignores owner/repo query params", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      json: async () => githubPayload,
      ok: true,
    });
    globalThis.fetch = fetchMock as typeof fetch;

    const { GET } = await loadRoute();
    const response = await GET();

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual(expectedStats);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [url, init] = fetchMock.mock.calls[0] as [
      string,
      RequestInit & { next?: { revalidate?: number } },
    ];
    expect(url).toBe(GITHUB_REPO_URL);
    expect(init.next).toEqual({ revalidate: 3600 });
    expect(new Headers(init.headers).get("Accept")).toBe(
      "application/vnd.github.v3+json"
    );
    expect(new Headers(init.headers).has("Authorization")).toBe(false);
  });

  it("returns a generic error without GitHub details when the first fetch fails", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      json: async () => ({ message: "API rate limit exceeded for user" }),
      ok: false,
      status: 403,
      statusText: "Forbidden",
    }) as typeof fetch;

    const { GET } = await loadRoute();
    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body).toEqual({ error: "Failed to fetch GitHub data" });
    expect(JSON.stringify(body)).not.toContain("rate limit");
    expect(JSON.stringify(body)).not.toContain("details");
  });

  it("serves the last successful payload when GitHub later fails", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        json: async () => githubPayload,
        ok: true,
      })
      .mockResolvedValueOnce({
        json: async () => ({ message: "Bad credentials" }),
        ok: false,
        status: 401,
      });
    globalThis.fetch = fetchMock as typeof fetch;

    const { GET } = await loadRoute();
    const first = await GET();
    const second = await GET();

    expect(first.status).toBe(200);
    expect(second.status).toBe(200);
    await expect(second.json()).resolves.toEqual(expectedStats);
  });
});
