import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import OrganicMergeTransition from "../index";

describe("OrganicMergeTransition", () => {
  it("renders the active content", () => {
    const { getByText } = render(
      <OrganicMergeTransition transitionKey="draft">
        Draft saved
      </OrganicMergeTransition>
    );

    expect(getByText("Draft saved")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <OrganicMergeTransition transitionKey="draft">
        Draft saved
      </OrganicMergeTransition>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
