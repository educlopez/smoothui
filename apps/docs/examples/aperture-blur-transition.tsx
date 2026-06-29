"use client";

import ApertureBlurTransition from "@repo/smoothui/components/aperture-blur-transition";
import { TransitionDemoFrame } from "./transition-demo-frame";

const ApertureBlurTransitionDemo = () => (
  <TransitionDemoFrame
    description="A focused aperture reveal for switching between dashboard and landing contexts."
    renderTransition={({ children, className, transitionKey }) => (
      <ApertureBlurTransition
        className={className}
        transitionKey={transitionKey}
      >
        {children}
      </ApertureBlurTransition>
    )}
    title="Aperture blur"
  />
);

export default ApertureBlurTransitionDemo;
