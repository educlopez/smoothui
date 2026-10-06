import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import ToggleBase from "../toggle.base";
import ToggleRadix from "../toggle.radix";

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

const twins = [
  ["Base", ToggleBase],
  ["Radix", ToggleRadix],
] as const;

describe.each(twins)("Toggle %s hit area", (_name, Toggle) => {
  it("is 36px tall and carries the coarse-pointer hit area", () => {
    const { container } = render(<Toggle aria-label="Bold">B</Toggle>);
    const toggle = container.querySelector(
      '[data-slot="toggle"]'
    ) as HTMLElement;
    expect(toggle).not.toBeNull();
    expect(toggle.classList.contains("h-9")).toBe(true);
    for (const token of HIT_AREA) {
      expect(toggle.classList.contains(token)).toBe(true);
    }
    expect(toggle.classList.contains("relative")).toBe(true);
  });
});
