import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import ShaderRevealPlanetaryTransition from "../index";

describe("ShaderRevealPlanetaryTransition", () => {
  it("renders the active content", () => {
    const { getByText } = render(
      <ShaderRevealPlanetaryTransition transitionKey="draft">
        Draft saved
      </ShaderRevealPlanetaryTransition>
    );

    expect(getByText("Draft saved")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <ShaderRevealPlanetaryTransition transitionKey="draft">
        Draft saved
      </ShaderRevealPlanetaryTransition>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
