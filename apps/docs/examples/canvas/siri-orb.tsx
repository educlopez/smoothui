"use client";

import {
  type AIState,
  useSimulatedAmplitude,
} from "@repo/smoothui/components/ai-core";
import SiriOrb from "@repo/smoothui/components/siri-orb";
import { useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

/**
 * One orb, walking itself through the states. The mesh already rotates on its
 * own; cycling the state is what shows the speed, saturation and scale shifting
 * with it, which is the whole point of the shared AI state contract.
 */
const STATES: AIState[] = ["idle", "listening", "thinking", "streaming"];
const STATE_INTERVAL_MS = 3200;

const SiriOrbCanvasDemo = () => {
  const shouldReduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (shouldReduceMotion) {
      return;
    }
    const id = setInterval(() => {
      setIndex((value) => (value + 1) % STATES.length);
    }, STATE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [shouldReduceMotion]);

  const state = STATES[index];
  const amplitude = useSimulatedAmplitude(state);

  return (
    <div className="flex size-[200px] items-center justify-center">
      <SiriOrb amplitude={amplitude} size="176px" state={state} />
    </div>
  );
};

export default SiriOrbCanvasDemo;
