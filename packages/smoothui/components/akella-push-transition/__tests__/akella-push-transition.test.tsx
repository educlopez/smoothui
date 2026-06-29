import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import AkellaPushTransition from "../index";

describe("AkellaPushTransition", () => {
  it("renders the active content", () => {
    const { getByText } = render(
      <AkellaPushTransition transitionKey="draft">
        Draft saved
      </AkellaPushTransition>
    );

    expect(getByText("Draft saved")).toBeInTheDocument();
  });
});
