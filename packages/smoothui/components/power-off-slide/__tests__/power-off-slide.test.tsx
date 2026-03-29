import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import PowerOffSlide from "../index";

describe("PowerOffSlide", () => {
  it("renders without throwing", () => {
    const { container } = render(<PowerOffSlide />);
    expect(container).toBeInTheDocument();
  });
});
