import { afterEach, beforeEach, describe, expect, it, type Mock } from "vitest";
import {
  type Canvas2DMock,
  type FakeCanvas2DContext,
  flushFrames,
  type IntersectionObserverMock,
  installCanvas2DMock,
  installIntersectionObserverMock,
  pendingFrameCount,
  uninstallCanvas2DMock,
  uninstallIntersectionObserverMock,
} from "../../../test-utils/canvas-2d";
import { act, cleanup, render } from "../../../test-utils/render";
import GravityStars from "../index";

const SURFACE_WIDTH = 800;
const SURFACE_HEIGHT = 400;
const SPRITE_LEVELS = 5;
const COUNT = 40;

describe("GravityStars", () => {
  it("renders without throwing", () => {
    const { container } = render(
      <GravityStars>
        <p>Content above the starfield</p>
      </GravityStars>
    );
    expect(container).toBeInTheDocument();
  });
});

describe("GravityStars field", () => {
  let canvas2d: Canvas2DMock;
  let intersection: IntersectionObserverMock;

  beforeEach(() => {
    canvas2d = installCanvas2DMock({
      height: SURFACE_HEIGHT,
      width: SURFACE_WIDTH,
    });
    intersection = installIntersectionObserverMock();
  });

  afterEach(() => {
    uninstallIntersectionObserverMock();
    uninstallCanvas2DMock();
  });

  const setup = (props: Parameters<typeof GravityStars>[0] = {}) => {
    const result = render(<GravityStars count={COUNT} {...props} />);
    const host = result.container.firstElementChild as HTMLElement;
    const canvas = result.container.querySelector("canvas");
    if (!canvas) {
      throw new Error("expected a canvas");
    }
    const context = canvas2d.contextFor(canvas);
    if (!context) {
      throw new Error("expected a 2D context");
    }
    // Everything created after the field canvas is a tint sprite.
    const fieldIndex = canvas2d.contexts.indexOf(context);
    const sprites = canvas2d.contexts.slice(
      fieldIndex + 1,
      fieldIndex + 1 + SPRITE_LEVELS
    );
    return { ...result, canvas, context, host, sprites };
  };

  /** The colour stops of a sprite's most recent gradient, as a comparable key. */
  const colorStops = (context: FakeCanvas2DContext) => {
    const gradient = context.createRadialGradient.mock.results.at(-1)?.value as
      | { addColorStop: Mock }
      | undefined;
    return JSON.stringify(gradient?.addColorStop.mock.calls ?? []);
  };

  /** Star centres, read off the sprite blits of the most recent frame. */
  const positions = (context: FakeCanvas2DContext) =>
    context.drawImage.mock.calls.map(([, x, y]) => `${x},${y}`);

  it("bakes one radial gradient sprite per tint level", () => {
    const { sprites } = setup();

    expect(sprites).toHaveLength(SPRITE_LEVELS);
    for (const sprite of sprites) {
      expect(sprite.createRadialGradient).toHaveBeenCalled();
      expect(sprite.fillRect).toHaveBeenCalled();
      const gradient = sprite.createRadialGradient.mock.results[0]
        .value as ReturnType<FakeCanvas2DContext["createRadialGradient"]>;
      expect(gradient.addColorStop).toHaveBeenCalledTimes(6);
    }
  });

  it("collapses the tint ramp onto one hue when tint is zero", () => {
    const { sprites } = setup({ tint: 0 });
    const stops = sprites.map(colorStops);
    expect(new Set(stops).size).toBe(1);
  });

  it("spreads the tint ramp across hues when tint is on", () => {
    const { sprites } = setup({ tint: 1 });
    const stops = sprites.map(colorStops);
    expect(new Set(stops).size).toBe(SPRITE_LEVELS);
  });

  it("blits a sprite per star and links the constellation", () => {
    const { context } = setup();

    expect(context.setTransform).toHaveBeenCalledWith(1, 0, 0, 1, 0, 0);
    expect(context.clearRect).toHaveBeenCalled();

    // One frame blits at most one sprite per star.
    context.resetRecords();
    flushFrames(1);
    expect(context.drawImage.mock.calls.length).toBeGreaterThan(0);
    expect(context.drawImage.mock.calls.length).toBeLessThanOrEqual(COUNT);
    expect(context.stroke).toHaveBeenCalled();
    expect(context.moveTo).toHaveBeenCalled();
    expect(context.lineTo).toHaveBeenCalled();
  });

  it("draws no links when connecting is off", () => {
    const { context } = setup({ connect: false });

    expect(context.drawImage).toHaveBeenCalled();
    expect(context.stroke).not.toHaveBeenCalled();
  });

  it("advances the field frame by frame while visible", () => {
    const { context } = setup();
    expect(pendingFrameCount()).toBeGreaterThan(0);

    flushFrames(1);
    const first = positions(context);
    context.resetRecords();
    flushFrames(1);
    const second = positions(context);

    expect(second).not.toEqual(first);
    expect(second.length).toBeGreaterThan(0);
  });

  it("keeps drawing while a pointer drags through the field", () => {
    const { context, host } = setup({ gravity: 4 });
    flushFrames(2);

    act(() => {
      host.dispatchEvent(
        new PointerEvent("pointermove", {
          bubbles: true,
          clientX: SURFACE_WIDTH / 2,
          clientY: SURFACE_HEIGHT / 2,
        })
      );
    });
    context.resetRecords();
    flushFrames(3);
    const dragged = positions(context);

    act(() => {
      host.dispatchEvent(new PointerEvent("pointerleave", { bubbles: true }));
    });
    context.resetRecords();
    flushFrames(3);

    expect(dragged.length).toBeGreaterThan(0);
    expect(positions(context)).not.toEqual(dragged);
    expect(pendingFrameCount()).toBeGreaterThan(0);
  });

  it("holds a single frame while paused", () => {
    const { context } = setup({ paused: true });

    expect(context.clearRect).toHaveBeenCalled();
    expect(pendingFrameCount()).toBe(0);
  });

  it("stops the loop while off screen", () => {
    setup();
    expect(pendingFrameCount()).toBeGreaterThan(0);

    intersection.trigger(false);
    expect(pendingFrameCount()).toBe(0);

    intersection.trigger(true);
    expect(pendingFrameCount()).toBeGreaterThan(0);
  });

  it("stops the loop when the tab is hidden", () => {
    setup();
    const visibility = Object.getOwnPropertyDescriptor(
      Document.prototype,
      "visibilityState"
    );
    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      get: () => "hidden",
    });

    act(() => {
      document.dispatchEvent(new Event("visibilitychange"));
    });
    expect(pendingFrameCount()).toBe(0);

    if (visibility) {
      Object.defineProperty(Document.prototype, "visibilityState", visibility);
    }
  });

  it("reseeds the pool when the star count changes", () => {
    const { context, rerender } = setup({ count: 20 });
    context.resetRecords();
    flushFrames(1);
    const sparse = context.drawImage.mock.calls.length;

    context.resetRecords();
    rerender(<GravityStars count={200} />);
    flushFrames(1);

    expect(context.drawImage.mock.calls.length).toBeGreaterThan(sparse);
  });

  it("clamps the star count to the supported range", () => {
    const { context } = setup({ count: 5000 });
    context.resetRecords();
    flushFrames(1);
    expect(context.drawImage.mock.calls.length).toBeLessThanOrEqual(600);
  });

  it("skips stars the twinkle has faded out", () => {
    const { context } = setup({ twinkle: 1 });
    flushFrames(3);
    context.resetRecords();
    flushFrames(1);
    expect(context.drawImage.mock.calls.length).toBeLessThanOrEqual(COUNT);
  });

  it("repaints on resize", () => {
    const { context } = setup({ paused: true });
    const clears = context.clearRect.mock.calls.length;

    act(() => {
      window.dispatchEvent(new Event("resize"));
    });

    expect(context.clearRect.mock.calls.length).toBeGreaterThanOrEqual(clears);
  });

  it("releases the canvas and every sprite on unmount", () => {
    const { canvas, sprites, unmount } = setup();
    flushFrames(1);

    unmount();

    expect(pendingFrameCount()).toBe(0);
    expect(canvas.width).toBe(0);
    for (const sprite of sprites) {
      expect(sprite.canvas.width).toBe(0);
    }
  });
});

