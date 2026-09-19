import type { ReactNode } from "react";

interface PreviewRenderProps {
  children: ReactNode;
}

export const PreviewRender = ({ children }: PreviewRenderProps) => (
  // Height comes from the demo, not from the frame: the docs page already
  // provides the containing box, so a second fixed height here only clipped
  // taller demos and stranded short ones in dead space. A demo that needs a
  // viewport — an internal scroller for a scroll-driven animation — declares
  // its own height instead.
  <div className="not-prose frame-box relative flex h-full w-full flex-col items-center justify-center gap-4 overflow-hidden border-none p-8 [--primary-foreground:oklch(0.985_0_0)] [--primary:oklch(0.205_0_0)] dark:[--primary-foreground:oklch(0.205_0_0)] dark:[--primary:oklch(0.985_0_0)]">
    <div className="relative z-1 flex h-full w-full flex-col items-center justify-center gap-4">
      {children}
    </div>
  </div>
);
