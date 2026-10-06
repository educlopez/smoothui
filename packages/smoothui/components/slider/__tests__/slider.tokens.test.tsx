import { beforeAll, describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import SliderBase from "../slider.base";
import SliderRadix from "../slider.radix";

beforeAll(() => {
  Element.prototype.setPointerCapture = () => undefined;
  Element.prototype.releasePointerCapture = () => undefined;
  Element.prototype.hasPointerCapture = () => false;
});

const twins = [
  ["Base", SliderBase],
  ["Radix", SliderRadix],
] as const;

describe.each(twins)("Slider %s thumb tokens", (_name, Slider) => {
  it("fills the thumb with the thumb token and shares the focus ring utility", () => {
    const { container } = render(<Slider aria-label="x" defaultValue={30} />);
    const thumb = container.querySelector(
      '[data-slot="slider-thumb"]'
    ) as HTMLElement;
    expect(thumb).not.toBeNull();
    const surface = thumb.className.includes("bg-thumb")
      ? thumb
      : (thumb.querySelector(".bg-thumb") as HTMLElement | null);
    expect(surface).not.toBeNull();
    expect(container.innerHTML).not.toContain("bg-white");
    expect(container.innerHTML).toMatch(/focus-ring(-within)?\b/);
  });
});
