"use client";

import type { PixelBrushCanvasHandle } from "@repo/smoothui/components/pixel-brush-canvas";
import PixelBrushCanvas from "@repo/smoothui/components/pixel-brush-canvas";
import { useRef } from "react";

export default function PixelBrushCanvasDemo() {
  const canvasRef = useRef<PixelBrushCanvasHandle>(null);

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-4 p-4">
      <PixelBrushCanvas
        grid
        height={16}
        pixelSize={20}
        ref={canvasRef}
        width={16}
      />
      <div className="flex gap-2">
        <button
          className="rounded-md border border-border px-3 py-1.5 font-medium text-sm hover:bg-muted"
          onClick={() => canvasRef.current?.undo()}
          type="button"
        >
          Undo
        </button>
        <button
          className="rounded-md border border-border px-3 py-1.5 font-medium text-sm hover:bg-muted"
          onClick={() => canvasRef.current?.clear()}
          type="button"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
