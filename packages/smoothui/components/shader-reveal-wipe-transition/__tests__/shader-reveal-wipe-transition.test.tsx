import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import ShaderRevealWipeTransition from "../index";

describe("ShaderRevealWipeTransition", () => {
  it("renders the active content", () => {
    const { getByText } = render(
      <ShaderRevealWipeTransition transitionKey="draft">
        Draft saved
      </ShaderRevealWipeTransition>
    );

    expect(getByText("Draft saved")).toBeInTheDocument();
  });
});
