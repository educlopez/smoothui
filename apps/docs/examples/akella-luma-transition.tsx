"use client";

import AkellaLumaTransition from "@repo/smoothui/components/akella-luma-transition";
import { TransitionDemoFrame } from "./transition-demo-frame";

const AkellaLumaTransitionDemo = () => (
  <TransitionDemoFrame
    description="Horizontal light bands reveal the next state without overwhelming the content."
    renderTransition={({ children, className, transitionKey }) => (
      <AkellaLumaTransition className={className} transitionKey={transitionKey}>
        {children}
      </AkellaLumaTransition>
    )}
    title="Luma ribbons"
  />
);

export default AkellaLumaTransitionDemo;
