"use client";

import ChromaBlurTransition from "@repo/smoothui/components/chroma-blur-transition";
import { TransitionDemoFrame } from "./transition-demo-frame";

const ChromaBlurTransitionDemo = () => (
  <TransitionDemoFrame
    renderTransition={({ children, className, transitionKey }) => (
      <ChromaBlurTransition className={className} transitionKey={transitionKey}>
        {children}
      </ChromaBlurTransition>
    )}
    scene="signal"
  />
);

export default ChromaBlurTransitionDemo;
