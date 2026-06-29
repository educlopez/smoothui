"use client";

import AkellaPlanetaryTransition from "@repo/smoothui/components/akella-planetary-transition";
import { TransitionDemoFrame } from "./transition-demo-frame";

const AkellaPlanetaryTransitionDemo = () => (
  <TransitionDemoFrame
    description="A rotational field for rare moments where the change should feel spatial."
    renderTransition={({ children, className, transitionKey }) => (
      <AkellaPlanetaryTransition
        className={className}
        transitionKey={transitionKey}
      >
        {children}
      </AkellaPlanetaryTransition>
    )}
    title="Planetary swirl"
  />
);

export default AkellaPlanetaryTransitionDemo;
