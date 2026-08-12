import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import SvgClipMask from "../index";

describe("SvgClipMask", () => {
  it("renders without throwing", () => {
    const { container } = render(
      <SvgClipMask>
        <div>Content</div>
      </SvgClipMask>
    );
    expect(container).toBeInTheDocument();
  });

  it("renders a diamond shape with morph animation", () => {
    const { container } = render(
      <SvgClipMask animate="morph" shape="diamond">
        <div>Morphing content</div>
      </SvgClipMask>
    );
    expect(container).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <SvgClipMask>
        <div>Content</div>
      </SvgClipMask>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