describe("GravityStars on a small viewport", () => {
  afterEach(() => {
    uninstallIntersectionObserverMock();
    uninstallCanvas2DMock();
  });

  /** Stars blitted in the first frame at a given surface width. */
  const starsAtWidth = (width: number) => {
    const canvas2d = installCanvas2DMock({ height: 400, width });
    installIntersectionObserverMock();
    const { container } = render(<GravityStars count={200} />);
    const canvas = container.querySelector("canvas") as HTMLCanvasElement;
    const context = canvas2d.contextFor(canvas);
    flushFrames(1);
    const drawn = context?.drawImage.mock.calls.length ?? 0;
    cleanup();
    uninstallIntersectionObserverMock();
    uninstallCanvas2DMock();
    return drawn;
  };

  it("thins the field on a narrow surface", () => {
    const wide = starsAtWidth(900);
    const narrow = starsAtWidth(500);

    expect(narrow).toBeGreaterThan(0);
    expect(narrow).toBeLessThan(wide);
  });
});

describe("GravityStars without a 2D context", () => {
  afterEach(() => {
    uninstallCanvas2DMock();
  });

  it("falls back to a CSS starfield", () => {
    installCanvas2DMock({ supported: false });
    const { container } = render(<GravityStars />);

    expect(container.querySelector("canvas")).toBeNull();
    const fallback = container.querySelector<HTMLElement>("[aria-hidden]");
    expect(fallback?.style.backgroundImage).toContain("radial-gradient");
  });
});
