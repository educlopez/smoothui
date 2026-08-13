import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import PriceFlow from "../index";

describe("PriceFlow", () => {
  it("renders without throwing", () => {
    const { container } = render(<PriceFlow value={42} />);
    expect(container).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<PriceFlow value={42} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
