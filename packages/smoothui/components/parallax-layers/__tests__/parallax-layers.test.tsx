import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import ParallaxLayers from "../index";

describe("ParallaxLayers", () => {
  it("renders without throwing", () => {
    const { container } = render(
      <ParallaxLayers
        layers={[
          { content: <div>Back</div>, depth: 0.2, id: "back" },
          { blur: 2, content: <div>Front</div>, depth: 0.8, id: "front" },
        ]}
      />
    );
    expect(container).toBeInTheDocument();
  });

  it("renders horizontally with pointer parallax enabled", () => {
    const { container } = render(
      <ParallaxLayers
        direction="horizontal"
        layers={[{ content: <div>Layer</div>, depth: 0.5, id: "only" }]}
        pointerParallax
      />
    );
    expect(container).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <ParallaxLayers
        layers={[
          { content: <div>Back</div>, depth: 0.2, id: "back" },
          { blur: 2, content: <div>Front</div>, depth: 0.8, id: "front" },
        ]}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
