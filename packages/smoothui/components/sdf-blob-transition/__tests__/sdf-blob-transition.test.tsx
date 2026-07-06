import { useReducedMotion } from "motion/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "../../../test-utils/render";
import {
  flushFrames,
  installWebglMock,
  runFramesFor,
  uninstallWebglMock,
} from "../../../test-utils/webgl-mock";
import SdfBlobTransition, { type SdfBlobVariant } from "../index";

vi.mock("motion/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("motion/react")>();
  return { ...actual, useReducedMotion: vi.fn(() => false) };
});

const ALL_VARIANTS: SdfBlobVariant[] = [
  "circle",
  "warped",
  "merge",
  "radial",
  "final",
];

describe("SdfBlobTransition", () => {
  beforeEach(() => {
    installWebglMock();
  });

  afterEach(() => {
    uninstallWebglMock();
    vi.mocked(useReducedMotion).mockReturnValue(false);
  });

  it("renders the active content", () => {
    const { getByText } = render(
      <SdfBlobTransition transitionKey="draft">Draft saved</SdfBlobTransition>
    );

    expect(getByText("Draft saved")).toBeInTheDocument();
  });

  it("runs the blob morph, swaps content at the midpoint, and calls onRest", () => {
    const onRest = vi.fn();
    const { getByText, queryByText, rerender } = render(
      <SdfBlobTransition duration={100} onRest={onRest} transitionKey="a">
        First
      </SdfBlobTransition>
    );

    expect(getByText("First")).toBeInTheDocument();

    rerender(
      <SdfBlobTransition duration={100} onRest={onRest} transitionKey="b">
        Second
      </SdfBlobTransition>
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
      <SdfBlobTransition onRest={onRest} transitionKey="a">
        First
      </SdfBlobTransition>
    );

    rerender(
      <SdfBlobTransition onRest={onRest} transitionKey="b">
        Second
      </SdfBlobTransition>
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
      <SdfBlobTransition onRest={onRest} transitionKey="a">
        First
      </SdfBlobTransition>
    );

    rerender(
      <SdfBlobTransition onRest={onRest} transitionKey="b">
        Second
      </SdfBlobTransition>
    );

    expect(queryByText("First")).not.toBeInTheDocument();
    expect(getByText("Second")).toBeInTheDocument();
    expect(onRest).toHaveBeenCalledTimes(1);
  });

  it("does not throw when unmounted mid-animation", () => {
    const { rerender, unmount } = render(
      <SdfBlobTransition duration={200} transitionKey="a">
        First
      </SdfBlobTransition>
    );

    rerender(
      <SdfBlobTransition duration={200} transitionKey="b">
        Second
      </SdfBlobTransition>
    );

    flushFrames(2);

    expect(() => unmount()).not.toThrow();
    expect(() => flushFrames(2)).not.toThrow();
  });

  for (const variant of ALL_VARIANTS) {
    it(`renders and animates the "${variant}" variant without throwing`, () => {
      const onRest = vi.fn();
      const { getByText, rerender } = render(
        <SdfBlobTransition
          duration={80}
          onRest={onRest}
          transitionKey="a"
          variant={variant}
        >
          First
        </SdfBlobTransition>
      );

      rerender(
        <SdfBlobTransition
          duration={80}
          onRest={onRest}
          transitionKey="b"
          variant={variant}
        >
          Second
        </SdfBlobTransition>
      );

      expect(() => runFramesFor(300)).not.toThrow();
      expect(getByText("Second")).toBeInTheDocument();
      expect(onRest).toHaveBeenCalledTimes(1);
    });
  }
});
