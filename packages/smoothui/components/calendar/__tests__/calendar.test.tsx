import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render, screen } from "../../../test-utils/render";
import Calendar from "../index";

describe("Calendar", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(
      <Calendar defaultMonth={new Date(2026, 9, 1)} mode="single" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders a grid of days", () => {
    render(<Calendar defaultMonth={new Date(2026, 9, 1)} mode="single" />);
    expect(screen.getByRole("grid")).toBeInTheDocument();
  });
});
