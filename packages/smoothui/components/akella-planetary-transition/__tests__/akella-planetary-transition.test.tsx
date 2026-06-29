import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import AkellaPlanetaryTransition from "../index";

describe("AkellaPlanetaryTransition", () => {
  it("renders the active content", () => {
    const { getByText } = render(
      <AkellaPlanetaryTransition transitionKey="draft">
        Draft saved
      </AkellaPlanetaryTransition>
    );

    expect(getByText("Draft saved")).toBeInTheDocument();
  });
});
