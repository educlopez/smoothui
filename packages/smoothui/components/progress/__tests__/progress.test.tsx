import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render, screen } from "../../../test-utils/render";
import Progress from "../index";
import RadixProgress from "../progress.radix";

describe("Progress", () => {
  it("has no accessibility violations (determinate, labelled)", async () => {
    const { container } = render(<Progress label="Uploading" value={40} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations (indeterminate)", async () => {
    const { container } = render(
      <Progress aria-label="Loading" value={null} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("exposes progressbar semantics", () => {
    render(<Progress label="Uploading" showValue value={40} />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "40");
    expect(screen.getByText("Uploading")).toBeInTheDocument();
  });

  it("renders without throwing when indeterminate", () => {
    render(<Progress aria-label="Loading" value={null} />);
    expect(screen.getByRole("progressbar")).not.toHaveAttribute(
      "aria-valuenow"
    );
  });

  it("scales the indicator from the left for determinate values", () => {
    const { container } = render(<Progress aria-label="Task" value={50} />);
    const indicator = container.querySelector(
      "[data-slot='progress-indicator']"
    ) as HTMLElement;
    expect(indicator.className).toContain("origin-left");
    expect(indicator.style.transform).toContain("scaleX(0.5)");
  });
});

describe("Progress (Radix twin)", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(
      <RadixProgress label="Uploading" showValue value={40} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("exposes progressbar semantics", () => {
    render(<RadixProgress aria-label="Task" value={25} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "25"
    );
  });

  it("supports indeterminate", () => {
    render(<RadixProgress aria-label="Loading" value={null} />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });
});
