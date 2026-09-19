import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import RollingText from "../index";

describe("RollingText", () => {
  it("renders without throwing", () => {
    const { container } = render(<RollingText text="Smooth" />);
    expect(container).toBeInTheDocument();
  });

  it("renders the downward-rolling variant without throwing", () => {
    const { container } = render(
      <RollingText direction="down" text="Smooth" />
    );
    expect(container).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<RollingText text="Smooth" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
