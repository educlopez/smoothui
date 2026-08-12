import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import LiquidMetal from "../index";

describe("LiquidMetal", () => {
  it("renders without throwing (falls back to CSS in jsdom)", () => {
    const { container } = render(<LiquidMetal>Chrome</LiquidMetal>);
    expect(container).toBeInTheDocument();
  });

  it("renders with text masking and a different variant", () => {
    const { container } = render(
      <LiquidMetal maskText variant="gold">
        Gold text
      </LiquidMetal>
    );
    expect(container).toBeInTheDocument();
  });
});
