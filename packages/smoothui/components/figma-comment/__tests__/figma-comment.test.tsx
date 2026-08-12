import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import Component from "../index";

describe("FigmaComment", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(<Component />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders without throwing", () => {
    const { container } = render(<Component />);
    expect(container).toBeInTheDocument();
  });
});
