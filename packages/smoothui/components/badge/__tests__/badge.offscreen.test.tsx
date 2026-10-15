import { act } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "../../../test-utils/render";

const reduced = vi.hoisted(() => ({ value: false }));

vi.mock("motion/react", async () => {
  const actual =
    await vi.importActual<typeof import("motion/react")>("motion/react");
  return { ...actual, useReducedMotion: () => reduced.value };
});

import Badge, { StatusDot } from "../index";

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

describe("StatusDot pulse off screen", () => {
  const pulse = (container: HTMLElement) =>
    container.querySelector('[data-slot="status-dot"] > span');

  it("pulses on screen, stops off screen, resumes on return", () => {
    const { container } = render(<StatusDot pulse status="online" />);
    const host = container.querySelector('[data-slot="status-dot"]') as Element;
    expect(pulse(container)).not.toBeNull();
    setIntersecting(host, false);
    expect(pulse(container)).toBeNull();
    setIntersecting(host, true);
    expect(pulse(container)).not.toBeNull();
  });

  it("does not pulse with reduced motion", () => {
    reduced.value = true;
    const { container } = render(<StatusDot pulse status="online" />);
    expect(container.querySelector('[data-slot="status-dot"]')).not.toBeNull();
    expect(pulse(container)).toBeNull();
  });

  it("keeps the badge itself free of any loop", () => {
    const { container } = render(<Badge>New</Badge>);
    expect(container.querySelector(`.${LOOP}`)).toBeNull();
  });
});
