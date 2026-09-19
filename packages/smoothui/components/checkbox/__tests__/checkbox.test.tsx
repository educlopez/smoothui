import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import Checkbox from "../index";

describe("Checkbox", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(<Checkbox aria-label="Accept terms" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders without throwing", () => {
    const { container } = render(<Checkbox />);
    expect(container).toBeInTheDocument();
  });
});
