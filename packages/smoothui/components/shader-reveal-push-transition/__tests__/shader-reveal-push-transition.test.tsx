import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import ShaderRevealPushTransition from "../index";

describe("ShaderRevealPushTransition", () => {
  it("renders the active content", () => {
    const { getByText } = render(
      <ShaderRevealPushTransition transitionKey="draft">
        Draft saved
      </ShaderRevealPushTransition>
    );

    expect(getByText("Draft saved")).toBeInTheDocument();
  });
});
