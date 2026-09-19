import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import AnimatedTooltip from "../index";

describe("AnimatedTooltip", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(
      <AnimatedTooltip content="Tooltip text">
        <button type="button">Hover me</button>
      </AnimatedTooltip>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders without throwing", () => {
    const { container } = render(
      <AnimatedTooltip content="Tooltip text">
        <button type="button">Hover me</button>
      </AnimatedTooltip>
    );
    expect(container).toBeInTheDocument();
  });
});
