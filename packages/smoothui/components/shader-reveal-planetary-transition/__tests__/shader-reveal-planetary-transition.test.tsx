import { describe, expect, it } from "vitest";
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
});
