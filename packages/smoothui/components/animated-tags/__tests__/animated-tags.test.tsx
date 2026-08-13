import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import AnimatedTags from "../index";

describe("AnimatedTags", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(<AnimatedTags />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders without throwing", () => {
    const { container } = render(<AnimatedTags />);
    expect(container).toBeInTheDocument();
  });
});
