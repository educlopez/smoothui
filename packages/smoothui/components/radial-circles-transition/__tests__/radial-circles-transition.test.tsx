import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import RadialCirclesTransition from "../index";

describe("RadialCirclesTransition", () => {
  it("renders the active content", () => {
    const { getByText } = render(
      <RadialCirclesTransition transitionKey="draft">
        Draft saved
      </RadialCirclesTransition>
    );

    expect(getByText("Draft saved")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <RadialCirclesTransition transitionKey="draft">
        Draft saved
      </RadialCirclesTransition>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
