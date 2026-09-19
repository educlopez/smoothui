import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import NumberFlow from "../index";

describe("NumberFlow", () => {
  it("renders without throwing", () => {
    const { container } = render(<NumberFlow />);
    expect(container).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<NumberFlow />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
