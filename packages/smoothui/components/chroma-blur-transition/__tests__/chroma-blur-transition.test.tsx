import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import ChromaBlurTransition from "../index";

describe("ChromaBlurTransition", () => {
  it("renders the active content", () => {
    const { getByText } = render(
      <ChromaBlurTransition transitionKey="draft">
        Draft saved
      </ChromaBlurTransition>
    );

    expect(getByText("Draft saved")).toBeInTheDocument();
  });
});
