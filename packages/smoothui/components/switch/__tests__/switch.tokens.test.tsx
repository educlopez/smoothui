import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import SwitchBase from "../switch.base";
import SwitchRadix from "../switch.radix";

const twins = [
  ["Base", SwitchBase],
  ["Radix", SwitchRadix],
] as const;

const thumbOf = (container: HTMLElement) =>
  container.querySelector('[data-slot="switch-thumb"]') as HTMLElement;

describe.each(twins)("Switch %s thumb tokens", (_name, Switch) => {
  it("fills the checked thumb with the thumb token", () => {
    const { container } = render(<Switch aria-label="x" defaultChecked />);
    const thumb = thumbOf(container);
    expect(thumb).not.toBeNull();
    expect(thumb.classList.contains("bg-thumb")).toBe(true);
    expect(thumb.className).not.toContain("bg-white");
  });

  it("fills the disabled thumb with the thumb token", () => {
    const { container } = render(<Switch aria-label="x" disabled />);
    const thumb = thumbOf(container);
    expect(thumb).not.toBeNull();
    expect(thumb.classList.contains("bg-thumb")).toBe(true);
    expect(thumb.className).not.toContain("bg-white");
  });
});
