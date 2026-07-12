import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../../test-utils/render";
import Block from "../index";

describe("Pricing1", () => {
  it("renders without throwing", () => {
    const { container } = render(<Block />);
    expect(container).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Block />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("defaults to the annual plan with the annual price shown", () => {
    const { container } = render(<Block />);

    expect(screen.getByRole("button", { name: "Annually" })).toHaveAttribute(
      "data-active",
      "true"
    );
    expect(screen.getByRole("button", { name: "Monthly" })).toHaveAttribute(
      "data-active",
      "false"
    );
    expect(container.textContent).toContain("15");
  });

  it("switches to the monthly price when the Monthly toggle is clicked", () => {
    const { container } = render(<Block />);

    fireEvent.click(screen.getByRole("button", { name: "Monthly" }));

    expect(screen.getByRole("button", { name: "Monthly" })).toHaveAttribute(
      "data-active",
      "true"
    );
    expect(screen.getByRole("button", { name: "Annually" })).toHaveAttribute(
      "data-active",
      "false"
    );
    expect(container.textContent).toContain("19");
  });

  it("switches back to the annual price when the Annually toggle is clicked again", () => {
    const { container } = render(<Block />);

    fireEvent.click(screen.getByRole("button", { name: "Monthly" }));
    fireEvent.click(screen.getByRole("button", { name: "Annually" }));

    expect(screen.getByRole("button", { name: "Annually" })).toHaveAttribute(
      "data-active",
      "true"
    );
    expect(container.textContent).toContain("15");
  });

  it("renders every included feature", () => {
    render(<Block />);

    const features = [
      "Unlimited Projects",
      "Email Support",
      "All Features",
      "Advanced Analytics",
      "Team Collaboration",
      "Custom Domains",
      "Priority Updates",
      "API Access",
    ];

    for (const feature of features) {
      expect(screen.getByText(feature)).toBeInTheDocument();
    }
  });

  it("renders the CTA button and heading", () => {
    render(<Block />);

    expect(
      screen.getByRole("button", { name: "Get Started" })
    ).toBeInTheDocument();
    expect(screen.getByText("Simple pricing for everyone")).toBeInTheDocument();
  });
});
