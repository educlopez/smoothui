import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render, screen } from "../../../test-utils/render";
import Slider from "../index";

describe("Slider", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(
      <Slider aria-label="Volume" defaultValue={40} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders without throwing", () => {
    render(<Slider aria-label="Opacity" defaultValue={50} />);
    expect(screen.getByRole("slider")).toBeInTheDocument();
  });
});
