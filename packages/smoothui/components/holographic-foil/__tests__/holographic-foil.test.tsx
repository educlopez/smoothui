import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import HolographicFoil from "../index";

describe("HolographicFoil", () => {
  it("renders without throwing", () => {
    const { container } = render(
      <HolographicFoil>Card content</HolographicFoil>
    );
    expect(container).toBeInTheDocument();
  });

  it("renders with a different foil pattern", () => {
    const { container } = render(
      <HolographicFoil pattern="gold" tilt={false}>
        Gold card
      </HolographicFoil>
    );
    expect(container).toBeInTheDocument();
  });
});
