import { describe, expect, it } from "vitest";
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
});
