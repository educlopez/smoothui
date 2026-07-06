import { useReducedMotion } from "motion/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "../../../test-utils/render";
import {
  flushFrames,
  installWebglMock,
  runFramesFor,
  uninstallWebglMock,
} from "../../../test-utils/webgl-mock";
import ShaderRevealTransition, { type ShaderRevealVariant } from "../index";

vi.mock("motion/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("motion/react")>();
  return { ...actual, useReducedMotion: vi.fn(() => false) };
});

const ALL_VARIANTS: ShaderRevealVariant[] = [
  "noise",
  "zoom",
  "circle",
  "wipe",
  "luma",
  "planetary",
  "stripes",
  "push",
];

describe("ShaderRevealTransition", () => {
  beforeEach(() => {
    installWebglMock();
  });

  afterEach(() => {
    uninstallWebglMock();
    vi.mocked(useReducedMotion).mockReturnValue(false);
  });

  it("renders the active content", () => {
    const { getByText } = render(
      <ShaderRevealTransition transitionKey="draft">
        Draft saved
      </ShaderRevealTransition>
    );

    expect(getByText("Draft saved")).toBeInTheDocument();
  });

  it("runs the reveal, swaps content at the midpoint, and calls onRest", () => {
    const onRest = vi.fn();
    const { getByText, queryByText, rerender } = render(
      <ShaderRevealTransition duration={100} onRest={onRest} transitionKey="a">
        First
      </ShaderRevealTransition>
    );

    expect(getByText("First")).toBeInTheDocument();

    rerender(
      <ShaderRevealTransition duration={100} onRest={onRest} transitionKey="b">
        Second
      </ShaderRevealTransition>
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
      <ShaderRevealTransition onRest={onRest} transitionKey="a">
        First
      </ShaderRevealTransition>
    );

    rerender(
      <ShaderRevealTransition onRest={onRest} transitionKey="b">
        Second
      </ShaderRevealTransition>
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
      <ShaderRevealTransition onRest={onRest} transitionKey="a">
        First
      </ShaderRevealTransition>
    );

    rerender(
      <ShaderRevealTransition onRest={onRest} transitionKey="b">
        Second
      </ShaderRevealTransition>
    );

    expect(queryByText("First")).not.toBeInTheDocument();
    expect(getByText("Second")).toBeInTheDocument();
    expect(onRest).toHaveBeenCalledTimes(1);
  });

  it("does not throw when unmounted mid-animation", () => {
    const { rerender, unmount } = render(
      <ShaderRevealTransition duration={200} transitionKey="a">
        First
      </ShaderRevealTransition>
    );

    rerender(
      <ShaderRevealTransition duration={200} transitionKey="b">
        Second
      </ShaderRevealTransition>
    );

    flushFrames(2);

    expect(() => unmount()).not.toThrow();
    expect(() => flushFrames(2)).not.toThrow();
  });

  for (const variant of ALL_VARIANTS) {
    it(`renders and animates the "${variant}" variant without throwing`, () => {
      const onRest = vi.fn();
      const { getByText, rerender } = render(
        <ShaderRevealTransition
          duration={80}
          onRest={onRest}
          transitionKey="a"
          variant={variant}
        >
          First
        </ShaderRevealTransition>
      );

      rerender(
        <ShaderRevealTransition
          duration={80}
          onRest={onRest}
          transitionKey="b"
          variant={variant}
        >
          Second
        </ShaderRevealTransition>
      );

      expect(() => runFramesFor(300)).not.toThrow();
      expect(getByText("Second")).toBeInTheDocument();
      expect(onRest).toHaveBeenCalledTimes(1);
    });
  }
});
