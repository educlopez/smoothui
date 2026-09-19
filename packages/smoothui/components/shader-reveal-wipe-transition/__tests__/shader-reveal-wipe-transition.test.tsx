import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
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

  it("has no accessibility violations", async () => {
    const { container } = render(
      <ShaderRevealWipeTransition transitionKey="draft">
        Draft saved
      </ShaderRevealWipeTransition>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
