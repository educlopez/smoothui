"use client";

import ApertureBlurTransition from "@repo/smoothui/components/aperture-blur-transition";
import { TransitionDemoFrame } from "./transition-demo-frame";

const ApertureBlurTransitionDemo = () => (
  <TransitionDemoFrame
    renderTransition={({ children, className, transitionKey }) => (
      <ApertureBlurTransition
        className={className}
        transitionKey={transitionKey}
      >
        {children}
      </ApertureBlurTransition>
    )}
    scene="signal"
  />
);

export default ApertureBlurTransitionDemo;
