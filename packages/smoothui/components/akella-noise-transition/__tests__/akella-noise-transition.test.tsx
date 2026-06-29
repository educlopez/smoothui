import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import AkellaNoiseTransition from "../index";

describe("AkellaNoiseTransition", () => {
  it("renders the active content", () => {
    const { getByText } = render(
      <AkellaNoiseTransition transitionKey="draft">
        Draft saved
      </AkellaNoiseTransition>
    );

    expect(getByText("Draft saved")).toBeInTheDocument();
  });
});
