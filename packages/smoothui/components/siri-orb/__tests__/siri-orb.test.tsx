import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import SiriOrb from "../index";

describe("SiriOrb", () => {
  it("renders without throwing", () => {
    const { container } = render(<SiriOrb />);
    expect(container).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<SiriOrb />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
