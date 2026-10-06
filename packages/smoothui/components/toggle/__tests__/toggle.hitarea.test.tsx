import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import ToggleBase from "../toggle.base";
import ToggleRadix from "../toggle.radix";

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
    expect(toggle.classList.contains("hit-area")).toBe(true);
    expect(toggle.classList.contains("relative")).toBe(true);
  });
});
