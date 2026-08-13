import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import SdfCircleTransition from "../index";

describe("SdfCircleTransition", () => {
  it("renders the active content", () => {
    const { getByText } = render(
      <SdfCircleTransition transitionKey="draft">
        Draft saved
      </SdfCircleTransition>
    );

    expect(getByText("Draft saved")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <SdfCircleTransition transitionKey="draft">
        Draft saved
      </SdfCircleTransition>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
