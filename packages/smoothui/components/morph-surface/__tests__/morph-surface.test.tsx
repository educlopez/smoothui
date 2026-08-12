import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import MorphSurface from "../index";

describe("MorphSurface", () => {
  it("renders without throwing", () => {
    const { container } = render(<MorphSurface />);
    expect(container).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<MorphSurface />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
