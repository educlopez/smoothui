import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "../../../test-utils/render";
import OrbitalImageWheel, { type OrbitalImageWheelItem } from "../index";

const items: OrbitalImageWheelItem[] = [
  { alt: "First", id: "a", image: "https://example.com/a.png" },
  { alt: "Second", id: "b", image: "https://example.com/b.png" },
  { alt: "Third", id: "c", image: "https://example.com/c.png" },
];

const mockMatchMedia = (hoverMatches: boolean) => {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    addEventListener: vi.fn(),
    addListener: vi.fn(),
    dispatchEvent: vi.fn(),
    matches: hoverMatches,
    media: query,
    onchange: null,
    removeEventListener: vi.fn(),
    removeListener: vi.fn(),
  }));
};

let scheduled: Map<number, FrameRequestCallback>;
let nextFrameId: number;
let currentTime: number;

const stubTiming = () => {
  scheduled = new Map();
  nextFrameId = 1;
  currentTime = 0;
  vi.stubGlobal(
    "requestAnimationFrame",
    vi.fn((cb: FrameRequestCallback) => {
      const id = nextFrameId++;
      scheduled.set(id, cb);
      return id;
    })
  );
  vi.stubGlobal(
    "cancelAnimationFrame",
    vi.fn((id: number) => {
      scheduled.delete(id);
    })
  );
  vi.spyOn(performance, "now").mockImplementation(() => currentTime);
};

// Advances the shared clock and runs whatever frames are currently
// scheduled, `count` times. Uses cancelAnimationFrame-aware bookkeeping so
// pausing (which really calls cancelAnimationFrame) actually stops a loop
// instead of firing one more "ghost" frame.
const advanceFrames = (count: number, stepMs = 16) => {
  for (let i = 0; i < count; i++) {
    currentTime += stepMs;
    const pending = Array.from(scheduled.entries());
    scheduled.clear();
    act(() => {
      for (const [, cb] of pending) {
        cb(currentTime);
      }
    });
  }
};

