import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import ScrollRevealParagraph from "../index";

describe("ScrollRevealParagraph", () => {
  it("renders without throwing", () => {
    const { container } = render(
      <ScrollRevealParagraph paragraph="This is a test paragraph." />
    );
    expect(container).toBeInTheDocument();
  });
});
