import { describe, expect, it } from "vitest";
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
});
