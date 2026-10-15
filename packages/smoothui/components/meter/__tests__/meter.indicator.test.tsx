import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import MeterBase from "../meter.base";
import MeterRadix from "../meter.radix";

const twins = [
  ["Base", MeterBase],
  ["Radix", MeterRadix],
] as const;

const indicatorOf = (container: HTMLElement) =>
  container.querySelector('[data-slot="meter-indicator"]') as HTMLElement;

describe.each(twins)("Meter %s indicator mechanism", (_name, Meter) => {
  it("moves with width through one CSS transition and never with transform", () => {
    const low = render(<Meter aria-label="Quota" value={20} />);
    const lowIndicator = indicatorOf(low.container);
    // Reference first: the indicator exists and carries the width transition.
    expect(lowIndicator).not.toBeNull();
    expect(lowIndicator.className).toContain("transition-[width]");
    expect(lowIndicator.style.width).toBe("20%");
    expect(lowIndicator.style.transform).toBe("");
    low.unmount();

    const high = render(<Meter aria-label="Quota" value={80} />);
    const highIndicator = indicatorOf(high.container);
    expect(highIndicator.style.width).toBe("80%");
    expect(highIndicator.style.transform).toBe("");
  });
});
