import { createRef } from "react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  type Canvas2DMock,
  flushFrame,
  flushFrames,
  installCanvas2DMock,
  pendingFrameCount,
  runFramesFor,
  uninstallCanvas2DMock,
} from "../../../test-utils/canvas-2d";
import { act, render } from "../../../test-utils/render";
import DrawingCursor, { type DrawingCursorHandle } from "../index";

const SIZE = 200;

describe("DrawingCursor", () => {
  it("renders without throwing", () => {
    const { container } = render(
      <DrawingCursor>
        <p>Draw over this area</p>
      </DrawingCursor>
    );
    expect(container).toBeInTheDocument();
  });
});

describe("DrawingCursor draw loop", () => {
  let canvas2d: Canvas2DMock;

  beforeEach(() => {
    canvas2d = installCanvas2DMock({ height: SIZE, width: SIZE });
  });

  afterEach(() => {
    uninstallCanvas2DMock();
  });

  const setup = (props: Parameters<typeof DrawingCursor>[0] = {}) => {
    const result = render(
      <DrawingCursor {...props}>
        <p>Draw over this area</p>
      </DrawingCursor>
    );
    const host = result.container.firstElementChild as HTMLElement;
    const canvas = result.container.querySelector("canvas");
    return {
      ...result,
      canvas,
      context: canvas ? canvas2d.contextFor(canvas) : undefined,
      host,
    };
  };

  /** Moves the pointer to a point, timestamped with the mocked clock. */
  const move = (host: HTMLElement, x: number, y: number) => {
    act(() => {
      host.dispatchEvent(
        new PointerEvent("pointermove", {
          bubbles: true,
          clientX: x,
          clientY: y,
        })
      );
    });
  };

  it("sizes the canvas from the container and starts the loop", () => {
    const { context } = setup();
    expect(context?.setTransform).toHaveBeenCalledWith(1, 0, 0, 1, 0, 0);
    expect(pendingFrameCount()).toBeGreaterThan(0);
  });

  it("clears the surface on every frame", () => {
    const { context } = setup();
    context?.resetRecords();

    flushFrames(3);

    expect(context?.clearRect).toHaveBeenCalledTimes(3);
    expect(context?.globalCompositeOperation).toBe("source-over");
  });

  it("strokes a straight segment for a two-point stroke", () => {
    const { context, host } = setup();
    move(host, 10, 10);
    move(host, 20, 30);
    context?.resetRecords();

    flushFrame();

    expect(context?.moveTo).toHaveBeenCalledWith(10, 10);
    expect(context?.lineTo).toHaveBeenCalledWith(20, 30);
    expect(context?.stroke).toHaveBeenCalledTimes(1);
    expect(context?.quadraticCurveTo).not.toHaveBeenCalled();
  });

  it("smooths a longer stroke through quadratic curves", () => {
    const { context, host } = setup();
    move(host, 10, 10);
    move(host, 30, 20);
    move(host, 50, 40);
    move(host, 70, 30);
    context?.resetRecords();

    flushFrame();

    expect(context?.quadraticCurveTo).toHaveBeenCalledTimes(2);
    expect(context?.stroke).toHaveBeenCalledTimes(2);
  });

  it("prefers coalesced pointer samples when the browser provides them", () => {
    const { context, host } = setup();

    act(() => {
      const event = new PointerEvent("pointermove", {
        bubbles: true,
        clientX: 90,
        clientY: 90,
      });
      Object.defineProperty(event, "getCoalescedEvents", {
        value: () => [
          { clientX: 10, clientY: 10 },
          { clientX: 40, clientY: 45 },
        ],
      });
      host.dispatchEvent(event);
    });
    context?.resetRecords();

    flushFrame();

    expect(context?.moveTo).toHaveBeenCalledWith(10, 10);
    expect(context?.lineTo).toHaveBeenCalledWith(40, 45);
  });

  it("keeps a constant line width when tapering is off", () => {
    const { context, host } = setup({ lineWidth: 6, taper: false });
    move(host, 10, 10);
    move(host, 90, 90);
    context?.resetRecords();

    flushFrame();

    expect(context?.lineWidth).toBe(6);
  });

  it("lets a stroke decay out of the buffer", () => {
    const { context, host } = setup({ decay: 200 });
    move(host, 10, 10);
    move(host, 40, 40);
    move(host, 70, 70);

    flushFrame();
    expect(context?.stroke).toHaveBeenCalled();

    runFramesFor(400);
    context?.resetRecords();
    flushFrame();

    expect(context?.stroke).not.toHaveBeenCalled();
  });

  it("keeps every point when decay is disabled", () => {
    const { context, host } = setup({ decay: 0 });
    move(host, 10, 10);
    move(host, 40, 40);
    move(host, 70, 70);

    runFramesFor(2000);
    context?.resetRecords();
    flushFrame();

    expect(context?.stroke).toHaveBeenCalled();
  });

  it("drops the strokes when the pointer leaves", () => {
    const { context, host } = setup();
    move(host, 10, 10);
    move(host, 40, 40);
    move(host, 70, 70);

    act(() => {
      host.dispatchEvent(new PointerEvent("pointerleave", { bubbles: true }));
    });
    context?.resetRecords();
    flushFrame();

    expect(context?.stroke).not.toHaveBeenCalled();
  });

  it("keeps the strokes on leave when clearOnLeave is off", () => {
    const { context, host } = setup({ clearOnLeave: false });
    move(host, 10, 10);
    move(host, 40, 40);
    move(host, 70, 70);

    act(() => {
      host.dispatchEvent(new PointerEvent("pointerleave", { bubbles: true }));
    });
    context?.resetRecords();
    flushFrame();

    expect(context?.stroke).toHaveBeenCalled();
  });

  it("never schedules a frame while paused", () => {
    const { context } = setup({ paused: true });
    expect(pendingFrameCount()).toBe(0);
    expect(context?.clearRect).not.toHaveBeenCalled();
  });

  it("clears and exports through the ref", () => {
    const ref = createRef<DrawingCursorHandle>();
    const { context, host } = setup({ ref });
    move(host, 10, 10);
    move(host, 40, 40);
    move(host, 70, 70);

    expect(ref.current?.toDataURL()).toMatch(/^data:image\/png/);

    act(() => {
      ref.current?.clear();
    });
    context?.resetRecords();
    flushFrame();

    expect(context?.stroke).not.toHaveBeenCalled();
  });

  it("cancels the loop on unmount", () => {
    const { unmount } = setup();
    flushFrame();
    expect(pendingFrameCount()).toBeGreaterThan(0);

    unmount();
    expect(pendingFrameCount()).toBe(0);
  });
});

describe("DrawingCursor without a fine pointer", () => {
  afterEach(() => {
    uninstallCanvas2DMock();
  });

  it("mounts no canvas on a coarse pointer", () => {
    installCanvas2DMock({ matchMedia: () => false });
    const { container } = render(<DrawingCursor />);
    expect(container.querySelector("canvas")).toBeNull();
  });
});
