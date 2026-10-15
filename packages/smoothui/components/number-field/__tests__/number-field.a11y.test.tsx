import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render, screen } from "../../../test-utils/render";
import NumberFieldBase from "../number-field.base";
import NumberFieldRadix from "../number-field.radix";

const INCREMENT = /^Increment$/;
const DECREMENT = /^Decrement$/;

describe.each([
  ["Base", NumberFieldBase],
  ["Radix", NumberFieldRadix],
] as const)("NumberField (%s) a11y", (_name, NumberField) => {
  it("has no SVG titles and names the steppers by their action only", async () => {
    const { container } = render(
      <NumberField defaultValue={4} label="Quantity" />
    );
    expect(container.querySelector("svg title")).toBeNull();
    for (const svg of container.querySelectorAll("svg")) {
      expect(svg.getAttribute("aria-hidden")).toBe("true");
    }
    expect(screen.getByRole("button", { name: INCREMENT })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: DECREMENT })).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});
