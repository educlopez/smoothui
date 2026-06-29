"use client";

import AkellaPushTransition from "@repo/smoothui/components/akella-push-transition";
import { TransitionDemoFrame } from "./transition-demo-frame";

const AkellaPushTransitionDemo = () => (
  <TransitionDemoFrame
    description="A pushed flow for transitions that should feel directional and continuous."
    renderTransition={({ children, className, transitionKey }) => (
      <AkellaPushTransition className={className} transitionKey={transitionKey}>
        {children}
      </AkellaPushTransition>
    )}
    title="Noise push"
  />
);

export default AkellaPushTransitionDemo;
