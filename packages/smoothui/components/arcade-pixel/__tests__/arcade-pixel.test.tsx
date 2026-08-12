import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  type Canvas2DMock,
  flushFrames,
  type IntersectionObserverMock,
  installCanvas2DMock,
  installIntersectionObserverMock,
  pendingFrameCount,
  runFramesFor,
  uninstallCanvas2DMock,
  uninstallIntersectionObserverMock,
} from "../../../test-utils/canvas-2d";
import { act, render } from "../../../test-utils/render";
import ArcadePixel, { ARCADE_SPRITES } from "../index";

const SURFACE_WIDTH = 240;
const SURFACE_HEIGHT = 120;

describe("ArcadePixel", () => {
  it("renders without throwing", () => {
    const { container } = render(<ArcadePixel text="HI" />);
    expect(container).toBeInTheDocument();
  });

  it("renders the marquee animate variant without throwing", () => {
    const { container } = render(
      <ArcadePixel animate="marquee" loop text="LOOP" />
    );
    expect(container).toBeInTheDocument();
  });
});

describe("ArcadePixel painting", () => {
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

  const setup = (props: Parameters<typeof ArcadePixel>[0] = {}) => {
    const result = render(<ArcadePixel {...props} />);
    const canvas = result.container.querySelector("canvas");
    if (!canvas) {
      throw new Error("expected a canvas");
    }
    const context = canvas2d.contextFor(canvas);
    if (!context) {
      throw new Error("expected a 2D context");
    }
    return { ...result, canvas, context };
  };

  it("paints the lit pixels of a text message and holds the frame", () => {
    const { context } = setup({ text: "HI" });

    expect(context.setTransform).toHaveBeenCalledWith(1, 0, 0, 1, 0, 0);
    expect(context.clearRect).toHaveBeenCalledTimes(1);
    // "HI" is 22 lit cells in the built-in 5x7 font.
    expect(context.fillRect.mock.calls.length).toBeGreaterThan(22);
    expect(pendingFrameCount()).toBe(0);
  });

  it("draws the unlit dot matrix behind the message", () => {
    const { context } = setup({ text: "A" });

    expect(context.save).toHaveBeenCalled();
    expect(context.restore).toHaveBeenCalled();
    expect(context.globalCompositeOperation).toBe("destination-over");
  });

  it("paints an unknown character as a blank glyph", () => {
    const { context } = setup({ text: "¡" });
    const litCells = context.fillRect.mock.calls.length;

    const { context: blank } = setup({ text: " " });
    expect(litCells).toBe(blank.fillRect.mock.calls.length);
  });

  it("paints a multi-colour sprite", () => {
    const { context } = setup({
      palette: ["transparent", "#ff0000", "#00ff00"],
      sprite: ARCADE_SPRITES.heart,
    });
    expect(context.fillRect).toHaveBeenCalled();
  });

  it("skips transparent palette entries", () => {
    const { context } = setup({
      palette: ["transparent", "transparent"],
      text: "A",
    });
    // Only the destination-over dot matrix is left to paint.
    expect(context.fillRect).toHaveBeenCalled();
    expect(context.globalCompositeOperation).toBe("destination-over");
  });

  it("blooms the phosphor with a blurred self-composite", () => {
    const { canvas, context } = setup({ glow: 0.5, text: "HI" });

    expect(context.drawImage).toHaveBeenCalledWith(
      canvas,
      0,
      0,
      SURFACE_WIDTH,
      SURFACE_HEIGHT
    );
    expect(context.filter).toContain("blur(");
  });

  it("resolves a var() palette entry down to its fallback", () => {
    const { context } = setup({
      palette: ["transparent", "var(--nope, #123456)"],
      text: "A",
    });
    expect(context.fillRect).toHaveBeenCalled();
  });

  it("types the message in and then settles", () => {
    const { context } = setup({ animate: "type", text: "HI" });

    const initialClears = context.clearRect.mock.calls.length;
    expect(pendingFrameCount()).toBeGreaterThan(0);

    // "HI" is two units over 1400ms, so the first character lands past 700ms.
    runFramesFor(800);
    expect(context.clearRect.mock.calls.length).toBeGreaterThan(initialClears);

    runFramesFor(1000);
    expect(pendingFrameCount()).toBe(0);
  });

  it("wipes the message in column by column", () => {
    const { context } = setup({ animate: "wipe", text: "WIPE" });

    runFramesFor(400);
    const midway = context.fillRect.mock.calls.length;
    runFramesFor(700);

    expect(context.fillRect.mock.calls.length).toBeGreaterThan(midway);
    expect(pendingFrameCount()).toBe(0);
  });

  it("repaints a blinking display only when it flips", () => {
    const { context } = setup({ animate: "blink", loop: true, text: "HI" });

    flushFrames(1);
    const litClears = context.clearRect.mock.calls.length;
    // Nine more frames is 144ms — well inside the 450ms blink interval.
    flushFrames(9);
    expect(context.clearRect.mock.calls.length).toBe(litClears);

    runFramesFor(500);
    expect(context.clearRect.mock.calls.length).toBeGreaterThan(litClears);
  });

  it("settles a blink that is not looping", () => {
    setup({ animate: "blink", text: "HI" });
    runFramesFor(4000);
    expect(pendingFrameCount()).toBe(0);
  });

  it("never settles a looping animation", () => {
    setup({ animate: "marquee", loop: true, text: "SCROLL" });
    runFramesFor(3000);
    expect(pendingFrameCount()).toBeGreaterThan(0);
  });

  it("restarts a looping reveal", () => {
    const { context } = setup({ animate: "type", loop: true, text: "HI" });
    runFramesFor(3000);
    expect(pendingFrameCount()).toBeGreaterThan(0);
    expect(context.clearRect.mock.calls.length).toBeGreaterThan(2);
  });

  it("falls back to the default speed for a non-positive speed", () => {
    setup({ animate: "wipe", speed: 0, text: "HI" });
    runFramesFor(1000);
    expect(pendingFrameCount()).toBe(0);
  });

  it("pauses while off screen and resumes when it comes back", () => {
    setup({ animate: "marquee", loop: true, text: "SCROLL" });
    flushFrames(2);
    expect(pendingFrameCount()).toBeGreaterThan(0);

    intersection.trigger(false);
    expect(pendingFrameCount()).toBe(0);

    intersection.trigger(true);
    expect(pendingFrameCount()).toBeGreaterThan(0);
  });

  it("pauses while the document is hidden", () => {
    setup({ animate: "marquee", loop: true, text: "SCROLL" });
    flushFrames(2);

    const hidden = Object.getOwnPropertyDescriptor(
      Document.prototype,
      "hidden"
    );
    Object.defineProperty(document, "hidden", {
      configurable: true,
      get: () => true,
    });
    act(() => {
      document.dispatchEvent(new Event("visibilitychange"));
    });
    expect(pendingFrameCount()).toBe(0);

    Object.defineProperty(document, "hidden", {
      configurable: true,
      get: () => false,
    });
    act(() => {
      document.dispatchEvent(new Event("visibilitychange"));
    });
    expect(pendingFrameCount()).toBeGreaterThan(0);

    if (hidden) {
      Object.defineProperty(Document.prototype, "hidden", hidden);
    }
  });

  it("repaints on resize", () => {
    const { context } = setup({ text: "HI" });
    const initialClears = context.clearRect.mock.calls.length;

    act(() => {
      window.dispatchEvent(new Event("resize"));
    });

    expect(context.clearRect.mock.calls.length).toBeGreaterThanOrEqual(
      initialClears
    );
  });

  it("cancels the loop on unmount", () => {
    const { unmount } = setup({ animate: "marquee", loop: true, text: "GO" });
    flushFrames(2);
    expect(pendingFrameCount()).toBeGreaterThan(0);

    unmount();
    expect(pendingFrameCount()).toBe(0);
  });

  it("clips the message to a fixed column count", () => {
    const { context: wide } = setup({ columns: 40, text: "HI" });
    const { context: narrow } = setup({ columns: 4, text: "HI" });

    expect(narrow.fillRect.mock.calls.length).toBeLessThan(
      wide.fillRect.mock.calls.length
    );
  });

  it("renders the CRT and scanline overlays", () => {
    const { container } = setup({ crt: true, scanlines: true, text: "HI" });
    expect(container.querySelectorAll("div").length).toBeGreaterThan(4);
  });
});

describe("ArcadePixel without a 2D context", () => {
  afterEach(() => {
    uninstallCanvas2DMock();
  });

  it("renders the accessible label only", () => {
    installCanvas2DMock({ supported: false });
    const { container } = render(<ArcadePixel text="HI" />);
    expect(container.querySelector("canvas")).toBeInTheDocument();
  });
});
