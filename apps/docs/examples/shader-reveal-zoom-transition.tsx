"use client";

import ShaderRevealZoomTransition from "@repo/smoothui/components/shader-reveal-zoom-transition";
import { TransitionDemoFrame } from "./transition-demo-frame";

const ShaderRevealZoomTransitionDemo = () => (
  <TransitionDemoFrame
    description="A soft lens movement for switching between compact dashboard and marketing states."
    renderTransition={({ children, className, transitionKey }) => (
      <ShaderRevealZoomTransition
        className={className}
        transitionKey={transitionKey}
      >
        {children}
      </ShaderRevealZoomTransition>
    )}
    title="Zoom wash"
  />
);

export default ShaderRevealZoomTransitionDemo;
