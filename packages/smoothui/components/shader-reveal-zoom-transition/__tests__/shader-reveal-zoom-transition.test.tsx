import { describe, expect, it } from "vitest";
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
});
