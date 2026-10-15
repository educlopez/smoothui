import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { render, screen } from "../../../test-utils/render";
import CheckboxBase from "../checkbox.base";
import CheckboxRadix from "../checkbox.radix";

const isOn = (el: HTMLElement) =>
  el.getAttribute("aria-checked") === "true" ||
  el.hasAttribute("data-checked") ||
  el.getAttribute("data-state") === "checked";

describe.each([
  ["Base", CheckboxBase],
  ["Radix", CheckboxRadix],
] as const)("Checkbox (%s) uncontrolled", (_name, Checkbox) => {
  it("toggles on click without a checked prop", async () => {
    const user = userEvent.setup();
    render(<Checkbox aria-label="Accept" />);
    const box = screen.getByRole("checkbox");
    expect(isOn(box)).toBe(false);
    await user.click(box);
    expect(isOn(box)).toBe(true);
    expect(box.querySelector("svg")).not.toBeNull();
    await user.click(box);
    expect(isOn(box)).toBe(false);
  });

  it("starts on with defaultChecked", () => {
    render(<Checkbox aria-label="Accept" defaultChecked />);
    expect(isOn(screen.getByRole("checkbox"))).toBe(true);
  });

  it("still follows checked when controlled", async () => {
    const user = userEvent.setup();
    const { rerender } = render(<Checkbox aria-label="Accept" checked />);
    const box = screen.getByRole("checkbox");
    expect(isOn(box)).toBe(true);
    await user.click(box);
    expect(isOn(box)).toBe(true);
    rerender(<Checkbox aria-label="Accept" checked={false} />);
    expect(isOn(box)).toBe(false);
  });

  it("keeps the indeterminate state", () => {
    render(<Checkbox aria-label="Some" indeterminate />);
    const box = screen.getByRole("checkbox");
    expect(
      box.getAttribute("aria-checked") === "mixed" ||
        box.hasAttribute("data-indeterminate") ||
        box.getAttribute("data-state") === "indeterminate"
    ).toBe(true);
  });
});
