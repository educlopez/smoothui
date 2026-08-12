import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "../../../test-utils/render";
import MagneticField from "../index";

type MatchMediaOptions = {
  hover?: boolean;
  reducedMotion?: boolean;
};

type MockMediaQueryList = {
  addEventListener: (type: string, handler: () => void) => void;
  addListener: () => void;
  dispatchEvent: () => boolean;
  matches: boolean;
  media: string;
  onchange: null;
  removeEventListener: () => void;
  removeListener: () => void;
  _changeHandler?: () => void;
};

// `motion`'s useReducedMotion() reads window.matchMedia("(prefers-reduced-motion)")
// exactly once per process (module-level singleton in motion-dom), the first time
// any component in this file calls the hook, and only ever updates afterwards via
// a "change" event dispatched on that original MediaQueryList. Reassigning
// window.matchMedia in a later test has no effect on that cached value, so we
// capture the very first reduced-motion query object here and, when a test needs
// reduced motion to be "on", flip its `matches` flag and invoke the handler
// motion-dom itself registered.
let reducedMotionRecord: MockMediaQueryList | null = null;

const mockMatchMedia = ({
  hover = false,
  reducedMotion = false,
}: MatchMediaOptions = {}) => {
  window.matchMedia = vi.fn().mockImplementation((query: string) => {
    const isReducedMotionQuery = query.includes("prefers-reduced-motion");
    const record: MockMediaQueryList = {
      addEventListener: (type, handler) => {
        if (type === "change") {
          record._changeHandler = handler;
        }
      },
      addListener: () => {},
      dispatchEvent: () => false,
      matches: isReducedMotionQuery ? reducedMotion : hover,
      media: query,
      onchange: null,
      removeEventListener: () => {},
      removeListener: () => {},
    };
    if (isReducedMotionQuery && !reducedMotionRecord) {
      reducedMotionRecord = record;
    }
    return record;
  });
};

const forceReducedMotion = () => {
  if (!reducedMotionRecord) {
    throw new Error(
      "reducedMotionRecord was never captured; render a MagneticField first"
    );
  }
  reducedMotionRecord.matches = true;
  reducedMotionRecord._changeHandler?.();
};

let frameQueue: FrameRequestCallback[];

const stubRaf = () => {
  frameQueue = [];
  vi.stubGlobal(
    "requestAnimationFrame",
    vi.fn((cb: FrameRequestCallback) => {
      frameQueue.push(cb);
      return frameQueue.length;
    })
  );
  vi.stubGlobal("cancelAnimationFrame", vi.fn());
};

// Runs whatever frames are currently queued, `count` times in sequence, each
// `stepMs` further along the clock. The physics integrator needs at least
// two ticks before velocity/position actually move (the first tick only
// seeds `lastFrameRef`), so tests generally advance several frames.
const advanceFrames = (count: number, stepMs = 16) => {
  let time = 0;
  for (let i = 0; i < count; i++) {
    time += stepMs;
    const pending = frameQueue.splice(0, frameQueue.length);
    for (const cb of pending) {
      cb(time);
    }
  }
};

