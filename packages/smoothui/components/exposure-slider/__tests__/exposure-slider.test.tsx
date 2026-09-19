import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import ExposureSlider from "../index";

describe("ExposureSlider", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(<ExposureSlider />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders without throwing", () => {
    const { container } = render(<ExposureSlider />);
    expect(container).toBeInTheDocument();
  });
});
