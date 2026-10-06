import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import SmoothButtonBase from "../smooth-button.base";
import SmoothButtonRadix from "../smooth-button.radix";

const twins = [
  ["Base", SmoothButtonBase],
  ["Radix", SmoothButtonRadix],
] as const;

const UNDERSIZED = ["xs", "sm", "icon-sm"] as const;
const SAFE = ["default", "lg", "icon", "icon-lg"] as const;

/** Every class of the enlarged target sits behind the coarse-pointer variant
 * on the ::after pseudo-element, so fine pointers keep the look and the layout.
 * The classes live in the markup, not in a shared @apply: an unknown variant in
 * shared CSS aborts a consumer's stylesheet on Tailwind older than 4.1. */
const HIT_AREA = [
  "pointer-coarse:after:absolute",
  "pointer-coarse:after:top-1/2",
  "pointer-coarse:after:left-1/2",
  "pointer-coarse:after:size-full",
  "pointer-coarse:after:min-h-10",
  "pointer-coarse:after:min-w-10",
  "pointer-coarse:after:-translate-1/2",
  "pointer-coarse:after:content-['']",
];

describe.each(twins)("SmoothButton %s hit area", (_name, SmoothButton) => {
  it.each(UNDERSIZED)(
    "the %s size carries the coarse-pointer hit area",
    (size) => {
      const { container } = render(<SmoothButton size={size}>Go</SmoothButton>);
      const classes = (container.querySelector("button") as HTMLElement)
        .classList;
      for (const token of HIT_AREA) {
        expect(classes.contains(token)).toBe(true);
      }
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
      expect(button.className).not.toContain("pointer-coarse:after:");
    }
  );
});
