import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import AnimatedTooltip from "../index";

describe("AnimatedTooltip", () => {
  it("renders without throwing", () => {
    const { container } = render(
      <AnimatedTooltip content="Tooltip text">
        <button type="button">Hover me</button>
      </AnimatedTooltip>
    );
    expect(container).toBeInTheDocument();
  });
});
