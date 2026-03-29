import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import AnimatedToggle from "../index";

describe("AnimatedToggle", () => {
  it("renders without throwing", () => {
    const { container } = render(<AnimatedToggle label="Test toggle" />);
    expect(container).toBeInTheDocument();
  });
});
