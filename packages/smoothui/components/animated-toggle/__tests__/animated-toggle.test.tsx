import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import AnimatedToggle from "../index";

describe("AnimatedToggle", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(<AnimatedToggle label="Test toggle" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders without throwing", () => {
    const { container } = render(<AnimatedToggle label="Test toggle" />);
    expect(container).toBeInTheDocument();
  });
});
