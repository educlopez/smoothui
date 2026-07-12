import { describe, expect, it } from "vitest";
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
});
