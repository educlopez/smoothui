import { describe, expect, it } from "vitest";
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
});
