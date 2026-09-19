import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import DynamicIsland from "../index";

describe("DynamicIsland", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(<DynamicIsland />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders without throwing", () => {
    const { container } = render(<DynamicIsland />);
    expect(container).toBeInTheDocument();
  });
});
