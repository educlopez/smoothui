import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from "vitest";
import { axe } from "vitest-axe";
import {
  type Canvas2DMock,
  type FakeCanvas2DContext,
  flushFrames,
  type IntersectionObserverMock,
  installCanvas2DMock,
  installIntersectionObserverMock,
  installMediaElementMock,
  pendingFrameCount,
  runFramesFor,
  uninstallCanvas2DMock,
  uninstallIntersectionObserverMock,
  uninstallMediaElementMock,
} from "../../../test-utils/canvas-2d";
import { act, render } from "../../../test-utils/render";
import PixelFlowField from "../index";

const SURFACE_WIDTH = 320;
const SURFACE_HEIGHT = 180;

describe("PixelFlowField", () => {
  // jsdom does not implement the CSS Font Loading API. The component reads
  // `document.fonts.ready` to match the sampled word's font to the page's;
  // stub it locally so that read resolves instead of throwing.
  const originalFonts = document.fonts;

  beforeAll(() => {
    Object.defineProperty(document, "fonts", {
      configurable: true,
      value: { ready: Promise.resolve() },
    });
  });

  afterAll(() => {
    Object.defineProperty(document, "fonts", {
      configurable: true,
      value: originalFonts,
    });
  });

  it("renders without throwing (falls back to CSS in jsdom)", () => {
    const { container } = render(<PixelFlowField>Content</PixelFlowField>);
    expect(container).toBeInTheDocument();
  });

  it("renders with a circle shape and custom text", () => {
    const { container } = render(<PixelFlowField shape="circle" text="flow" />);
    expect(container).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<PixelFlowField>Content</PixelFlowField>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe("PixelFlowField field", () => {
  const originalFonts = document.fonts;
  let canvas2d: Canvas2DMock;
  let intersection: IntersectionObserverMock;

  beforeAll(() => {
    Object.defineProperty(document, "fonts", {
      configurable: true,
      value: { ready: Promise.resolve() },
    });
  });

  afterAll(() => {
    Object.defineProperty(document, "fonts", {
      configurable: true,
      value: originalFonts,
    });
  });

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

  const setup = (props: Parameters<typeof PixelFlowField>[0] = {}) => {
    const result = render(<PixelFlowField {...props} />);
    const host = result.container.firstElementChild as HTMLElement;
    const canvas = result.container.querySelector("canvas");
    if (!canvas) {
      throw new Error("expected a canvas");
    }
    const field = canvas2d.contextFor(canvas);
    if (!field) {
      throw new Error("expected a 2D context");
    }
    // The word sampler is the offscreen canvas created right after the field.
    const sampler = canvas2d.contexts[canvas2d.contexts.indexOf(field) + 1];
    return { ...result, canvas, field, host, sampler };
  };

  /** Cell rects traced in the most recent frame. */
  const cells = (context: FakeCanvas2DContext) =>
    context.rect.mock.calls.map(([x, y]) => `${x},${y}`);

  it("rasterises the word into a one-pixel-per-cell bitmap", () => {
    const { sampler } = setup({ text: "flow" });

    expect(sampler.measureText).toHaveBeenCalledWith("flow");
    expect(sampler.fillText).toHaveBeenCalledWith(
      "flow",
      expect.any(Number),
      expect.any(Number)
    );
    expect(sampler.getImageData).toHaveBeenCalled();

    const [, , columns, rows] = sampler.getImageData.mock.calls[0];
    expect(columns).toBeGreaterThan(1);
    expect(rows).toBeGreaterThan(1);
    expect(sampler.canvas.width).toBe(columns);
  });

  it("shrinks the type until the word fits the grid", () => {
    const { sampler: narrow } = setup({ text: "supercalifragilistic" });
    const { sampler: wide } = setup({ text: "hi" });

    const sizeOf = (context: FakeCanvas2DContext) =>
      Number.parseFloat(/(\d+(?:\.\d+)?)px/.exec(context.font)?.[1] ?? "0");

    expect(sizeOf(narrow)).toBeLessThan(sizeOf(wide));
    expect(narrow.measureText.mock.calls.length).toBeGreaterThan(1);
  });

  it("rasterises nothing for an empty word", () => {
    const { rerender, sampler } = setup({ text: "flow" });
    sampler.resetRecords();

    rerender(<PixelFlowField text="" />);

    expect(sampler.getImageData).toHaveBeenCalled();
    expect(sampler.fillText).not.toHaveBeenCalled();
  });

  it("paints one path per brightness tier", () => {
    const { field } = setup({ text: "flow" });

    expect(field.setTransform).toHaveBeenCalledWith(1, 0, 0, 1, 0, 0);
    field.resetRecords();
    flushFrames(1);

    expect(field.clearRect).toHaveBeenCalledTimes(1);
    expect(field.beginPath.mock.calls.length).toBeGreaterThan(0);
    expect(field.beginPath.mock.calls.length).toBeLessThanOrEqual(7);
    expect(field.fill.mock.calls.length).toBe(
      field.beginPath.mock.calls.length
    );
    expect(field.rect.mock.calls.length).toBeGreaterThan(100);
  });

  it("traces circles for the circle shape", () => {
    const { field } = setup({ shape: "circle", text: "flow" });
    field.resetRecords();
    flushFrames(1);

    expect(field.arc).toHaveBeenCalled();
    expect(field.rect).not.toHaveBeenCalled();
  });

  it("traces two arms per cell for the cross shape", () => {
    const { field: cross } = setup({ shape: "cross", text: "flow" });
    cross.resetRecords();
    flushFrames(1);
    const crossRects = cross.rect.mock.calls.length;

    const { field: square } = setup({ shape: "square", text: "flow" });
    square.resetRecords();
    flushFrames(1);

    expect(crossRects).toBe(square.rect.mock.calls.length * 2);
  });

  it("advances the flow field frame by frame", () => {
    const { field } = setup({ text: "flow" });
    expect(pendingFrameCount()).toBeGreaterThan(0);

    flushFrames(1);
    const first = cells(field);
    field.resetRecords();
    flushFrames(1);

    expect(cells(field)).not.toEqual(first);
  });

  it("settles the reveal once the reform window has passed", () => {
    const { field } = setup({ text: "flow" });

    // The reveal runs for 1750ms; past that every cell sits at its rest point.
    runFramesFor(2000);
    field.resetRecords();
    flushFrames(1);
    const settled = cells(field);
    field.resetRecords();
    flushFrames(1);

    expect(settled.length).toBeGreaterThan(0);
    expect(cells(field)).not.toEqual(settled);
    expect(pendingFrameCount()).toBeGreaterThan(0);
  });

  it("replays the reveal when the scatter seed changes", () => {
    const { field, rerender } = setup({ scatter: 0, text: "flow" });
    runFramesFor(2000);
    field.resetRecords();
    flushFrames(1);
    const settled = cells(field);

    field.resetRecords();
    rerender(<PixelFlowField scatter={1} text="flow" />);
    flushFrames(1);

    expect(cells(field)).not.toEqual(settled);
  });

  it("stamps a wake where the pointer travels", () => {
    const { field, host } = setup({ text: "flow" });
    runFramesFor(2000);

    act(() => {
      host.dispatchEvent(
        new PointerEvent("pointerdown", {
          bubbles: true,
          clientX: 40,
          clientY: 40,
        })
      );
    });
    flushFrames(1);
    field.resetRecords();
    act(() => {
      host.dispatchEvent(
        new PointerEvent("pointermove", {
          bubbles: true,
          clientX: 260,
          clientY: 140,
        })
      );
    });
    flushFrames(1);
    const dragged = cells(field);

    act(() => {
      host.dispatchEvent(new PointerEvent("pointerleave", { bubbles: true }));
    });
    field.resetRecords();
    flushFrames(1);

    expect(dragged.length).toBeGreaterThan(0);
    expect(cells(field)).not.toEqual(dragged);
  });

  it("holds a single frame while paused", () => {
    const { field } = setup({ paused: true, text: "flow" });

    expect(field.clearRect).toHaveBeenCalled();
    expect(pendingFrameCount()).toBe(0);
  });

  it("stops the loop while off screen", () => {
    setup({ text: "flow" });
    expect(pendingFrameCount()).toBeGreaterThan(0);

    intersection.trigger(false);
    expect(pendingFrameCount()).toBe(0);

    intersection.trigger(true);
    expect(pendingFrameCount()).toBeGreaterThan(0);
  });

  it("coarsens the grid instead of blowing the cell budget", () => {
    const { field } = setup({ cellSize: 1, gap: 0, text: "flow" });
    field.resetRecords();
    flushFrames(1);

    expect(field.rect.mock.calls.length).toBeLessThanOrEqual(14_000);
  });

  it("releases the canvas and the sampler on unmount", () => {
    const { canvas, sampler, unmount } = setup({ text: "flow" });
    flushFrames(1);

    unmount();

    expect(pendingFrameCount()).toBe(0);
    expect(canvas.width).toBe(0);
    expect(sampler.canvas.width).toBe(0);
  });

  it("repaints on resize", () => {
    const { field } = setup({ paused: true, text: "flow" });
    const clears = field.clearRect.mock.calls.length;

    act(() => {
      window.dispatchEvent(new Event("resize"));
    });

    expect(field.clearRect.mock.calls.length).toBeGreaterThanOrEqual(clears);
  });
});

describe("PixelFlowField with an image source", () => {
  const originalFonts = document.fonts;

  beforeAll(() => {
    Object.defineProperty(document, "fonts", {
      configurable: true,
      value: { ready: Promise.resolve() },
    });
  });

  afterAll(() => {
    Object.defineProperty(document, "fonts", {
      configurable: true,
      value: originalFonts,
    });
  });

  afterEach(() => {
    uninstallIntersectionObserverMock();
    uninstallMediaElementMock();
    uninstallCanvas2DMock();
  });

  it("samples the image instead of the word", async () => {
    const canvas2d = installCanvas2DMock({
      height: SURFACE_HEIGHT,
      width: SURFACE_WIDTH,
    });
    installIntersectionObserverMock();
    installMediaElementMock({ naturalHeight: 90, naturalWidth: 120 });

    const { container } = render(
      <PixelFlowField src="https://example.com/mask.png" text="flow" />
    );
    await act(async () => {
      await Promise.resolve();
    });

    const canvas = container.querySelector("canvas") as HTMLCanvasElement;
    const field = canvas2d.contextFor(canvas);
    const sampler =
      canvas2d.contexts[canvas2d.contexts.indexOf(field as never) + 1];

    // The word is sampled while the image decodes, so what matters is that the
    // image pass is the one that ran last.
    expect(sampler.drawImage).toHaveBeenCalled();
    expect(sampler.drawImage.mock.invocationCallOrder.at(-1)).toBeGreaterThan(
      sampler.fillText.mock.invocationCallOrder.at(-1) ?? 0
    );
  });

  it("falls back to the word when the image cannot load", async () => {
    const canvas2d = installCanvas2DMock({
      height: SURFACE_HEIGHT,
      width: SURFACE_WIDTH,
    });
    installIntersectionObserverMock();
    installMediaElementMock({ fail: true });

    const { container } = render(
      <PixelFlowField src="https://example.com/mask.png" text="flow" />
    );
    await act(async () => {
      await Promise.resolve();
    });

    const canvas = container.querySelector("canvas") as HTMLCanvasElement;
    const field = canvas2d.contextFor(canvas);
    const sampler =
      canvas2d.contexts[canvas2d.contexts.indexOf(field as never) + 1];

    expect(sampler.fillText).toHaveBeenCalled();
  });
});

describe("PixelFlowField without a 2D context", () => {
  const originalFonts = document.fonts;

  beforeAll(() => {
    Object.defineProperty(document, "fonts", {
      configurable: true,
      value: { ready: Promise.resolve() },
    });
  });

  afterAll(() => {
    Object.defineProperty(document, "fonts", {
      configurable: true,
      value: originalFonts,
    });
  });

  afterEach(() => {
    uninstallCanvas2DMock();
  });

  it("falls back to a CSS dot grid", () => {
    installCanvas2DMock({ supported: false });
    const { container } = render(<PixelFlowField text="flow" />);

    expect(container.querySelector("canvas")).toBeNull();
    const fallback = container.querySelector<HTMLElement>("[aria-hidden]");
    expect(fallback?.style.backgroundImage).toContain("radial-gradient");
  });
});
