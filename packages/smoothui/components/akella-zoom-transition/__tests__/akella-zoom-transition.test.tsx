import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import AkellaZoomTransition from "../index";

describe("AkellaZoomTransition", () => {
  it("renders the active content", () => {
    const { getByText } = render(
      <AkellaZoomTransition transitionKey="draft">
        Draft saved
      </AkellaZoomTransition>
    );

    expect(getByText("Draft saved")).toBeInTheDocument();
  });
});
