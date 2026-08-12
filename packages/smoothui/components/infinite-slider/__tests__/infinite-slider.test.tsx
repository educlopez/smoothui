import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import InfiniteSlider from "../index";

describe("InfiniteSlider", () => {
  it("renders without throwing", () => {
    const { container } = render(
      <InfiniteSlider>
        <span>One</span>
        <span>Two</span>
      </InfiniteSlider>
    );
    expect(container).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <InfiniteSlider>
        <span>One</span>
        <span>Two</span>
      </InfiniteSlider>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
