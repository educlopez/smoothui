import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import TiltCard from "../index";

describe("TiltCard", () => {
  it("renders without throwing", () => {
    const { container } = render(
      <TiltCard>
        <p>Tiltable content</p>
      </TiltCard>
    );
    expect(container).toBeInTheDocument();
  });

  it("renders with parallax enabled without throwing", () => {
    const { container } = render(
      <TiltCard parallax>
        <p data-tilt-depth="0.5">Layered content</p>
      </TiltCard>
    );
    expect(container).toBeInTheDocument();
  });
});
