import { describe, expect, it } from "vitest";
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
});
