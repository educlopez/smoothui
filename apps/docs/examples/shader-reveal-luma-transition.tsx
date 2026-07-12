"use client";

import ShaderRevealLumaTransition from "@repo/smoothui/components/shader-reveal-luma-transition";
import { TransitionDemoFrame } from "./transition-demo-frame";

const ShaderRevealLumaTransitionDemo = () => (
  <TransitionDemoFrame
    description="Horizontal light bands reveal the next state without overwhelming the content."
    renderTransition={({ children, className, transitionKey }) => (
      <ShaderRevealLumaTransition
        className={className}
        transitionKey={transitionKey}
      >
        {children}
      </ShaderRevealLumaTransition>
    )}
    title="Luma ribbons"
  />
);

export default ShaderRevealLumaTransitionDemo;
