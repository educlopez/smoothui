import { useReducedMotion } from "motion/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "../../../test-utils/render";
import {
  flushFrames,
  installWebglMock,
  runFramesFor,
  uninstallWebglMock,
} from "../../../test-utils/webgl-mock";
import ChromaBlurTransition from "../index";

vi.mock("motion/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("motion/react")>();
  return { ...actual, useReducedMotion: vi.fn(() => false) };
});

describe("ChromaBlurTransition", () => {
  beforeEach(() => {
    installWebglMock();
  });

  afterEach(() => {
    uninstallWebglMock();
    vi.mocked(useReducedMotion).mockReturnValue(false);
  });

  it("renders the active content", () => {
    const { getByText } = render(
      <ChromaBlurTransition transitionKey="draft">
        Draft saved
      </ChromaBlurTransition>
    );

    expect(getByText("Draft saved")).toBeInTheDocument();
  });

  it("runs the chroma sweep, swaps content at the midpoint, and calls onRest", () => {
    const onRest = vi.fn();
    const { getByText, queryByText, rerender } = render(
      <ChromaBlurTransition duration={100} onRest={onRest} transitionKey="a">
        First
      </ChromaBlurTransition>
    );

    expect(getByText("First")).toBeInTheDocument();

    rerender(
      <ChromaBlurTransition duration={100} onRest={onRest} transitionKey="b">
        Second
      </ChromaBlurTransition>
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
      <ChromaBlurTransition onRest={onRest} transitionKey="a">
        First
      </ChromaBlurTransition>
    );

    rerender(
      <ChromaBlurTransition onRest={onRest} transitionKey="b">
        Second
      </ChromaBlurTransition>
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
      <ChromaBlurTransition onRest={onRest} transitionKey="a">
        First
      </ChromaBlurTransition>
    );

    rerender(
      <ChromaBlurTransition onRest={onRest} transitionKey="b">
        Second
      </ChromaBlurTransition>
    );

    expect(queryByText("First")).not.toBeInTheDocument();
    expect(getByText("Second")).toBeInTheDocument();
    expect(onRest).toHaveBeenCalledTimes(1);
  });

  it("does not throw when unmounted mid-animation", () => {
    const { rerender, unmount } = render(
      <ChromaBlurTransition duration={200} transitionKey="a">
        First
      </ChromaBlurTransition>
    );

    rerender(
      <ChromaBlurTransition duration={200} transitionKey="b">
        Second
      </ChromaBlurTransition>
    );

    flushFrames(2);

    expect(() => unmount()).not.toThrow();
    expect(() => flushFrames(2)).not.toThrow();
  });
});
