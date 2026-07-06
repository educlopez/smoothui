import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import ShaderRevealTransition from "../index";

describe("ShaderRevealTransition", () => {
  it("renders the active content", () => {
    const { getByText } = render(
      <ShaderRevealTransition transitionKey="draft">
        Draft saved
      </ShaderRevealTransition>
    );

    expect(getByText("Draft saved")).toBeInTheDocument();
  });
});
