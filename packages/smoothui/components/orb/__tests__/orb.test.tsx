import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import Orb from "../index";

describe("Orb", () => {
  // jsdom has no WebGL2, so getContext returns null and the effect bails. These
  // assert the component survives that rather than throwing, which is the
  // failure mode that would take a whole page down.
  it("falls back to a CSS stand-in without a WebGL2 context", () => {
    const { container } = render(<Orb />);
    const node = container.firstElementChild as HTMLElement;
    expect(node.tagName.toLowerCase()).toBe("div");
    expect(node.style.backgroundImage).toContain("radial-gradient");
  });

  it("applies a numeric size as pixels", () => {
    const { container } = render(<Orb size={140} />);
    expect(container.firstElementChild).toHaveStyle({
      height: "140px",
      width: "140px",
    });
  });

  it("accepts a full configuration without throwing", () => {
    const { container } = render(
      <Orb
        aberration={0.5}
        blobScale={2}
        colors={["#ff0000", "#00ff00", "#0000ff"]}
        glow={0.4}
        iridescence={0.6}
        paused
        wobble={0.3}
      />
    );
    expect(container.firstElementChild).toBeInTheDocument();
  });

  it("is hidden from assistive technologies", () => {
    const { container } = render(<Orb />);
    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Orb />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
