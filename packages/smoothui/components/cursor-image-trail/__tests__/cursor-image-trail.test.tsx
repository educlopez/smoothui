import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { act, fireEvent, render } from "../../../test-utils/render";
import CursorImageTrail, { type CursorTrailImage } from "../index";

const images: CursorTrailImage[] = [
  { alt: "Sample one", src: "/images/one.jpg" },
  { alt: "Sample two", src: "/images/two.jpg" },
];

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
// exactly once per test file (module-level singleton in motion-dom), the first
// time any component in this file calls the hook, and only ever updates
// afterwards via a "change" event dispatched on that original MediaQueryList.
// Reassigning window.matchMedia in a later test has no effect on that cached
// value, so we capture the very first reduced-motion query object here and,
// when a test needs reduced motion to be "on", flip its `matches` flag and
// invoke the handler motion-dom itself registered.
let reducedMotionRecord: MockMediaQueryList | null = null;

const mockMatchMedia = (hoverMatches: boolean) => {
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
      matches: isReducedMotionQuery ? false : hoverMatches,
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
      "reducedMotionRecord was never captured; render a CursorImageTrail first"
    );
  }
  reducedMotionRecord.matches = true;
  reducedMotionRecord._changeHandler?.();
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

// Runs whichever frame is currently queued at an *absolute* clock time,
// giving exact control over `elapsed = now - slot.startTime` for lifetime
// decay assertions.
const runFrameAt = (absoluteTime: number) => {
  currentTime = absoluteTime;
  const pending = Array.from(scheduled.entries());
  scheduled.clear();
  act(() => {
    for (const [, cb] of pending) {
      cb(currentTime);
    }
  });
};

describe("CursorImageTrail", () => {
  beforeEach(() => {
    stubTiming();
    mockMatchMedia(true);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <CursorImageTrail images={images} poolSize={2}>
        <p>Hover area</p>
      </CursorImageTrail>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders without throwing", () => {
    const { container } = render(
      <CursorImageTrail images={images}>
        <p>Hover area</p>
      </CursorImageTrail>
    );
    expect(container).toBeInTheDocument();
  });

  it("only spawns once the pointer has moved past `distance`", () => {
    const { container } = render(
      <CursorImageTrail distance={40} images={images} poolSize={2}>
        <p>Hover area</p>
      </CursorImageTrail>
    );
    const root = container.firstChild as HTMLElement;
    const img = container.querySelector("img") as HTMLImageElement;

    fireEvent.pointerEnter(root, { clientX: 0, clientY: 0 });
    runFrameAt(10); // Establishes the spawn baseline; no spawn yet.

    fireEvent.pointerMove(root, { clientX: 10, clientY: 0 });
    runFrameAt(20); // Only moved 10px, under the 40px threshold.

    expect(img.getAttribute("src")).toContain("one.jpg");

    fireEvent.pointerMove(root, { clientX: 50, clientY: 0 });
    runFrameAt(30); // Now 50px from baseline, past the threshold: spawns.

    // The spawned slot's transform is stamped with the spawn position.
    expect(img.style.transform).toContain("translate3d(50px, 0px, 0)");
  });

  it("recycles pool slots instead of growing the DOM when spawns exceed poolSize", () => {
    const { container } = render(
      <CursorImageTrail distance={10} images={images} poolSize={3}>
        <p>Hover area</p>
      </CursorImageTrail>
    );
    const root = container.firstChild as HTMLElement;

    const imagesBefore = Array.from(container.querySelectorAll("img"));
    expect(imagesBefore).toHaveLength(3);

    fireEvent.pointerEnter(root, { clientX: 0, clientY: 0 });
    runFrameAt(10);

    // 4 spawns on a pool of 3: the 4th must recycle slot 0.
    for (let i = 1; i <= 4; i++) {
      fireEvent.pointerMove(root, { clientX: i * 100, clientY: 0 });
      runFrameAt(10 + i * 10);
    }

    const imagesAfter = Array.from(container.querySelectorAll("img"));
    // Same node count, and the very same DOM nodes: the pool never grows.
    expect(imagesAfter).toHaveLength(3);
    expect(imagesAfter).toEqual(imagesBefore);

    // Slot 0 held image[0] after spawn 1, then got recycled by spawn 4
    // (spawn index 3 % poolSize 3 === 0) and now holds image[1].
    expect(imagesAfter[0].getAttribute("src")).toContain("two.jpg");
  });

  it("fades a spawned trail image in, holds it, then fades and clears it over its lifetime", () => {
    const { container } = render(
      <CursorImageTrail
        distance={10}
        images={images}
        lifetime={100}
        poolSize={1}
        velocityScale={0}
      >
        <p>Hover area</p>
      </CursorImageTrail>
    );
    const root = container.firstChild as HTMLElement;
    const img = container.querySelector("img") as HTMLImageElement;

    fireEvent.pointerEnter(root, { clientX: 0, clientY: 0 });
    runFrameAt(10); // Baseline, no spawn.

    fireEvent.pointerMove(root, { clientX: 50, clientY: 0 });
    runFrameAt(20); // Spawns at startTime=20, elapsed=0 in the same tick.
    expect(img.style.opacity).toBe("0");

    runFrameAt(30); // elapsed=10, progress=0.1 (entering: 0 < opacity < 1).
    const entering = Number(img.style.opacity);
    expect(entering).toBeGreaterThan(0);
    expect(entering).toBeLessThan(1);

    runFrameAt(60); // elapsed=40, progress=0.4 (steady phase).
    expect(img.style.opacity).toBe("1");

    runFrameAt(100); // elapsed=80, progress=0.8 (exiting: fading back out).
    const exiting = Number(img.style.opacity);
    expect(exiting).toBeGreaterThan(0);
    expect(exiting).toBeLessThan(1);

    runFrameAt(130); // elapsed=110 > lifetime: slot deactivates and clears.
    expect(img.style.opacity).toBe("0");
  });

  // NOTE: this test permanently flips motion's cached reduced-motion
  // singleton for the rest of this file (see the comment above
  // `reducedMotionRecord`), so it must stay last in this describe block.
  it("skips the trail pool entirely, and ignores pointer movement, once reduced motion is preferred", () => {
    forceReducedMotion();

    const { container } = render(
      <CursorImageTrail images={images}>
        <p>Hover area</p>
      </CursorImageTrail>
    );
    const root = container.firstChild as HTMLElement;

    // `effectEnabled` is false, so the pool markup that owns the trail
    // listeners is never mounted in the first place.
    expect(container.querySelectorAll("img")).toHaveLength(0);

    // Confirms the effect's early return: without the pool, pointer
    // movement that would otherwise spawn trail images is a pure no-op.
    fireEvent.pointerEnter(root, { clientX: 0, clientY: 0 });
    fireEvent.pointerMove(root, { clientX: 200, clientY: 0 });
    expect(container.querySelectorAll("img")).toHaveLength(0);
  });
});
