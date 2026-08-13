import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import PowerOffSlide from "../index";

describe("PowerOffSlide", () => {
  it("renders without throwing", () => {
    const { container } = render(<PowerOffSlide />);
    expect(container).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<PowerOffSlide />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
