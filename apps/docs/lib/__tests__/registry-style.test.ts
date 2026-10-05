import { describe, expect, it } from "vitest";
import {
  isBaseStyle,
  isDualPrimitivePackage,
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
