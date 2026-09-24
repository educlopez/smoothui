"use client";

import ShaderRevealLumaTransition from "@repo/smoothui/components/shader-reveal-luma-transition";
import { TransitionDemoFrame } from "./transition-demo-frame";

const ShaderRevealLumaTransitionDemo = () => (
  <TransitionDemoFrame
    renderTransition={({ children, className, transitionKey }) => (
      <ShaderRevealLumaTransition
        className={className}
        transitionKey={transitionKey}
      >
        {children}
      </ShaderRevealLumaTransition>
    )}
    scene="editorial"
  />
);

export default ShaderRevealLumaTransitionDemo;
