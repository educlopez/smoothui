"use client";

import ShaderRevealZoomTransition from "@repo/smoothui/components/shader-reveal-zoom-transition";
import { TransitionDemoFrame } from "./transition-demo-frame";

const ShaderRevealZoomTransitionDemo = () => (
  <TransitionDemoFrame
    renderTransition={({ children, className, transitionKey }) => (
      <ShaderRevealZoomTransition
        className={className}
        transitionKey={transitionKey}
      >
        {children}
      </ShaderRevealZoomTransition>
    )}
    scene="signal"
  />
);

export default ShaderRevealZoomTransitionDemo;
