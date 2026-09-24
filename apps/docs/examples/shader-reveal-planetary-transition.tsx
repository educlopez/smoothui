"use client";

import ShaderRevealPlanetaryTransition from "@repo/smoothui/components/shader-reveal-planetary-transition";
import { TransitionDemoFrame } from "./transition-demo-frame";

const ShaderRevealPlanetaryTransitionDemo = () => (
  <TransitionDemoFrame
    renderTransition={({ children, className, transitionKey }) => (
      <ShaderRevealPlanetaryTransition
        className={className}
        transitionKey={transitionKey}
      >
        {children}
      </ShaderRevealPlanetaryTransition>
    )}
    scene="subject"
  />
);

export default ShaderRevealPlanetaryTransitionDemo;
