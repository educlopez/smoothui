"use client";

import ShaderRevealPlanetaryTransition from "@repo/smoothui/components/shader-reveal-planetary-transition";
import { TransitionDemoFrame } from "./transition-demo-frame";

const ShaderRevealPlanetaryTransitionDemo = () => (
  <TransitionDemoFrame
    description="A rotational field for rare moments where the change should feel spatial."
    renderTransition={({ children, className, transitionKey }) => (
      <ShaderRevealPlanetaryTransition
        className={className}
        transitionKey={transitionKey}
      >
        {children}
      </ShaderRevealPlanetaryTransition>
    )}
    title="Planetary swirl"
  />
);

export default ShaderRevealPlanetaryTransitionDemo;
