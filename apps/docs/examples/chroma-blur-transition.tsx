"use client";

import ChromaBlurTransition from "@repo/smoothui/components/chroma-blur-transition";
import { TransitionDemoFrame } from "./transition-demo-frame";

const ChromaBlurTransitionDemo = () => (
  <TransitionDemoFrame
    description="A restrained chromatic blur that adds color while preserving a quiet UI frame."
    renderTransition={({ children, className, transitionKey }) => (
      <ChromaBlurTransition className={className} transitionKey={transitionKey}>
        {children}
      </ChromaBlurTransition>
    )}
    title="Chroma blur"
  />
);

export default ChromaBlurTransitionDemo;
