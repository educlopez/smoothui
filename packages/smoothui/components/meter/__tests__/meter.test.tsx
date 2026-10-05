import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render, screen } from "../../../test-utils/render";
import Meter from "../index";
import RadixMeter from "../meter.radix";

describe("Meter", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(
      <Meter label="Storage used" showValue value={42} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("exposes meter semantics", () => {
    render(<Meter label="Storage used" showValue value={42} />);
    const meter = screen.getByRole("meter");
    expect(meter).toHaveAttribute("aria-valuenow", "42");
    expect(screen.getByText("Storage used")).toBeInTheDocument();
  });

  it("renders without a visible label when aria-label is set", () => {
    render(<Meter aria-label="Battery" value={80} />);
    expect(screen.getByRole("meter")).toHaveAttribute("aria-label", "Battery");
  });
});

describe("Meter (Radix-parity twin)", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(
      <RadixMeter label="Storage used" showValue value={42} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("exposes meter semantics", () => {
    render(<RadixMeter aria-label="Quota" value={25} />);
    expect(screen.getByRole("meter")).toHaveAttribute("aria-valuenow", "25");
  });
});
