import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import AkellaLumaTransition from "../index";

describe("AkellaLumaTransition", () => {
  it("renders the active content", () => {
    const { getByText } = render(
      <AkellaLumaTransition transitionKey="draft">
        Draft saved
      </AkellaLumaTransition>
    );

    expect(getByText("Draft saved")).toBeInTheDocument();
  });
});
