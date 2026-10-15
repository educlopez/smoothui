import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import MorphToggle from "../index";

describe("MorphToggle", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(<MorphToggle label="Test toggle" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders without throwing", () => {
    const { container } = render(<MorphToggle label="Test toggle" />);
    expect(container).toBeInTheDocument();
  });
});
