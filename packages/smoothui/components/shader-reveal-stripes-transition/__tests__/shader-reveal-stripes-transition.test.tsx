import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import ShaderRevealStripesTransition from "../index";

describe("ShaderRevealStripesTransition", () => {
  it("renders the active content", () => {
    const { getByText } = render(
      <ShaderRevealStripesTransition transitionKey="draft">
        Draft saved
      </ShaderRevealStripesTransition>
    );

    expect(getByText("Draft saved")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <ShaderRevealStripesTransition transitionKey="draft">
        Draft saved
      </ShaderRevealStripesTransition>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
