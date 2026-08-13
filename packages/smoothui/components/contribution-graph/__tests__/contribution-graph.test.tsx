import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import ContributionGraph from "../index";

describe("ContributionGraph", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(<ContributionGraph />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders without throwing", () => {
    const { container } = render(<ContributionGraph />);
    expect(container).toBeInTheDocument();
  });
});