describe("MagneticField", () => {
  beforeEach(() => {
    stubRaf();
    mockMatchMedia({ hover: true });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("renders without throwing", () => {
    const { container } = render(
      <MagneticField>
        <button type="button">Item</button>
      </MagneticField>
    );
    expect(container).toBeInTheDocument();
  });

  it("renders in repel mode", () => {
    const { container } = render(
      <MagneticField mode="repel">
        <button type="button">Item</button>
      </MagneticField>
    );
    expect(container).toBeInTheDocument();
  });

  it("discovers data-magnetic descendants and moves them toward the pointer in attract mode", () => {
    const { container } = render(
      <MagneticField mode="attract">
        <button data-magnetic type="button">
          Item
        </button>
      </MagneticField>
    );
    const root = container.firstChild as HTMLElement;
    const button = screen.getByRole("button");

    fireEvent.pointerMove(root, { clientX: 30, clientY: 40 });
    advanceFrames(6);

    const match = button.style.transform.match(
      /translate3d\(([-\d.]+)px, ([-\d.]+)px, 0\)/
    );
    expect(match).not.toBeNull();
    const [, x, y] = match as RegExpMatchArray;
    // Attract pulls the element in the same direction as the pointer offset.
    expect(Number(x)).toBeGreaterThan(0);
    expect(Number(y)).toBeGreaterThan(0);
  });

  it("moves discovered participants away from the pointer in repel mode", () => {
    const { container } = render(
      <MagneticField mode="repel">
        <button data-magnetic type="button">
          Item
        </button>
      </MagneticField>
    );
    const root = container.firstChild as HTMLElement;
    const button = screen.getByRole("button");

    fireEvent.pointerMove(root, { clientX: 30, clientY: 40 });
    advanceFrames(6);

    const match = button.style.transform.match(
      /translate3d\(([-\d.]+)px, ([-\d.]+)px, 0\)/
    );
    expect(match).not.toBeNull();
    const [, x, y] = match as RegExpMatchArray;
    // Repel pushes the element away from the pointer (opposite sign).
    expect(Number(x)).toBeLessThan(0);
    expect(Number(y)).toBeLessThan(0);
  });

  it("applies a tangential offset in orbit mode that differs from a plain attract pull", () => {
    const { container } = render(
      <MagneticField mode="orbit">
        <button data-magnetic type="button">
          Item
        </button>
      </MagneticField>
    );
    const root = container.firstChild as HTMLElement;
    const button = screen.getByRole("button");

    fireEvent.pointerMove(root, { clientX: 30, clientY: 40 });
    advanceFrames(6);

    const match = button.style.transform.match(
      /translate3d\(([-\d.]+)px, ([-\d.]+)px, 0\)/
    );
    expect(match).not.toBeNull();
    const [, x, y] = match as RegExpMatchArray;
    // Orbit combines a radial pull with a tangential swirl: for this pointer
    // offset the tangential term dominates and flips the sign of each axis
    // relative to a plain attract pull (which would be positive/positive).
    expect(Number(x)).toBeLessThan(0);
    expect(Number(y)).toBeGreaterThan(0);
  });

  it("discovers participants supplied via the items prop and moves their wrapper", () => {
    render(
      <MagneticField
        items={[
          {
            element: <button type="button">Orb</button>,
            id: "orb",
          },
        ]}
        mode="attract"
      >
        <div />
      </MagneticField>
    );

    const button = screen.getByRole("button", { name: "Orb" });
    const wrapper = button.parentElement as HTMLElement;
    const root = wrapper.parentElement as HTMLElement;

    fireEvent.pointerMove(root, { clientX: 30, clientY: 40 });
    advanceFrames(6);

    expect(wrapper.style.transform).not.toBe("");
  });

  it("does nothing while paused, leaving participants at rest", () => {
    const { container } = render(
      <MagneticField mode="attract" paused>
        <button data-magnetic type="button">
          Item
        </button>
      </MagneticField>
    );
    const root = container.firstChild as HTMLElement;
    const button = screen.getByRole("button");

    fireEvent.pointerMove(root, { clientX: 30, clientY: 40 });
    advanceFrames(6);

    expect(button.style.transform).toBe(
      "translate3d(0px, 0px, 0) rotate(0deg)"
    );
  });

  // NOTE: this test permanently flips motion's cached reduced-motion
  // singleton for the rest of this file (see the comment above
  // `reducedMotionRecord`), so it must stay last in this describe block.
  it("ignores pointer movement entirely once reduced motion is preferred", () => {
    forceReducedMotion();

    const { container } = render(
      <MagneticField mode="attract">
        <button data-magnetic type="button">
          Item
        </button>
      </MagneticField>
    );
    const root = container.firstChild as HTMLElement;
    const button = screen.getByRole("button");

    // The pointer-tracking effect never attaches its listeners in this mode,
    // so this pointermove is a no-op and the participant stays at rest even
    // after frames run.
    fireEvent.pointerMove(root, { clientX: 30, clientY: 40 });
    advanceFrames(6);

    expect(button.style.transform).toBe(
      "translate3d(0px, 0px, 0) rotate(0deg)"
    );
  });
});
