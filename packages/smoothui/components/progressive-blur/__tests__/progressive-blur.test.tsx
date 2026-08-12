import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import ProgressiveBlur from "../index";

describe("ProgressiveBlur", () => {
  it("renders without throwing", () => {
    const { container } = render(
      <ProgressiveBlur>
        <p>Content above the blur</p>
      </ProgressiveBlur>
    );
    expect(container).toBeInTheDocument();
  });

  it("renders a radial direction without throwing", () => {
    const { container } = render(
      <ProgressiveBlur direction="radial" layers={4} />
    );
    expect(container).toBeInTheDocument();
  });
});
