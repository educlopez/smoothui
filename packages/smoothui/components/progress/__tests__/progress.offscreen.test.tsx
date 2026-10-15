import { act } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "../../../test-utils/render";

const reduced = vi.hoisted(() => ({ value: false }));

vi.mock("motion/react", async () => {
  const actual =
    await vi.importActual<typeof import("motion/react")>("motion/react");
  return { ...actual, useReducedMotion: () => reduced.value };
});

import ProgressBase from "../progress.base";
import ProgressRadix from "../progress.radix";

interface Observed {
  callback: IntersectionObserverCallback;
  target: Element;
}

const observed: Observed[] = [];

class MockIntersectionObserver {
  readonly root = null;
  readonly rootMargin = "0px";
  readonly thresholds: readonly number[] = [0];
  private readonly callback: IntersectionObserverCallback;

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
  }

  observe(target: Element) {
    observed.push({ callback: this.callback, target });
  }

  unobserve() {
    // not needed by the hook
  }

  disconnect() {
    // not needed by the hook
  }

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

/** Report an intersection change to every observer of `target`. */
const setIntersecting = (target: Element, isIntersecting: boolean) => {
  const matches = observed.filter((entry) => entry.target === target);
  expect(matches.length).toBeGreaterThan(0);
  act(() => {
    for (const { callback } of matches) {
      callback(
        [{ isIntersecting, target } as IntersectionObserverEntry],
        {} as IntersectionObserver
      );
    }
  });
};

beforeEach(() => {
  observed.length = 0;
  reduced.value = false;
  vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

const LOOP = "will-change-transform";

describe.each([
  ["Base", ProgressBase],
  ["Radix", ProgressRadix],
] as const)("Progress %s indeterminate off screen", (_name, Progress) => {
  const indicator = (container: HTMLElement) =>
    container.querySelector('[data-slot="progress-indicator"]') as HTMLElement;

  it("watches the track, loops on screen and rests off screen", () => {
    const { container } = render(
      <Progress aria-label="Loading" value={null} />
    );
    const track = container.querySelector(
      '[data-slot="progress-track"]'
    ) as Element;
    expect(indicator(container).classList.contains(LOOP)).toBe(true);
    setIntersecting(track, false);
    expect(indicator(container).classList.contains(LOOP)).toBe(false);
    expect(indicator(container).style.transform).toBe("translateX(-100%)");
    setIntersecting(track, true);
    expect(indicator(container).classList.contains(LOOP)).toBe(true);
  });

  it("does not loop with reduced motion", () => {
    reduced.value = true;
    const { container } = render(
      <Progress aria-label="Loading" value={null} />
    );
    expect(indicator(container)).not.toBeNull();
    expect(indicator(container).classList.contains(LOOP)).toBe(false);
  });

  it("a determinate bar never loops", () => {
    const { container } = render(<Progress aria-label="Task" value={40} />);
    expect(indicator(container).classList.contains(LOOP)).toBe(false);
  });
});
