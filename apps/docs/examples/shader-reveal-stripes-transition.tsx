"use client";

import ShaderRevealStripesTransition from "@repo/smoothui/components/shader-reveal-stripes-transition";
import { TransitionDemoFrame } from "./transition-demo-frame";

const ShaderRevealStripesTransitionDemo = () => (
  <TransitionDemoFrame
    renderTransition={({ children, className, transitionKey }) => (
      <ShaderRevealStripesTransition
        className={className}
        transitionKey={transitionKey}
      >
        {children}
      </ShaderRevealStripesTransition>
    )}
    scene="editorial"
  />
);

export default ShaderRevealStripesTransitionDemo;
