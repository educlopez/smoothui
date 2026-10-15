import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render, screen } from "../../../../test-utils/render";
import Block from "../index";

describe("Faq3", () => {
  it("renders without throwing", () => {
    const { container } = render(<Block />);
    expect(container).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Block />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("labels the search input", () => {
    render(<Block />);
    expect(
      screen.getByRole("textbox", {
        name: "Search frequently asked questions",
      })
    ).toBeInTheDocument();
  });
});
