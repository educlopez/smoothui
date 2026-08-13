import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import MotionLoader from "../index";

describe("MotionLoader", () => {
  it("renders without throwing", () => {
    const { container } = render(<MotionLoader />);
    expect(container).toBeInTheDocument();
  });

  it("renders the newton-cradle variant", () => {
    const { container } = render(<MotionLoader variant="newton-cradle" />);
    expect(container).toBeInTheDocument();
  });

  it("renders the wave-bars variant with a custom size and color", () => {
    const { container } = render(
      <MotionLoader color="tomato" size={64} variant="wave-bars" />
    );
    expect(container).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<MotionLoader />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
