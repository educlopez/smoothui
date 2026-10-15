import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import ProgressBase from "../progress.base";
import ProgressRadix from "../progress.radix";

const twins = [
  ["Base", ProgressBase],
  ["Radix", ProgressRadix],
] as const;

const indicatorOf = (container: HTMLElement) =>
  container.querySelector('[data-slot="progress-indicator"]') as HTMLElement;

describe.each(twins)("Progress %s indicator mechanism", (_name, Progress) => {
  it("moves with transform and keeps a constant inline width", () => {
    const low = render(<Progress aria-label="Task" value={25} />);
    const lowIndicator = indicatorOf(low.container);
    // Reference first: both values render an indicator with a transform.
    expect(lowIndicator).not.toBeNull();
    const lowStyle = {
      transform: lowIndicator.style.transform,
      width: lowIndicator.style.width,
    };
    low.unmount();

    const high = render(<Progress aria-label="Task" value={75} />);
    const highIndicator = indicatorOf(high.container);
    expect(highIndicator.style.transform).not.toBe(lowStyle.transform);
    // The Base UI Indicator injects `width: <percent>%`; the component's own
    // style wins, so width is not a second mechanism for the same movement.
    expect(highIndicator.style.width).toBe(lowStyle.width);
    expect(highIndicator.style.width).toBe("100%");
  });

  it("never carries a value-driven width together with an animated transform", () => {
    for (const value of [0, 40, 60]) {
      const { container, unmount } = render(
        <Progress aria-label="Task" value={value} />
      );
      const indicator = indicatorOf(container);
      expect(indicator.style.transform).toContain("translateX");
      expect(indicator.style.width).not.toBe(`${value}%`);
      unmount();
    }
  });
});
