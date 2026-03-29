import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import ExposureSlider from "../index";

describe("ExposureSlider", () => {
  it("renders without throwing", () => {
    const { container } = render(<ExposureSlider />);
    expect(container).toBeInTheDocument();
  });
});
