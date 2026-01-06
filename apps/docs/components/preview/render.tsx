import type { ReactNode } from "react";

type PreviewRenderProps = {
  children: ReactNode;
};

export const PreviewRender = ({ children }: PreviewRenderProps) => (
  <div className="not-prose frame-box relative flex size-full flex-col items-center justify-center gap-4 overflow-hidden border-none p-8 [--primary-foreground:oklch(0.985_0_0)] [--primary:oklch(0.205_0_0)] dark:[--primary-foreground:oklch(0.205_0_0)] dark:[--primary:oklch(0.985_0_0)]">
    <div className="relative z-1 flex size-full flex-col items-center justify-center gap-4">
      {children}
    </div>
  </div>
);
