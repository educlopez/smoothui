import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import BreakpointIndicator from "../index";

describe("BreakpointIndicator", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(<BreakpointIndicator enabled />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders without throwing", () => {
    const { container } = render(<BreakpointIndicator enabled />);
    expect(container).toBeInTheDocument();
  });

  it("renders with the ruler visible", () => {
    const { container } = render(
      <BreakpointIndicator enabled position="top-right" showRuler />
    );
    expect(container).toBeInTheDocument();
  });
});
