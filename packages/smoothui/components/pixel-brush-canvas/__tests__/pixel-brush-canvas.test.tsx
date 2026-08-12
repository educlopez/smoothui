import { createRef } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  type Canvas2DMock,
  installCanvas2DMock,
  uninstallCanvas2DMock,
} from "../../../test-utils/canvas-2d";
import { fireEvent, render, screen } from "../../../test-utils/render";
import PixelBrushCanvas, { type PixelBrushCanvasHandle } from "../index";

const GRID = 8;
const PIXEL_SIZE = 10;
const SURFACE = GRID * PIXEL_SIZE;

/** Centre of cell (x, y) in client coordinates. */
const at = (x: number, y: number) => ({
  clientX: x * PIXEL_SIZE + PIXEL_SIZE / 2,
  clientY: y * PIXEL_SIZE + PIXEL_SIZE / 2,
  pointerId: 1,
});

describe("PixelBrushCanvas", () => {
  it("renders without throwing", () => {
    const { container } = render(<PixelBrushCanvas />);
    expect(container).toBeInTheDocument();
  });

  it("renders with the grid overlay and no tools without throwing", () => {
    const { container } = render(<PixelBrushCanvas grid showTools={false} />);
    expect(container).toBeInTheDocument();
  });
});

describe("PixelBrushCanvas draw pass", () => {
  let canvas2d: Canvas2DMock;

  beforeEach(() => {
    canvas2d = installCanvas2DMock({ height: SURFACE, width: SURFACE });
  });

  afterEach(() => {
    uninstallCanvas2DMock();
  });

  const setup = (
    props: Partial<Parameters<typeof PixelBrushCanvas>[0]> = {}
  ) => {
    const result = render(
      <PixelBrushCanvas
        height={GRID}
        pixelSize={PIXEL_SIZE}
        width={GRID}
        {...props}
      />
    );
    const canvas = result.container.querySelector("canvas");
    if (!canvas) {
      throw new Error("expected a canvas");
    }
    // jsdom implements none of the pointer-capture API.
    canvas.setPointerCapture = vi.fn();
    canvas.releasePointerCapture = vi.fn();
    canvas.hasPointerCapture = vi.fn(() => true);
    const context = canvas2d.contextFor(canvas);
    if (!context) {
      throw new Error("expected a 2D context");
    }
    return { ...result, canvas, context };
  };

  it("clears every cell of the grid on mount", () => {
    const { context } = setup();
    expect(context.setTransform).toHaveBeenCalled();
    expect(context.clearRect).toHaveBeenCalledTimes(GRID * GRID);
    expect(context.fillRect).not.toHaveBeenCalled();
  });

  it("fills the cells of an initial artwork", () => {
    const { context } = setup({
      initial: [
        [0, 1],
        [-1, 2],
      ],
    });
    expect(context.fillRect).toHaveBeenCalledTimes(3);
  });

  it("strokes gridlines when the grid is on", () => {
    const { context } = setup({ grid: true });
    expect(context.strokeRect).toHaveBeenCalledTimes(GRID * GRID);
  });

  it("paints a cell with the pencil and reports the change", () => {
    const onChange = vi.fn();
    const { canvas, context } = setup({ onChange });

    context.resetRecords();
    fireEvent.pointerDown(canvas, at(2, 3));

    expect(context.fillRect).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledTimes(1);
    const pixels = onChange.mock.calls[0][0] as Uint8Array;
    expect(pixels[3 * GRID + 2]).toBe(1);
  });

  it("drags a pencil stroke across cells and ignores repeats", () => {
    const onChange = vi.fn();
    const { canvas } = setup({ onChange });

    fireEvent.pointerDown(canvas, at(0, 0));
    fireEvent.pointerMove(canvas, at(1, 0));
    fireEvent.pointerMove(canvas, at(1, 0));
    fireEvent.pointerMove(canvas, at(2, 0));
    fireEvent.pointerUp(canvas, at(2, 0));

    expect(onChange).toHaveBeenCalledTimes(3);
    const pixels = onChange.mock.calls.at(-1)?.[0] as Uint8Array;
    expect(Array.from(pixels.subarray(0, 3))).toEqual([1, 1, 1]);
  });

  it("erases a painted cell", () => {
    const onChange = vi.fn();
    const { canvas } = setup({
      brush: "eraser",
      initial: [[0, 0, 0]],
      onChange,
    });

    fireEvent.pointerDown(canvas, at(1, 0));

    const pixels = onChange.mock.calls.at(-1)?.[0] as Uint8Array;
    expect(pixels[1]).toBe(0);
    expect(pixels[0]).toBe(1);
  });

  it("floods the whole empty grid with the fill tool", () => {
    const onChange = vi.fn();
    const { canvas } = setup({ brush: "fill", onChange });

    fireEvent.pointerDown(canvas, at(4, 4));

    const pixels = onChange.mock.calls.at(-1)?.[0] as Uint8Array;
    expect(pixels.every((value) => value === 1)).toBe(true);
  });

  it("does nothing when filling a region that already holds the colour", () => {
    const onChange = vi.fn();
    const { canvas } = setup({ brush: "fill", onChange });

    fireEvent.pointerDown(canvas, at(0, 0));
    onChange.mockClear();
    fireEvent.pointerDown(canvas, at(5, 5));

    expect(onChange).not.toHaveBeenCalled();
  });

  it("commits a Bresenham line between press and release", () => {
    const onChange = vi.fn();
    const { canvas } = setup({ brush: "line", onChange });

    fireEvent.pointerDown(canvas, at(0, 0));
    fireEvent.pointerUp(canvas, at(3, 3));

    const pixels = onChange.mock.calls.at(-1)?.[0] as Uint8Array;
    for (let index = 0; index < 4; index++) {
      expect(pixels[index * GRID + index]).toBe(1);
    }
  });

  it("commits a rectangle outline between press and release", () => {
    const onChange = vi.fn();
    const { canvas } = setup({ brush: "rect", onChange });

    fireEvent.pointerDown(canvas, at(1, 1));
    fireEvent.pointerUp(canvas, at(4, 3));

    const pixels = onChange.mock.calls.at(-1)?.[0] as Uint8Array;
    // Corners lit, interior untouched.
    expect(pixels[1 * GRID + 1]).toBe(1);
    expect(pixels[3 * GRID + 4]).toBe(1);
    expect(pixels[2 * GRID + 2]).toBe(0);
  });

  it("paints and navigates from the keyboard", () => {
    const onChange = vi.fn();
    setup({ onChange });
    const surface = screen.getByRole("application");

    fireEvent.keyDown(surface, { key: "ArrowRight" });
    fireEvent.keyDown(surface, { key: "ArrowDown" });
    fireEvent.keyDown(surface, { key: " " });

    const pixels = onChange.mock.calls.at(-1)?.[0] as Uint8Array;
    expect(pixels[1 * GRID + 1]).toBe(1);
    expect(screen.getByText(/Column 2, row 2/)).toBeInTheDocument();

    fireEvent.keyDown(surface, { key: "ArrowLeft" });
    fireEvent.keyDown(surface, { key: "ArrowUp" });
    expect(screen.getByText(/Column 1, row 1/)).toBeInTheDocument();
  });

  it("switches tools from their keyboard shortcuts", () => {
    const onBrushChange = vi.fn();
    setup({ onBrushChange });
    const surface = screen.getByRole("application");

    fireEvent.keyDown(surface, { key: "e" });
    fireEvent.keyDown(surface, { key: "g" });
    fireEvent.keyDown(surface, { key: "b" });
    fireEvent.keyDown(surface, { key: "q" });

    expect(onBrushChange.mock.calls.map(([brush]) => brush)).toEqual([
      "eraser",
      "fill",
      "pencil",
    ]);
  });

  it("draws a keyboard line between two anchored presses", () => {
    const onChange = vi.fn();
    setup({ brush: "line", onChange });
    const surface = screen.getByRole("application");

    fireEvent.keyDown(surface, { key: " " });
    expect(
      screen.getByText(/Anchor set at column 1, row 1/)
    ).toBeInTheDocument();

    fireEvent.keyDown(surface, { key: "ArrowRight" });
    fireEvent.keyDown(surface, { key: "ArrowRight" });
    fireEvent.keyDown(surface, { key: " " });

    const pixels = onChange.mock.calls.at(-1)?.[0] as Uint8Array;
    expect(Array.from(pixels.subarray(0, 3))).toEqual([1, 1, 1]);
  });

  it("reverts the last stroke with the undo shortcut", () => {
    const onChange = vi.fn();
    const { canvas } = setup({ onChange });
    const surface = screen.getByRole("application");

    fireEvent.pointerDown(canvas, at(2, 2));
    fireEvent.keyDown(surface, { ctrlKey: true, key: "z" });

    const pixels = onChange.mock.calls.at(-1)?.[0] as Uint8Array;
    expect(pixels[2 * GRID + 2]).toBe(0);
  });

  it("ignores undo with an empty history", () => {
    const onChange = vi.fn();
    setup({ onChange });
    fireEvent.keyDown(screen.getByRole("application"), {
      key: "z",
      metaKey: true,
    });
    expect(onChange).not.toHaveBeenCalled();
  });

  it("exposes clear, undo, getPixels and toDataURL through the ref", () => {
    const ref = createRef<PixelBrushCanvasHandle>();
    const { canvas, context } = setup({ initial: [[0, 0]], ref });

    expect(Array.from(ref.current?.getPixels() ?? [])).toContain(1);
    expect(ref.current?.toDataURL()).toMatch(/^data:image\/png/);
    expect(canvas.toDataURL).toBeDefined();

    context.resetRecords();
    ref.current?.clear();
    expect(ref.current?.getPixels().every((value) => value === 0)).toBe(true);
    expect(context.clearRect).toHaveBeenCalledTimes(GRID * GRID);

    ref.current?.undo();
    expect(Array.from(ref.current?.getPixels() ?? [])).toContain(1);
  });

  it("follows controlled brush and colour props", () => {
    const onChange = vi.fn();
    const { canvas, rerender } = setup({ color: 0, onChange });

    rerender(
      <PixelBrushCanvas
        brush="pencil"
        color={4}
        height={GRID}
        onChange={onChange}
        pixelSize={PIXEL_SIZE}
        width={GRID}
      />
    );
    fireEvent.pointerDown(canvas, at(0, 0));

    const pixels = onChange.mock.calls.at(-1)?.[0] as Uint8Array;
    expect(pixels[0]).toBe(5);
  });

  it("selects colours and tools from the tool palette", () => {
    const onBrushChange = vi.fn();
    const onColorChange = vi.fn();
    setup({ onBrushChange, onColorChange, palette: ["#000000", "#ffffff"] });

    fireEvent.click(screen.getByRole("button", { name: /Select color 2/ }));
    fireEvent.click(screen.getByRole("button", { name: /Rectangle tool/ }));

    expect(onColorChange).toHaveBeenCalledWith(1);
    expect(onBrushChange).toHaveBeenCalledWith("rect");
  });

  it("reallocates the buffer when the grid size changes", () => {
    const { rerender } = setup();
    rerender(
      <PixelBrushCanvas height={GRID * 2} pixelSize={PIXEL_SIZE} width={GRID} />
    );
    expect(canvas2d.paintCount()).toBeGreaterThan(GRID * GRID);
  });
});
