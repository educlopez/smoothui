import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import ShaderRevealZoomTransition from "../index";

describe("ShaderRevealZoomTransition", () => {
  it("renders the active content", () => {
    const { getByText } = render(
      <ShaderRevealZoomTransition transitionKey="draft">
        Draft saved
      </ShaderRevealZoomTransition>
    );

    expect(getByText("Draft saved")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <ShaderRevealZoomTransition transitionKey="draft">
        Draft saved
      </ShaderRevealZoomTransition>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
