import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import SdfBlobTransition from "../index";

describe("SdfBlobTransition", () => {
  it("renders the active content", () => {
    const { getByText } = render(
      <SdfBlobTransition transitionKey="draft">Draft saved</SdfBlobTransition>
    );

    expect(getByText("Draft saved")).toBeInTheDocument();
  });
});
