import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import ShaderRevealLumaTransition from "../index";

describe("ShaderRevealLumaTransition", () => {
  it("renders the active content", () => {
    const { getByText } = render(
      <ShaderRevealLumaTransition transitionKey="draft">
        Draft saved
      </ShaderRevealLumaTransition>
    );

    expect(getByText("Draft saved")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <ShaderRevealLumaTransition transitionKey="draft">
        Draft saved
      </ShaderRevealLumaTransition>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