describe("OrbitalImageWheel", () => {
  beforeEach(() => {
    stubTiming();
    mockMatchMedia(false);
    if (!Element.prototype.setPointerCapture) {
      Element.prototype.setPointerCapture = vi.fn();
    }
    if (!Element.prototype.releasePointerCapture) {
      Element.prototype.releasePointerCapture = vi.fn();
    }
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("renders without throwing", () => {
    const { container } = render(<OrbitalImageWheel items={items} />);
    expect(container).toBeInTheDocument();
  });

  it("renders with auto-rotate disabled and face-outward enabled", () => {
    const { container } = render(
      <OrbitalImageWheel autoRotate={false} faceOutward items={items} />
    );
    expect(container).toBeInTheDocument();
  });

  it("steps one item at a time with the Arrow keys", () => {
    const onRotationChange = vi.fn();
    render(
      <OrbitalImageWheel items={items} onRotationChange={onRotationChange} />
    );
    const wheel = screen.getByRole("application");

    fireEvent.keyDown(wheel, { key: "ArrowRight" });
    advanceFrames(20);

    // 3 items => 120deg steps. ArrowRight steps to -120deg, normalized to 240.
    expect(onRotationChange).toHaveBeenLastCalledWith(240);

    fireEvent.keyDown(wheel, { key: "ArrowLeft" });
    advanceFrames(20);

    // From 240, ArrowLeft adds 120deg back to 360 -> normalized to 0.
    expect(onRotationChange).toHaveBeenLastCalledWith(0);
  });

  it("rotates immediately while dragging and keeps moving via momentum after release", () => {
    const onRotationChange = vi.fn();
    render(
      <OrbitalImageWheel items={items} onRotationChange={onRotationChange} />
    );
    const wheel = screen.getByRole("application");

    fireEvent.pointerDown(wheel, { clientX: 100, pointerId: 1 });
    currentTime = 16;
    fireEvent.pointerMove(wheel, { clientX: 140, pointerId: 1 });

    // Dragging rotates synchronously (no frame needed): dx=40 * sensitivity 0.6 = 24deg.
    expect(onRotationChange).toHaveBeenLastCalledWith(24);

    const callsAtRelease = onRotationChange.mock.calls.length;
    fireEvent.pointerUp(wheel, { pointerId: 1 });
    advanceFrames(3);

    // Momentum keeps advancing rotation for a few frames after release.
    expect(onRotationChange.mock.calls.length).toBeGreaterThan(callsAtRelease);
    const lastValue = onRotationChange.mock.calls.at(-1)?.[0] as number;
    expect(lastValue).toBeGreaterThan(24);
  });

  it("settles to the nearest item after a drag when snap is enabled", () => {
    const onRotationChange = vi.fn();
    render(
      <OrbitalImageWheel
        items={items}
        onRotationChange={onRotationChange}
        snap
      />
    );
    const wheel = screen.getByRole("application");

    fireEvent.pointerDown(wheel, { clientX: 0, pointerId: 1 });
    currentTime = 16;
    fireEvent.pointerMove(wheel, { clientX: 50, pointerId: 1 });
    fireEvent.pointerUp(wheel, { pointerId: 1 });

    // Let momentum decay below the epsilon and the subsequent snap tween finish.
    advanceFrames(300);

    const finalValue = onRotationChange.mock.calls.at(-1)?.[0] as number;
    const remainder = finalValue % 120;
    const distanceFromMultiple = Math.min(remainder, 120 - remainder);
    expect(distanceFromMultiple).toBeLessThan(0.01);
  });

  it("pauses auto-rotate on pointer hover and resumes on pointer leave", () => {
    mockMatchMedia(true);
    const onRotationChange = vi.fn();
    render(
      <OrbitalImageWheel
        autoRotate
        autoRotateSpeed={360}
        items={items}
        onRotationChange={onRotationChange}
      />
    );
    const wheel = screen.getByRole("application");

    advanceFrames(3);
    const rotationBeforePause = onRotationChange.mock.calls.at(-1)?.[0] as
      | number
      | undefined;
    expect(rotationBeforePause).toBeGreaterThan(0);

    fireEvent.pointerEnter(wheel);
    const callsWhilePaused = onRotationChange.mock.calls.length;
    advanceFrames(5);
    // No new frames should have been scheduled while paused.
    expect(onRotationChange.mock.calls.length).toBe(callsWhilePaused);

    fireEvent.pointerLeave(wheel);
    advanceFrames(3);
    expect(onRotationChange.mock.calls.length).toBeGreaterThan(
      callsWhilePaused
    );
  });

  it("pauses auto-rotate on focus and resumes on blur", () => {
    const onRotationChange = vi.fn();
    render(
      <OrbitalImageWheel
        autoRotate
        autoRotateSpeed={360}
        items={items}
        onRotationChange={onRotationChange}
      />
    );
    const wheel = screen.getByRole("application");

    fireEvent.focus(wheel);
    const callsWhilePaused = onRotationChange.mock.calls.length;
    advanceFrames(5);
    expect(onRotationChange.mock.calls.length).toBe(callsWhilePaused);

    fireEvent.blur(wheel);
    advanceFrames(3);
    expect(onRotationChange.mock.calls.length).toBeGreaterThan(
      callsWhilePaused
    );
  });

  it("pauses auto-rotate while the document is hidden", () => {
    const onRotationChange = vi.fn();
    render(
      <OrbitalImageWheel
        autoRotate
        autoRotateSpeed={360}
        items={items}
        onRotationChange={onRotationChange}
      />
    );

    advanceFrames(2);

    act(() => {
      Object.defineProperty(document, "hidden", {
        configurable: true,
        value: true,
      });
      document.dispatchEvent(new Event("visibilitychange"));
    });

    const callsWhilePaused = onRotationChange.mock.calls.length;
    advanceFrames(5);
    expect(onRotationChange.mock.calls.length).toBe(callsWhilePaused);

    act(() => {
      Object.defineProperty(document, "hidden", {
        configurable: true,
        value: false,
      });
      document.dispatchEvent(new Event("visibilitychange"));
    });
    advanceFrames(3);
    expect(onRotationChange.mock.calls.length).toBeGreaterThan(
      callsWhilePaused
    );
  });

  it("drives the highlighted item from a controlled rotation and reports changes via onRotationChange", () => {
    const onRotationChange = vi.fn();
    const { rerender } = render(
      <OrbitalImageWheel
        items={items}
        onRotationChange={onRotationChange}
        rotation={0}
      />
    );
    const wheel = screen.getByRole("application");

    fireEvent.keyDown(wheel, { key: "ArrowRight" });
    advanceFrames(20);

    // Controlled mode never mutates internal state on its own; it only
    // reports the requested rotation back to the parent.
    expect(onRotationChange).toHaveBeenLastCalledWith(240);
    expect(screen.getByLabelText("First")).toHaveAttribute(
      "aria-current",
      "true"
    );

    rerender(
      <OrbitalImageWheel
        items={items}
        onRotationChange={onRotationChange}
        rotation={240}
      />
    );
    // At 240deg, item position 1 ("Second") sits at the top of the circle.
    expect(screen.getByLabelText("Second")).toHaveAttribute(
      "aria-current",
      "true"
    );
  });
});
