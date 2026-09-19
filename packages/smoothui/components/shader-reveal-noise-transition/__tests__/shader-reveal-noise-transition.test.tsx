import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import ShaderRevealNoiseTransition from "../index";

describe("ShaderRevealNoiseTransition", () => {
  it("renders the active content", () => {
    const { getByText } = render(
      <ShaderRevealNoiseTransition transitionKey="draft">
        Draft saved
      </ShaderRevealNoiseTransition>
    );

    expect(getByText("Draft saved")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <ShaderRevealNoiseTransition transitionKey="draft">
        Draft saved
      </ShaderRevealNoiseTransition>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
