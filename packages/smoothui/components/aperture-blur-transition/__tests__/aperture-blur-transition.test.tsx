import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import ApertureBlurTransition from "../index";

describe("ApertureBlurTransition", () => {
  it("renders the active content", () => {
    const { getByText } = render(
      <ApertureBlurTransition transitionKey="draft">
        Draft saved
      </ApertureBlurTransition>
    );

    expect(getByText("Draft saved")).toBeInTheDocument();
  });
});
