import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import KineticTypeScroll from "../index";

const words = ["Smooth", "kinetic", "type"];

describe("KineticTypeScroll", () => {
  it("renders without throwing", () => {
    const { container } = render(<KineticTypeScroll words={words} />);
    expect(container).toBeInTheDocument();
  });

  it("renders the end-aligned variant without throwing", () => {
    const { container } = render(
      <KineticTypeScroll align="end" words={words} />
    );
    expect(container).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<KineticTypeScroll words={words} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
