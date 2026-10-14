import { describe, expect, it } from "vitest";
import {
  isBaseStyle,
  isDualPrimitivePackage,
  isKnownRegistryStyle,
  registryDependencyUrl,
  resolvePrimitiveStyle,
  twinFileName,
} from "../registry-style";

describe("registry-style", () => {
  it("treats base-* styles as Base UI", () => {
    expect(isBaseStyle("base-nova")).toBe(true);
    expect(isBaseStyle("base-vega")).toBe(true);
    expect(isBaseStyle("radix-nova")).toBe(false);
    expect(isBaseStyle("new-york")).toBe(false);
    expect(isBaseStyle(null)).toBe(false);
  });

  it("defaults plain URLs (no style) to the Base twin", () => {
    expect(resolvePrimitiveStyle(null)).toBe("base");
    expect(resolvePrimitiveStyle(undefined)).toBe("base");
    expect(resolvePrimitiveStyle("")).toBe("base");
    expect(resolvePrimitiveStyle("base-nova")).toBe("base");
    expect(resolvePrimitiveStyle("radix-nova")).toBe("radix");
    expect(resolvePrimitiveStyle("new-york")).toBe("radix");
  });

  it("names twin source files from the package slug", () => {
    expect(twinFileName("checkbox", "base")).toBe("checkbox.base.tsx");
    expect(twinFileName("dialog", "radix")).toBe("dialog.radix.tsx");
  });

  it("detects dual-primitive packages", () => {
    expect(
      isDualPrimitivePackage([
        "index.tsx",
        "checkbox.base.tsx",
        "checkbox.radix.tsx",
      ])
    ).toBe(true);
    expect(isDualPrimitivePackage(["index.tsx"])).toBe(false);
  });
});

/**
 * `style` enum from https://ui.shadcn.com/schema.json — 2 legacy names plus
 * the 8 visual presets for each of radix, base, and aria.
 */
const OFFICIAL_SHADCN_STYLES = [
  "default",
  "new-york",
  "radix-vega",
  "radix-nova",
  "radix-maia",
  "radix-lyra",
  "radix-mira",
  "radix-luma",
  "radix-sera",
  "radix-rhea",
  "base-vega",
  "base-nova",
  "base-maia",
  "base-lyra",
  "base-mira",
  "base-luma",
  "base-sera",
  "base-rhea",
  "aria-vega",
  "aria-nova",
  "aria-maia",
  "aria-lyra",
  "aria-mira",
  "aria-luma",
  "aria-sera",
  "aria-rhea",
] as const;

describe("known registry styles", () => {
  it("accepts every style in the official shadcn schema", () => {
    expect(OFFICIAL_SHADCN_STYLES).toHaveLength(26);
    for (const style of OFFICIAL_SHADCN_STYLES) {
      expect(isKnownRegistryStyle(style), style).toBe(true);
    }
  });

  it("maps official styles to the Base or Radix twin", () => {
    for (const style of OFFICIAL_SHADCN_STYLES) {
      const expected = style.startsWith("base-") ? "base" : "radix";
      expect(resolvePrimitiveStyle(style), style).toBe(expected);
    }
  });

  it("rejects names that are not a base-*, radix-*, aria-*, default, or new-york", () => {
    expect(isKnownRegistryStyle("not-a-style")).toBe(false);
    expect(isKnownRegistryStyle("radix")).toBe(false);
    expect(isKnownRegistryStyle("base")).toBe(false);
    expect(isKnownRegistryStyle("")).toBe(false);
  });
});

describe("registryDependencyUrl", () => {
  it("keeps the flat Base URL when the request has no style", () => {
    expect(registryDependencyUrl("dialog")).toBe(
      "https://smoothui.dev/r/dialog.json"
    );
    expect(registryDependencyUrl("dialog", null)).toBe(
      "https://smoothui.dev/r/dialog.json"
    );
    expect(registryDependencyUrl("smooth-button", "")).toBe(
      "https://smoothui.dev/r/smooth-button.json"
    );
  });

  it("prefixes component dependencies with the request style", () => {
    expect(registryDependencyUrl("dialog", "radix-nova")).toBe(
      "https://smoothui.dev/r/radix-nova/dialog.json"
    );
    expect(registryDependencyUrl("toggle", "new-york")).toBe(
      "https://smoothui.dev/r/new-york/toggle.json"
    );
    expect(registryDependencyUrl("avatar", "base-nova")).toBe(
      "https://smoothui.dev/r/base-nova/avatar.json"
    );
    expect(registryDependencyUrl("smooth-button", "radix-nova")).toBe(
      "https://smoothui.dev/r/radix-nova/smooth-button.json"
    );
  });

  it("keeps data and tokens on the flat URL even when a style is set", () => {
    expect(registryDependencyUrl("data", "radix-nova")).toBe(
      "https://smoothui.dev/r/data.json"
    );
    expect(registryDependencyUrl("tokens", "new-york")).toBe(
      "https://smoothui.dev/r/tokens.json"
    );
  });
});
