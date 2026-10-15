import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render, screen } from "../../../test-utils/render";
import NumberField from "../index";
import RadixNumberField from "../number-field.radix";

describe("NumberField", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(
      <NumberField defaultValue={4} label="Quantity" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders labelled input", () => {
    render(<NumberField defaultValue={2} label="Seats" />);
    expect(screen.getByLabelText("Seats")).toBeInTheDocument();
  });
});

describe("NumberField (Radix-parity twin)", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(
      <RadixNumberField defaultValue={4} label="Quantity" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("exposes spinbutton semantics", () => {
    render(<RadixNumberField aria-label="Amount" defaultValue={10} />);
    expect(screen.getByRole("spinbutton")).toHaveValue(10);
  });
});
