import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import AkellaCircleTransition from "../index";

describe("AkellaCircleTransition", () => {
  it("renders the active content", () => {
    const { getByText } = render(
      <AkellaCircleTransition transitionKey="draft">
        Draft saved
      </AkellaCircleTransition>
    );

    expect(getByText("Draft saved")).toBeInTheDocument();
  });
});
