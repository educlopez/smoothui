import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import SmoothButtonBase from "../smooth-button.base";
import SmoothButtonRadix from "../smooth-button.radix";

const css = readFileSync(
  path.resolve(
    import.meta.dirname,
    "../../../../../apps/docs/app/smoothui.css"
  ),
  "utf8"
);

const twins = [
  ["Base", SmoothButtonBase],
  ["Radix", SmoothButtonRadix],
] as const;

const UNDERSIZED = ["xs", "sm", "icon-sm"] as const;
const SAFE = ["default", "lg", "icon", "icon-lg"] as const;

describe("hit-area utility", () => {
  it("grows the target to at least 40px on coarse pointers only", () => {
    const start = css.indexOf("@utility hit-area {");
    expect(start).toBeGreaterThan(-1);
    const block = css.slice(start, css.indexOf("\n}\n", start));
    expect(block).toContain("&::after");
    // Every declaration sits behind the coarse-pointer variant, so fine
    // pointers keep the look and the layout.
    const applied = block.match(/@apply ([^;]+);/)?.[1] ?? "";
    const classes = applied.split(" ");
    expect(classes.length).toBeGreaterThan(4);
    for (const token of classes) {
      expect(token.startsWith("pointer-coarse:")).toBe(true);
    }
    expect(classes).toContain("pointer-coarse:min-h-10");
    expect(classes).toContain("pointer-coarse:min-w-10");
  });
});

describe.each(twins)("SmoothButton %s hit area", (_name, SmoothButton) => {
  it.each(UNDERSIZED)(
    "the %s size carries the coarse-pointer hit area",
    (size) => {
      const { container } = render(<SmoothButton size={size}>Go</SmoothButton>);
      const classes = (container.querySelector("button") as HTMLElement)
        .classList;
      expect(classes.contains("hit-area")).toBe(true);
      // Reference: the host is positioned so the pseudo-element anchors to it.
      expect(classes.contains("relative")).toBe(true);
    }
  );

  it.each(SAFE)(
    "the %s size is already 40px or more and has no hit area",
    (size) => {
      const { container } = render(<SmoothButton size={size}>Go</SmoothButton>);
      const button = container.querySelector("button") as HTMLElement;
      expect(button.className).toMatch(/\b(?:h|size)-1[01]\b/);
      expect(button.classList.contains("hit-area")).toBe(false);
    }
  );
});
