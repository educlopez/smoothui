import { useReducedMotion } from "motion/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "../../../test-utils/render";
import {
  flushFrames,
  installWebglMock,
  runFramesFor,
  uninstallWebglMock,
} from "../../../test-utils/webgl-mock";
import ApertureBlurTransition from "../index";

vi.mock("motion/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("motion/react")>();
  return { ...actual, useReducedMotion: vi.fn(() => false) };
});

describe("ApertureBlurTransition", () => {
  beforeEach(() => {
    installWebglMock();
  });

  afterEach(() => {
    uninstallWebglMock();
    vi.mocked(useReducedMotion).mockReturnValue(false);
  });

  it("renders the active content", () => {
    const { getByText } = render(
      <ApertureBlurTransition transitionKey="draft">
        Draft saved
      </ApertureBlurTransition>
    );

    expect(getByText("Draft saved")).toBeInTheDocument();
  });

  it("runs the aperture sweep, swaps content at the midpoint, and calls onRest", () => {
    const onRest = vi.fn();
    const { getByText, queryByText, rerender } = render(
      <ApertureBlurTransition duration={100} onRest={onRest} transitionKey="a">
        First
      </ApertureBlurTransition>
    );

    expect(getByText("First")).toBeInTheDocument();

    rerender(
      <ApertureBlurTransition duration={100} onRest={onRest} transitionKey="b">
        Second
      </ApertureBlurTransition>
    );

    runFramesFor(400);

    expect(queryByText("First")).not.toBeInTheDocument();
    expect(getByText("Second")).toBeInTheDocument();
    expect(onRest).toHaveBeenCalledTimes(1);
  });

  it("skips the animation and swaps content immediately when reduced motion is preferred", () => {
    vi.mocked(useReducedMotion).mockReturnValue(true);

    const onRest = vi.fn();
    const { getByText, queryByText, rerender } = render(
      <ApertureBlurTransition onRest={onRest} transitionKey="a">
        First
      </ApertureBlurTransition>
    );

    rerender(
      <ApertureBlurTransition onRest={onRest} transitionKey="b">
        Second
      </ApertureBlurTransition>
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
      <ApertureBlurTransition onRest={onRest} transitionKey="a">
        First
      </ApertureBlurTransition>
    );

    rerender(
      <ApertureBlurTransition onRest={onRest} transitionKey="b">
        Second
      </ApertureBlurTransition>
    );

    expect(queryByText("First")).not.toBeInTheDocument();
    expect(getByText("Second")).toBeInTheDocument();
    expect(onRest).toHaveBeenCalledTimes(1);
  });

  it("does not throw when unmounted mid-animation", () => {
    const { rerender, unmount } = render(
      <ApertureBlurTransition duration={200} transitionKey="a">
        First
      </ApertureBlurTransition>
    );

    rerender(
      <ApertureBlurTransition duration={200} transitionKey="b">
        Second
      </ApertureBlurTransition>
    );

    flushFrames(2);

    expect(() => unmount()).not.toThrow();
    expect(() => flushFrames(2)).not.toThrow();
  });
});
