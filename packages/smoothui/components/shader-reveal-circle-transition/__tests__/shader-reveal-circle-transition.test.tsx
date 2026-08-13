import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import ShaderRevealCircleTransition from "../index";

describe("ShaderRevealCircleTransition", () => {
  it("renders the active content", () => {
    const { getByText } = render(
      <ShaderRevealCircleTransition transitionKey="draft">
        Draft saved
      </ShaderRevealCircleTransition>
    );

    expect(getByText("Draft saved")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <ShaderRevealCircleTransition transitionKey="draft">
        Draft saved
      </ShaderRevealCircleTransition>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
