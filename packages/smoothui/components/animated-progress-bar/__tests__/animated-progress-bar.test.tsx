import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import AnimatedProgressBar from "../index";

describe("AnimatedProgressBar", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(<AnimatedProgressBar value={50} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders without throwing", () => {
    const { container } = render(<AnimatedProgressBar value={50} />);
    expect(container).toBeInTheDocument();
  });
});
