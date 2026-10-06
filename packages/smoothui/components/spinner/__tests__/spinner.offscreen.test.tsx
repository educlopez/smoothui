import { act } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "../../../test-utils/render";

const reduced = vi.hoisted(() => ({ value: false }));

vi.mock("motion/react", async () => {
  const actual =
    await vi.importActual<typeof import("motion/react")>("motion/react");
  return { ...actual, useReducedMotion: () => reduced.value };
});

import Spinner from "../index";

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

describe("Spinner off screen", () => {
  const turner = (container: HTMLElement) =>
    container.querySelector('[data-slot="spinner"] > span') as HTMLElement;

  it("loops on screen, pauses off screen, resumes on return", () => {
    const { container } = render(<Spinner />);
    const host = container.querySelector('[data-slot="spinner"]') as Element;
    expect(turner(container).classList.contains(LOOP)).toBe(true);
    setIntersecting(host, false);
    expect(turner(container).classList.contains(LOOP)).toBe(false);
    setIntersecting(host, true);
    expect(turner(container).classList.contains(LOOP)).toBe(true);
  });

  it("does not loop with reduced motion", () => {
    reduced.value = true;
    const { container } = render(<Spinner />);
    expect(turner(container)).not.toBeNull();
    expect(turner(container).classList.contains(LOOP)).toBe(false);
  });
});
