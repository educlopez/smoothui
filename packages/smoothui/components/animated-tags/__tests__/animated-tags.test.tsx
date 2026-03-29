import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import AnimatedTags from "../index";

describe("AnimatedTags", () => {
  it("renders without throwing", () => {
    const { container } = render(<AnimatedTags />);
    expect(container).toBeInTheDocument();
  });
});
