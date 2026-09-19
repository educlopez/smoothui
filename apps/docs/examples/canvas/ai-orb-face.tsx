"use client";

import {
  type AIState,
  useSimulatedAmplitude,
} from "@repo/smoothui/components/ai-core";
import AIOrbFace from "@repo/smoothui/components/ai-orb-face";
import { useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

/**
 * The character changing its mind. Gaze is off — the pointer is busy dragging
 * the canvas — so the expression cycle carries it: it listens, thinks, streams,
 * then lands on done and starts over.
 */
const STATES: AIState[] = ["listening", "thinking", "streaming", "done"];
const STATE_INTERVAL_MS = 2800;

const AiOrbFaceCanvasDemo = () => {
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
      <AIOrbFace amplitude={amplitude} gaze={false} size={156} state={state} />
    </div>
  );
};

export default AiOrbFaceCanvasDemo;
