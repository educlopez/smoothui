import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../../test-utils/render";
import Block from "../index";

describe("Pricing3", () => {
  it("renders without throwing", () => {
    const { container } = render(<Block />);
    expect(container).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Block />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("shows the annual Pro price by default", () => {
    const { container } = render(<Block />);

    expect(container.textContent).toContain("12");
    expect(screen.getByRole("button", { name: "Annually" })).toHaveAttribute(
      "data-active",
      "true"
    );
  });

  it("switches the Pro price to monthly on toggle", () => {
    const { container } = render(<Block />);

    fireEvent.click(screen.getByRole("button", { name: "Monthly" }));

    expect(container.textContent).toContain("25");
    expect(screen.getByRole("button", { name: "Monthly" })).toHaveAttribute(
      "data-active",
      "true"
    );
  });

  it("keeps the Hobby plan free regardless of the billing toggle", () => {
    render(<Block />);

    expect(screen.getByText("Hobby")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Monthly" }));

    expect(screen.getByText("Hobby")).toBeInTheDocument();
  });

  it("renders both plan titles, CTAs, and feature lists", () => {
    render(<Block />);

    expect(screen.getByText("Pro")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Get Started" })).toHaveLength(
      2
    );
    expect(screen.getByText("100GB Bandwidth")).toBeInTheDocument();
    expect(screen.getByText("Cron Jobs")).toBeInTheDocument();
  });
});
