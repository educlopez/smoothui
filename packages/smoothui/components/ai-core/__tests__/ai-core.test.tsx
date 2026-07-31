import { describe, expect, it } from "vitest";
import {
  AI_ACCENT_COLORS,
  AI_STATE_MOTION,
  type AIState,
  getAIStateAccentColor,
  getAIStateMotion,
} from "../index";

const ALL_STATES: AIState[] = [
  "idle",
  "listening",
  "thinking",
  "streaming",
  "done",
  "error",
];

describe("AI_STATE_MOTION", () => {
  it("covers every state", () => {
    for (const state of ALL_STATES) {
      expect(AI_STATE_MOTION[state]).toBeDefined();
    }
  });

  it("gives every state a distinct motif", () => {
    const motifs = ALL_STATES.map((state) => AI_STATE_MOTION[state].motif);
    expect(new Set(motifs).size).toBe(ALL_STATES.length);
  });

  it("keeps thinking at rest scale so the layout stays calm while working", () => {
    expect(AI_STATE_MOTION.thinking.scale).toBe(1);
  });

  it("churns hardest while thinking, without growing", () => {
    const { thinking } = AI_STATE_MOTION;
    for (const state of ALL_STATES) {
      expect(thinking.turbulence).toBeGreaterThanOrEqual(
        AI_STATE_MOTION[state].turbulence
      );
    }
  });

  it("settles the field almost still on done", () => {
    expect(AI_STATE_MOTION.done.turbulence).toBeLessThan(
      AI_STATE_MOTION.idle.turbulence + 0.1
    );
  });

  it("stalls the tumble on error so the surface twitches instead of flowing", () => {
    expect(AI_STATE_MOTION.error.tumble).toBe(0);
    expect(AI_STATE_MOTION.error.turbulence).toBeGreaterThan(0);
  });

  it("desaturates error instead of enlarging it", () => {
    expect(AI_STATE_MOTION.error.saturation).toBeLessThan(1);
    expect(AI_STATE_MOTION.error.scale).toBeLessThanOrEqual(1);
  });

  it("only reacts to amplitude when the state implies listening", () => {
    expect(AI_STATE_MOTION.listening.reactivity).toBeGreaterThan(
      AI_STATE_MOTION.thinking.reactivity
    );
    expect(AI_STATE_MOTION.idle.reactivity).toBe(0);
    expect(AI_STATE_MOTION.error.reactivity).toBe(0);
  });
});

describe("getAIStateMotion", () => {
  it("falls back to idle for an undefined state", () => {
    expect(getAIStateMotion(undefined)).toBe(AI_STATE_MOTION.idle);
  });

  it("returns the matching preset", () => {
    expect(getAIStateMotion("done")).toBe(AI_STATE_MOTION.done);
  });
});

describe("getAIStateAccentColor", () => {
  it("uses the semantic accent for done and error", () => {
    expect(getAIStateAccentColor("done", "#fff")).toBe(
      AI_ACCENT_COLORS.success
    );
    expect(getAIStateAccentColor("error", "#fff")).toBe(
      AI_ACCENT_COLORS.danger
    );
  });

  it("falls back to the caller's own colour otherwise", () => {
    for (const state of [
      "idle",
      "listening",
      "thinking",
      "streaming",
    ] as const) {
      expect(getAIStateAccentColor(state, "#abcdef")).toBe("#abcdef");
    }
  });
});
