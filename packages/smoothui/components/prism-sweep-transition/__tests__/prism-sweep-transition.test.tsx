import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import PrismSweepTransition from "../index";

describe("PrismSweepTransition", () => {
  it("renders the active content", () => {
    const { getByText } = render(
      <PrismSweepTransition transitionKey="draft">
        Draft saved
      </PrismSweepTransition>
    );

    expect(getByText("Draft saved")).toBeInTheDocument();
  });
});
