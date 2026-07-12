import { useReducedMotion } from "motion/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "../../../test-utils/render";
import {
  flushFrames,
  installWebglMock,
  runFramesFor,
  uninstallWebglMock,
} from "../../../test-utils/webgl-mock";
import PrismSweepTransition, {
  type PrismSweepDirection,
  type PrismSweepTone,
} from "../index";

vi.mock("motion/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("motion/react")>();
  return { ...actual, useReducedMotion: vi.fn(() => false) };
});

const ALL_TONES: PrismSweepTone[] = ["prism", "chroma", "aperture", "beam"];
const ALL_DIRECTIONS: PrismSweepDirection[] = ["left", "right", "up", "down"];

describe("PrismSweepTransition", () => {
  beforeEach(() => {
    installWebglMock();
  });

  afterEach(() => {
    uninstallWebglMock();
    vi.mocked(useReducedMotion).mockReturnValue(false);
  });

  it("renders the active content", () => {
    const { getByText } = render(
      <PrismSweepTransition transitionKey="draft">
        Draft saved
      </PrismSweepTransition>
    );

    expect(getByText("Draft saved")).toBeInTheDocument();
  });

  it("runs the sweep, swaps content mid-sweep, and calls onRest", () => {
    const onRest = vi.fn();
    const { getByText, queryByText, rerender } = render(
      <PrismSweepTransition duration={100} onRest={onRest} transitionKey="a">
        First
      </PrismSweepTransition>
    );

    expect(getByText("First")).toBeInTheDocument();

    rerender(
      <PrismSweepTransition duration={100} onRest={onRest} transitionKey="b">
        Second
      </PrismSweepTransition>
    );

    runFramesFor(500);

    expect(queryByText("First")).not.toBeInTheDocument();
    expect(getByText("Second")).toBeInTheDocument();
    expect(onRest).toHaveBeenCalledTimes(1);
  });

  it("skips the animation and swaps content immediately when reduced motion is preferred", () => {
    vi.mocked(useReducedMotion).mockReturnValue(true);

    const onRest = vi.fn();
    const { getByText, queryByText, rerender } = render(
      <PrismSweepTransition onRest={onRest} transitionKey="a">
        First
      </PrismSweepTransition>
    );

    rerender(
      <PrismSweepTransition onRest={onRest} transitionKey="b">
        Second
      </PrismSweepTransition>
    );

    expect(queryByText("First")).not.toBeInTheDocument();
    expect(getByText("Second")).toBeInTheDocument();
    expect(onRest).toHaveBeenCalledTimes(1);
  });

  it("swaps content immediately when WebGL is unavailable", () => {
    uninstallWebglMock();
    installWebglMock({ supported: false });

    const onRest = vi.fn();
    const { getByText, queryByText, rerender } = render(
      <PrismSweepTransition onRest={onRest} transitionKey="a">
        First
      </PrismSweepTransition>
    );

    rerender(
      <PrismSweepTransition onRest={onRest} transitionKey="b">
        Second
      </PrismSweepTransition>
    );

    expect(queryByText("First")).not.toBeInTheDocument();
    expect(getByText("Second")).toBeInTheDocument();
    expect(onRest).toHaveBeenCalledTimes(1);
  });

  it("does not throw when unmounted mid-animation", () => {
    const { rerender, unmount } = render(
      <PrismSweepTransition duration={300} transitionKey="a">
        First
      </PrismSweepTransition>
    );

    rerender(
      <PrismSweepTransition duration={300} transitionKey="b">
        Second
      </PrismSweepTransition>
    );

    flushFrames(2);

    expect(() => unmount()).not.toThrow();
    expect(() => flushFrames(2)).not.toThrow();
  });

  for (const tone of ALL_TONES) {
    it(`renders and animates the "${tone}" tone without throwing`, () => {
      const onRest = vi.fn();
      const { getByText, rerender } = render(
        <PrismSweepTransition
          duration={80}
          onRest={onRest}
          tone={tone}
          transitionKey="a"
        >
          First
        </PrismSweepTransition>
      );

      rerender(
        <PrismSweepTransition
          duration={80}
          onRest={onRest}
          tone={tone}
          transitionKey="b"
        >
          Second
        </PrismSweepTransition>
      );

      expect(() => runFramesFor(400)).not.toThrow();
      expect(getByText("Second")).toBeInTheDocument();
      expect(onRest).toHaveBeenCalledTimes(1);
    });
  }

  for (const direction of ALL_DIRECTIONS) {
    it(`renders and animates the "${direction}" direction without throwing`, () => {
      const onRest = vi.fn();
      const { getByText, rerender } = render(
        <PrismSweepTransition
          direction={direction}
          duration={80}
          onRest={onRest}
          transitionKey="a"
        >
          First
        </PrismSweepTransition>
      );

      rerender(
        <PrismSweepTransition
          direction={direction}
          duration={80}
          onRest={onRest}
          transitionKey="b"
        >
          Second
        </PrismSweepTransition>
      );

      expect(() => runFramesFor(400)).not.toThrow();
      expect(getByText("Second")).toBeInTheDocument();
      expect(onRest).toHaveBeenCalledTimes(1);
    });
  }
});
