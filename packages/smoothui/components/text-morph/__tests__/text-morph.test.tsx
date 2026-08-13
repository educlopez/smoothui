import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import TextMorph from "../index";

describe("TextMorph", () => {
  it("renders without throwing", () => {
    const { container } = render(<TextMorph text="Smooth" />);
    expect(container).toBeInTheDocument();
  });

  it("renders the words mode variant without throwing", () => {
    const { container } = render(<TextMorph mode="words" text="Smooth UI" />);
    expect(container).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<TextMorph text="Smooth" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
