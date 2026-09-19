import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import SvgDrawOnScroll from "../index";

const PATH = "M10 10 L90 90";

describe("SvgDrawOnScroll", () => {
  it("renders without throwing", () => {
    const { container } = render(<SvgDrawOnScroll path={PATH} />);
    expect(container).toBeInTheDocument();
  });

  it("renders multiple paths with once enabled without throwing", () => {
    const { container } = render(
      <SvgDrawOnScroll once paths={[PATH, "M10 90 L90 10"]} />
    );
    expect(container).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<SvgDrawOnScroll path={PATH} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
