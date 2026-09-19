import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
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

  it("has no accessibility violations", async () => {
    const { container } = render(
      <TiltCard>
        <p>Tiltable content</p>
      </TiltCard>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
