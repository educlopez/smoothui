import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render, screen } from "../../../test-utils/render";
import Toggle from "../index";

describe("Toggle", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(<Toggle aria-label="Bold">B</Toggle>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders without throwing", () => {
    render(<Toggle aria-label="Italic">I</Toggle>);
    expect(screen.getByRole("button", { name: "Italic" })).toBeInTheDocument();
  });
});
