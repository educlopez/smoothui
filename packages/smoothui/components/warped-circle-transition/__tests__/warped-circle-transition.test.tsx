import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import WarpedCircleTransition from "../index";

describe("WarpedCircleTransition", () => {
  it("renders the active content", () => {
    const { getByText } = render(
      <WarpedCircleTransition transitionKey="draft">
        Draft saved
      </WarpedCircleTransition>
    );

    expect(getByText("Draft saved")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <WarpedCircleTransition transitionKey="draft">
        Draft saved
      </WarpedCircleTransition>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
