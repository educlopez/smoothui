import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import MagneticButton from "../index";

describe("MagneticButton", () => {
  it("renders without throwing", () => {
    const { container } = render(<MagneticButton>Pull me</MagneticButton>);
    expect(container).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<MagneticButton>Pull me</MagneticButton>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
