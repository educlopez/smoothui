"use client";

import DrawingCursor, {
  type DrawingCursorHandle,
} from "@repo/smoothui/components/drawing-cursor";
import { useRef } from "react";

const CLEAR_LABEL = "Clear";

export default function DrawingCursorDemo() {
  const handleRef = useRef<DrawingCursorHandle>(null);

  return (
    <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-foreground/10 bg-background">
      <DrawingCursor
        blend="source-over"
        className="h-80 w-full"
        color="var(--color-brand, #6366f1)"
        decay={900}
        lineWidth={4}
        ref={handleRef}
        smoothing={0.6}
        taper
      >
        <div className="flex h-80 w-full flex-col items-center justify-center gap-2 p-8 text-center">
          <p className="font-medium text-lg">Move your cursor here</p>
          <p className="text-muted-foreground text-sm">
            Draw over this card with your pointer. The stroke fades away on its
            own.
          </p>
        </div>
      </DrawingCursor>
      <button
        className="absolute right-4 bottom-4 rounded-md border border-foreground/10 bg-background px-3 py-1.5 text-xs hover:bg-muted/60"
        onClick={() => handleRef.current?.clear()}
        type="button"
      >
        {CLEAR_LABEL}
      </button>
    </div>
  );
}
