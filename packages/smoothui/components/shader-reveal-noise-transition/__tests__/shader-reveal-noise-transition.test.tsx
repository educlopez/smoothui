import { describe, expect, it } from "vitest";
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
});
