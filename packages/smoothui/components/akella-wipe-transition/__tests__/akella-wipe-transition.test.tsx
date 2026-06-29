import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import AkellaWipeTransition from "../index";

describe("AkellaWipeTransition", () => {
  it("renders the active content", () => {
    const { getByText } = render(
      <AkellaWipeTransition transitionKey="draft">
        Draft saved
      </AkellaWipeTransition>
    );

    expect(getByText("Draft saved")).toBeInTheDocument();
  });
});
