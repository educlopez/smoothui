import { describe, expect, it } from "vitest";
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
});
