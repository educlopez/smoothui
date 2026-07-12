import { describe, expect, it } from "vitest";
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
});
