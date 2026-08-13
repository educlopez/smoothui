import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import { DotMorphButton } from "../index";

describe("DotMorphButton", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(<DotMorphButton label="Click me" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders without throwing", () => {
    const { container } = render(<DotMorphButton label="Click me" />);
    expect(container).toBeInTheDocument();
  });
});
