import { describe, expect, it } from "vitest";
import {
  DELETED_TO_PRIMITIVES,
  docBasicDirectRedirects,
  docsComponentRedirects,
  LEGACY_REGISTRY_NAMES,
  REGISTRY_ALIASES,
  resolveRedirectChain,
  resolveRegistryName,
} from "../legacy-registry";

const REQUIRED_ALIASES: Record<string, string> = {
  "animated-input": "float-input",
  "animated-number-input": "digit-roll",
  "animated-o-t-p-input": "otp-slots",
  "animated-progress-bar": "progress",
  "animated-tabs": "tabs",
  "animated-toggle": "morph-toggle",
  "animated-tooltip": "tooltip",
  "basic-accordion": "accordion",
  "basic-dropdown": "dropdown-menu",
  "basic-modal": "dialog",
  "basic-toast": "toast",
  "country-dialog": "country-picker",
  "notification-badge": "count-badge",
  "searchable-dropdown": "combobox",
  "skeleton-loader": "content-skeleton",
};

describe("registry aliases", () => {
  it("maps every deleted or renamed package to its current name", () => {
    for (const [from, to] of Object.entries(REQUIRED_ALIASES)) {
      expect(REGISTRY_ALIASES[from]).toBe(to);
      expect(resolveRegistryName(from)).toBe(to);
    }
    expect(LEGACY_REGISTRY_NAMES).toEqual(
      expect.arrayContaining(Object.keys(REQUIRED_ALIASES))
    );
  });

  it("leaves unknown and current names unchanged", () => {
    expect(resolveRegistryName("dialog")).toBe("dialog");
    expect(resolveRegistryName("index")).toBe("index");
    expect(resolveRegistryName("not-a-package")).toBe("not-a-package");
  });
});

describe("docs redirects", () => {
  const redirects = [
    ...docsComponentRedirects(),
    ...docBasicDirectRedirects(),
    {
      destination: "/docs/components/:component",
      permanent: true as const,
      source: "/doc/basic/:component",
    },
  ];

  it("sends matrix-card to the components index", () => {
    expect(
      resolveRedirectChain("/docs/components/matrix-card", redirects)
    ).toEqual({ hops: 1, url: "/docs/components" });
  });

  it("sends /doc/basic/{old} to the final page in one hop", () => {
    expect(resolveRedirectChain("/doc/basic/basic-modal", redirects)).toEqual({
      hops: 1,
      url: "/docs/primitives/dialog",
    });
    expect(
      resolveRedirectChain("/doc/basic/skeleton-loader", redirects)
    ).toEqual({ hops: 1, url: "/docs/components/content-skeleton" });
    expect(resolveRedirectChain("/doc/basic/accordion", redirects)).toEqual({
      hops: 1,
      url: "/docs/primitives/accordion",
    });
  });

  it("does not chain any configured source through another redirect", () => {
    const sources = redirects.map((entry) => entry.source);
    for (const source of sources) {
      if (source.includes(":")) {
        continue;
      }
      const { hops } = resolveRedirectChain(source, redirects);
      expect(hops, source).toBe(1);
    }

    for (const [from] of DELETED_TO_PRIMITIVES) {
      const { hops } = resolveRedirectChain(`/doc/basic/${from}`, redirects);
      expect(hops, `/doc/basic/${from}`).toBe(1);
    }
  });
});
