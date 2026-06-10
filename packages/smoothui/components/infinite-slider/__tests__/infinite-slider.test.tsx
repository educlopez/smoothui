import { describe, expect, it } from "vitest";
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
});
