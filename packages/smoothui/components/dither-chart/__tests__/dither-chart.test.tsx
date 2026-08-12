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
import { render } from "../../../test-utils/render";
import DitherChart, {
  DITHER_CHART_VARIANTS,
  type DitherChartMatrixOrder,
  type DitherChartSeries,
} from "../index";

const data: DitherChartSeries[] = [
  {
    name: "Series A",
    points: [
      { label: "Jan", value: 10 },
      { label: "Feb", value: 20 },
      { label: "Mar", value: 4 },
    ],
  },
  {
    color: "#ff0000",
    name: "Series B",
    points: [
      { label: "Jan", value: 6 },
      { label: "Feb", value: 12 },
      { label: "Mar", value: 18 },
    ],
  },
];

describe("DitherChart", () => {
  it("renders without throwing with the line variant", () => {
    const { container } = render(<DitherChart data={data} variant="line" />);
    expect(container).toBeInTheDocument();
  });

  it("renders without throwing with the donut variant", () => {
    const { container } = render(<DitherChart data={data} variant="donut" />);
    expect(container).toBeInTheDocument();
  });
});

describe("DitherChart draw pass", () => {
  let canvas2d: Canvas2DMock;
  let intersection: IntersectionObserverMock;

  beforeEach(() => {
    canvas2d = installCanvas2DMock();
    intersection = installIntersectionObserverMock();
  });

  afterEach(() => {
    uninstallIntersectionObserverMock();
    uninstallCanvas2DMock();
  });

  const canvasOf = (container: HTMLElement) => {
    const canvas = container.querySelector("canvas");
    if (!canvas) {
      throw new Error("expected a canvas");
    }
    return canvas;
  };

  it("paints the chart and dithers the buffer when animation is off", () => {
    const { container } = render(
      <DitherChart animate={false} data={data} variant="bar" />
    );

    // Two contexts: the low-resolution buffer and the on-screen canvas.
    expect(canvas2d.contexts).toHaveLength(2);
    const [buffer] = canvas2d.contexts;
    const screen = canvas2d.contextFor(canvasOf(container));

    expect(buffer.fillRect).toHaveBeenCalled();
    expect(buffer.getImageData).toHaveBeenCalled();
    expect(buffer.putImageData).toHaveBeenCalled();
    expect(screen?.drawImage).toHaveBeenCalled();

    // The dither pass is a read-modify-write over the alpha channel, so what
    // went back in must differ from what came out.
    expect(buffer.reads).toHaveLength(1);
    expect(buffer.writes).toHaveLength(1);
    expect(Array.from(buffer.writes[0])).not.toEqual(
      Array.from(buffer.reads[0])
    );
  });

  it("quantises alpha to fully opaque or fully transparent", () => {
    render(<DitherChart animate={false} data={data} variant="heatmap" />);

    const [{ writes }] = canvas2d.contexts;
    const [written] = writes;
    const alphas = new Set<number>();
    for (let index = 3; index < written.length; index += 4) {
      alphas.add(written[index]);
    }
    for (const alpha of alphas) {
      expect([0, 255]).toContain(alpha);
    }
  });

  it.each(DITHER_CHART_VARIANTS)("paints the %s variant", (variant) => {
    render(<DitherChart animate={false} data={data} variant={variant} />);
    expect(canvas2d.paintCount()).toBeGreaterThan(0);
  });

  it.each([2, 4, 8] as DitherChartMatrixOrder[])(
    "dithers through the order-%i Bayer matrix",
    (matrix) => {
      render(
        <DitherChart
          animate={false}
          data={data}
          matrix={matrix}
          variant="bar"
        />
      );
      expect(canvas2d.contexts.at(0)?.putImageData).toHaveBeenCalledTimes(1);
    }
  );

  it("draws in over successive frames once visible, then stops", () => {
    render(<DitherChart data={data} variant="line" />);

    const [buffer] = canvas2d.contexts;
    // One immediate draw(0) plus the frame loop started by the observer.
    const initialDraws = buffer.putImageData.mock.calls.length;
    expect(initialDraws).toBeGreaterThan(0);

    flushFrames(2);
    expect(buffer.putImageData.mock.calls.length).toBeGreaterThan(initialDraws);

    // The draw-in lasts 900ms; past that the loop must not reschedule.
    //
    // Stepped coarsely on purpose. Every frame redraws the whole chart, and the
    // last thing `draw` does is blit the low-res buffer over the full 320x180
    // canvas — which the Canvas2D fake services by stamping all 57,600 pixels
    // one at a time. That put ~75 full-surface repaints (1200ms at the default
    // 16ms step) behind this one assertion and made it the slowest test in the
    // file by an order of magnitude, close enough to the 5s budget that a busy
    // machine could tip it over.
    //
    // Nothing is skipped by stepping in 300ms: the loop's stop condition is
    // `elapsed >= DRAW_IN_DURATION_MS`, a clock comparison, not a frame count.
    // Four coarse frames cross 900ms exactly as 75 fine ones do, and the
    // assertion — that the loop stops rescheduling once past the draw-in — is
    // unchanged.
    runFramesFor(1200, { stepMs: 300 });
    expect(pendingFrameCount()).toBe(0);
  });

  it("stops the frame loop while the chart is off screen", () => {
    render(<DitherChart data={data} variant="bar" />);
    flushFrames(2);
    expect(pendingFrameCount()).toBeGreaterThan(0);

    intersection.trigger(false);
    expect(pendingFrameCount()).toBe(0);

    intersection.trigger(true);
    expect(pendingFrameCount()).toBeGreaterThan(0);
  });

  it("cancels the frame loop on unmount", () => {
    const { unmount } = render(<DitherChart data={data} variant="bubbles" />);
    flushFrames(2);
    expect(pendingFrameCount()).toBeGreaterThan(0);

    unmount();
    expect(pendingFrameCount()).toBe(0);
  });

  it("skips drawing entirely when there is no data", () => {
    render(<DitherChart animate={false} data={[]} />);
    expect(canvas2d.contexts).toHaveLength(0);
  });

  it("uses an explicit palette when one is given", () => {
    render(
      <DitherChart
        animate={false}
        data={data}
        palette={["#123456", "#654321"]}
        variant="stacked"
      />
    );
    expect(canvas2d.contexts.at(0)?.fillStyle).toBeDefined();
    expect(canvas2d.paintCount()).toBeGreaterThan(0);
  });
});
