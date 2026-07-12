import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../../test-utils/render";
import Block from "../index";

describe("Pricing2", () => {
  it("renders without throwing", () => {
    const { container } = render(<Block />);
    expect(container).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Block />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("shows annual prices for all metered plans by default", () => {
    const { container } = render(<Block />);

    expect(container.textContent).toContain("10");
    expect(container.textContent).toContain("25");
    expect(screen.getByRole("button", { name: "Annually" })).toHaveAttribute(
      "data-active",
      "true"
    );
  });

  it("switches every metered plan to the monthly price on toggle", () => {
    const { container } = render(<Block />);

    fireEvent.click(screen.getByRole("button", { name: "Monthly" }));

    expect(container.textContent).toContain("15");
    expect(container.textContent).toContain("35");
    expect(screen.getByRole("button", { name: "Monthly" })).toHaveAttribute(
      "data-active",
      "true"
    );
  });

  it("always shows a custom price for the Enterprise plan", () => {
    render(<Block />);

    expect(screen.getByText("Custom")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Monthly" }));

    expect(screen.getByText("Custom")).toBeInTheDocument();
  });

  it("highlights the Pro plan as most popular", () => {
    render(<Block />);

    expect(screen.getByText("Most Popular")).toBeInTheDocument();
  });

  it("renders each plan's title and CTA label", () => {
    render(<Block />);

    expect(screen.getByText("Basic")).toBeInTheDocument();
    expect(screen.getByText("Enterprise")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Get Started" })).toHaveLength(
      2
    );
    expect(
      screen.getByRole("button", { name: "Contact Sales" })
    ).toBeInTheDocument();
  });

  it("renders plan-specific feature lists", () => {
    render(<Block />);

    expect(screen.getByText("1 Project")).toBeInTheDocument();
    expect(screen.getByText("White-label Options")).toBeInTheDocument();
    expect(screen.getByText("24/7 Phone Support")).toBeInTheDocument();
  });
});
