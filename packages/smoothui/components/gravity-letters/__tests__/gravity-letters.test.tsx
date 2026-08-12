import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render } from "../../../test-utils/render";
import GravityLetters from "../index";

const CONTAINER_RECT = {
  bottom: 60,
  height: 60,
  left: 0,
  right: 200,
  toJSON: () => ({}),
  top: 0,
  width: 200,
  x: 0,
  y: 0,
};

const mockContainerRect = (el: Element) => {
  vi.spyOn(el, "getBoundingClientRect").mockReturnValue(CONTAINER_RECT);
};

let frameQueue: FrameRequestCallback[];
let currentTime: number;

const stubTiming = () => {
  frameQueue = [];
  currentTime = 0;
  vi.stubGlobal(
    "requestAnimationFrame",
    vi.fn((cb: FrameRequestCallback) => {
      frameQueue.push(cb);
      return frameQueue.length;
    })
  );
  vi.stubGlobal("cancelAnimationFrame", vi.fn());
  vi.spyOn(performance, "now").mockImplementation(() => currentTime);
};

// Advances the shared clock and runs whatever rAF callbacks are currently
// queued, `count` times. The physics loop reads `performance.now()` for
// stagger release times, so the clock and the queued callbacks must move
// together.
const advanceFrames = (count: number, stepMs = 16) => {
  for (let i = 0; i < count; i++) {
    currentTime += stepMs;
    const pending = frameQueue.splice(0, frameQueue.length);
    for (const cb of pending) {
      cb(currentTime);
    }
  }
};

const getLetterSpans = (container: HTMLElement) =>
  Array.from(container.querySelectorAll<HTMLElement>(".will-change-transform"));

const parseTransform = (transform: string) => {
  const match = transform.match(
    /translate3d\(([-\d.]+)px, ([-\d.]+)px, 0\) rotate\(([-\d.]+)deg\)/
  );
  if (!match) {
    return null;
  }
  const [, x, y, rotate] = match;
  return { rotate: Number(rotate), x: Number(x), y: Number(y) };
};

describe("GravityLetters", () => {
  beforeEach(() => {
    stubTiming();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("renders without throwing", () => {
    const { container } = render(<GravityLetters text="Hello" />);
    expect(container).toBeInTheDocument();
  });

  it("renders with a click trigger and collapsed state", () => {
    const { container } = render(
      <GravityLetters collapsed text="Gravity" trigger="click" />
    );
    expect(container).toBeInTheDocument();
  });

  it("always renders the accessible text, regardless of trigger or animation phase", () => {
    const { container } = render(
      <GravityLetters text="Drop" trigger="hover" />
    );
    const root = container.firstChild as HTMLElement;
    mockContainerRect(root);

    const srOnly = () => container.querySelector(".sr-only");
    expect(srOnly()).toHaveTextContent("Drop");

    fireEvent.mouseEnter(root);
    expect(srOnly()).toHaveTextContent("Drop");

    advanceFrames(10);
    expect(srOnly()).toHaveTextContent("Drop");

    fireEvent.mouseLeave(root);
    advanceFrames(10);
    expect(srOnly()).toHaveTextContent("Drop");
  });

  it("falls apart on hover and integrates gravity over several frames", () => {
    const { container } = render(
      <GravityLetters text="Drop" trigger="hover" />
    );
    const root = container.firstChild as HTMLElement;
    mockContainerRect(root);

    const [firstLetter] = getLetterSpans(container);
    const before = parseTransform(firstLetter.style.transform);
    expect(before).toEqual({ rotate: 0, x: 0, y: 0 });

    fireEvent.mouseEnter(root);
    // Stagger is 40ms by default; a handful of 16ms frames releases every
    // letter and lets gravity pull it down before any of them settle.
    advanceFrames(5);

    const after = parseTransform(firstLetter.style.transform);
    expect(after).not.toBeNull();
    // Gravity only ever pulls down, regardless of the randomized horizontal
    // velocity and spin each letter gets on release.
    expect(after?.y).toBeGreaterThan(0);
  });

  it("reforms back to the origin position after the hover ends", () => {
    const { container } = render(
      <GravityLetters text="Drop" trigger="hover" />
    );
    const root = container.firstChild as HTMLElement;
    mockContainerRect(root);

    const [firstLetter] = getLetterSpans(container);

    fireEvent.mouseEnter(root);
    advanceFrames(5);
    expect(parseTransform(firstLetter.style.transform)?.y).toBeGreaterThan(0);

    fireEvent.mouseLeave(root);
    // Run enough frames for the reforming spring to settle back to rest.
    advanceFrames(120);

    expect(firstLetter.style.transform).toBe(
      "translate3d(0px, 0px, 0) rotate(0deg)"
    );
  });

  it("toggles collapse on focus/blur exactly like hover", () => {
    const { container } = render(
      <GravityLetters text="Drop" trigger="hover" />
    );
    const root = container.firstChild as HTMLElement;
    mockContainerRect(root);

    const [firstLetter] = getLetterSpans(container);

    fireEvent.focus(root);
    advanceFrames(5);
    expect(parseTransform(firstLetter.style.transform)?.y).toBeGreaterThan(0);

    fireEvent.blur(root);
    advanceFrames(120);
    expect(firstLetter.style.transform).toBe(
      "translate3d(0px, 0px, 0) rotate(0deg)"
    );
  });

  it("toggles collapse on click and via the Enter/Space keys", () => {
    const onCollapsedChange = vi.fn();
    const { container } = render(
      <GravityLetters
        onCollapsedChange={onCollapsedChange}
        text="Drop"
        trigger="click"
      />
    );
    const root = container.firstChild as HTMLElement;
    mockContainerRect(root);

    const [firstLetter] = getLetterSpans(container);

    fireEvent.click(root);
    expect(onCollapsedChange).toHaveBeenLastCalledWith(true);
    advanceFrames(5);
    expect(parseTransform(firstLetter.style.transform)?.y).toBeGreaterThan(0);

    fireEvent.keyDown(root, { key: "Enter" });
    expect(onCollapsedChange).toHaveBeenLastCalledWith(false);

    fireEvent.click(root);
    fireEvent.keyDown(root, { key: " " });
    expect(onCollapsedChange).toHaveBeenLastCalledWith(false);
  });

  it("drives the fall purely from the controlled `collapsed` prop in manual mode", () => {
    const { container, rerender } = render(
      <GravityLetters collapsed={false} text="Drop" trigger="manual" />
    );
    const root = container.firstChild as HTMLElement;
    mockContainerRect(root);

    // Manual mode attaches no pointer/keyboard handlers.
    expect(root).not.toHaveAttribute("role");
    expect(root).not.toHaveAttribute("tabindex");

    const [firstLetter] = getLetterSpans(container);

    rerender(<GravityLetters collapsed text="Drop" trigger="manual" />);
    advanceFrames(5);
    expect(parseTransform(firstLetter.style.transform)?.y).toBeGreaterThan(0);

    rerender(<GravityLetters collapsed={false} text="Drop" trigger="manual" />);
    advanceFrames(120);
    expect(firstLetter.style.transform).toBe(
      "translate3d(0px, 0px, 0) rotate(0deg)"
    );
  });
});
