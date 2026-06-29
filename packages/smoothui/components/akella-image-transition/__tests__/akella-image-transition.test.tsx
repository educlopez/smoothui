import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import AkellaImageTransition from "../index";

describe("AkellaImageTransition", () => {
  it("renders the active content", () => {
    const { getByText } = render(
      <AkellaImageTransition transitionKey="draft">
        Draft saved
      </AkellaImageTransition>
    );

    expect(getByText("Draft saved")).toBeInTheDocument();
  });
});
