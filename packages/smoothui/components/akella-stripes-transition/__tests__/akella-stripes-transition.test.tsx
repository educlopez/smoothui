import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import AkellaStripesTransition from "../index";

describe("AkellaStripesTransition", () => {
  it("renders the active content", () => {
    const { getByText } = render(
      <AkellaStripesTransition transitionKey="draft">
        Draft saved
      </AkellaStripesTransition>
    );

    expect(getByText("Draft saved")).toBeInTheDocument();
  });
});
