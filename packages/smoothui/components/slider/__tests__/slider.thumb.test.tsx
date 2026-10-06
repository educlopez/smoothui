import { fireEvent, waitFor } from "@testing-library/react";
import { beforeAll, describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import SliderBase from "../slider.base";
import SliderRadix from "../slider.radix";

beforeAll(() => {
  // Radix captures the pointer on press; jsdom does not implement it.
  Element.prototype.setPointerCapture = () => undefined;
  Element.prototype.releasePointerCapture = () => undefined;
  Element.prototype.hasPointerCapture = () => false;
});

const twins = [
  ["Base", SliderBase],
  ["Radix", SliderRadix],
] as const;

const thumbOf = () =>
  document.querySelector('[data-slot="slider-thumb"]') as HTMLElement;

/** Where the library places the thumb: the element carrying inline positioning. */
const positioningOf = (thumb: HTMLElement): string => {
  const carriers = [thumb, thumb.parentElement as HTMLElement];
  return carriers
    .map(
      (el) =>
        `${el.style.insetInlineStart}|${el.style.left}|${el.style.translate}|${el.style.position}`
    )
    .join("::");
};

describe.each(twins)("Slider (%s) thumb press", (_name, Slider) => {
  it("scales the thumb without touching the library's positioning", async () => {
    render(<Slider aria-label="Volume" defaultValue={40} />);
    const thumb = thumbOf();
    expect(thumb).not.toBeNull();
    const before = positioningOf(thumb);
    // The reference exists: the library positioned the thumb somewhere.
    expect(before).not.toBe("|||::|||");

    fireEvent.pointerDown(thumb, { button: 0, pointerType: "mouse" });
    await waitFor(() => expect(thumb.style.transform).toContain("scale"));

    expect(positioningOf(thumb)).toBe(before);
    expect(thumb.style.transform).not.toContain("translate");
  });
});
