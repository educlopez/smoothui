import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import ContributionGraph from "../index";

describe("ContributionGraph", () => {
  it("renders without throwing", () => {
    const { container } = render(<ContributionGraph />);
    expect(container).toBeInTheDocument();
  });
});
