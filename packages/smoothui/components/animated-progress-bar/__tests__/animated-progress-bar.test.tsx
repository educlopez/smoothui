import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import AnimatedProgressBar from "../index";

describe("AnimatedProgressBar", () => {
  it("renders without throwing", () => {
    const { container } = render(<AnimatedProgressBar value={50} />);
    expect(container).toBeInTheDocument();
  });
});
