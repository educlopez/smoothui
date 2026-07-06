import { describe, expect, it } from "vitest";
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
});
