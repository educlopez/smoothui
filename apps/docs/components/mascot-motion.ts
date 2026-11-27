"use client";

import {
  DURATION,
  DURATION_INSTANT,
  EASE_IN_OUT,
  EASE_OUT,
} from "@repo/smoothui/lib/animation";
import {
  animate,
  useAnimationControls,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { useEffect, useRef, useState } from "react";

export type MascotExpression =
  | "neutral"
  | "curious"
  | "happy"
  | "wink"
  | "dizzy"
  | "surprised";

type Point = { x: number; y: number };
type GazeSubscriber = (point: Point | null) => void;

const REST_GAZE = { x: 0, y: 0 };
const REST_POSE = { rotate: 0, scaleX: 1, scaleY: 1, y: 0 };
const POSE_BOUNCE = {
  curious: { rotate: [0, -4, 0], y: [0, -3, 0] },
  dizzy: { rotate: [0, -9, 7, 0] },
  happy: {
    scaleX: [1, 1.075, 0.96, 1],
    scaleY: [1, 0.93, 1.055, 1],
    y: [0, 3, -18, 0],
  },
  neutral: REST_POSE,
  surprised: { scaleX: 1.05, scaleY: 0.93, y: 5 },
  wink: { rotate: [0, -5, 0], y: [0, -6, 0] },
};

const FINE_POINTER = "(any-hover: hover) and (any-pointer: fine)";
const PRIMARY_FINE_POINTER = "(hover: hover) and (pointer: fine)";
const HINT_TIME = 440;
const MIN_IDLE_BLINK = 3300;
const IDLE_BLINK_RANGE = 2900;
const GAZE_SPRING = { damping: 29, mass: 0.8, stiffness: 285 };
const gazeSubscribers = new Set<GazeSubscriber>();
let detachGaze: (() => void) | undefined;

function attachGaze() {
  let frame = 0;
  let point: Point | null = null;
  const flush = () => {
    frame = 0;
    for (const subscriber of gazeSubscribers) {
      subscriber(point);
    }
  };
  const reset = () => {
    point = null;
    cancelAnimationFrame(frame);
    flush();
  };
  const move = (event: PointerEvent) => {
    if (document.hidden || event.pointerType !== "mouse") {
      return;
    }
    point = { x: event.clientX, y: event.clientY };
    if (!frame) {
      frame = requestAnimationFrame(flush);
    }
  };
  const out = (event: PointerEvent) => {
    if (!event.relatedTarget) {
      reset();
    }
  };
  window.addEventListener("pointermove", move, { passive: true });
  window.addEventListener("pointerout", out);
  window.addEventListener("blur", reset);
  document.addEventListener("visibilitychange", reset);
  return () => {
    cancelAnimationFrame(frame);
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerout", out);
    window.removeEventListener("blur", reset);
    document.removeEventListener("visibilitychange", reset);
  };
}

function subscribeGaze(subscriber: GazeSubscriber) {
  gazeSubscribers.add(subscriber);
  detachGaze ??= attachGaze();
  return () => {
    gazeSubscribers.delete(subscriber);
    if (!gazeSubscribers.size) {
      detachGaze?.();
      detachGaze = undefined;
    }
  };
}

function gazeAt(point: Point, box: DOMRect): Point {
  const dx = point.x - (box.left + box.width * 0.48);
  const dy = point.y - (box.top + box.height * 0.5);
  const distance = Math.hypot(dx, dy);
  if (!distance) {
    return REST_GAZE;
  }
  const reach = Math.max(160, box.height * 2.8);
  const near = Math.min(1, distance / 62);
  const far = Math.max(0, Math.min(1, (reach - distance) / (reach * 0.42)));
  const weight = (near * far * far * (3 - 2 * far)) / distance;
  return { x: dx * weight * 42, y: dy * weight * 36 };
}

export function useMascotMotion(
  expression: MascotExpression | undefined,
  reactionKey: number
) {
  const ref = useRef<SVGSVGElement>(null);
  const visible = useInView(ref);
  const reduced = useReducedMotion();
  const controls = useAnimationControls();
  const [localExpression, setLocalExpression] =
    useState<MascotExpression>("neutral");
  const face = expression ?? (visible ? localExpression : "neutral");
  const eyeX = useSpring(0, GAZE_SPRING);
  const eyeY = useSpring(0, GAZE_SPRING);
  const blink = useMotionValue(1);

  useEffect(() => {
    const svg = ref.current;
    if (!(svg && visible)) {
      return;
    }

    const host = svg.closest("[data-mascot-surface],a,button") ?? svg;
    const interactive = host.matches("a,button");
    const pointer = window.matchMedia(FINE_POINTER);
    // The visible-only effect can mount after the pointer has entered the host.
    let hovered =
      !reduced &&
      window.matchMedia(PRIMARY_FINE_POINTER).matches &&
      host.matches(":hover");
    let focused = interactive && document.activeElement === host;
    let pressed = false;
    let settle: ReturnType<typeof setTimeout> | undefined;

    const rest = () => {
      setLocalExpression(
        !reduced && (hovered || focused) ? "curious" : "neutral"
      );
    };
    const enter = (event: Event) => {
      if (
        reduced ||
        !pointer.matches ||
        !(event instanceof PointerEvent && event.pointerType === "mouse")
      ) {
        return;
      }
      hovered = true;
      if (!(pressed || settle)) {
        rest();
      }
    };
    const leave = () => {
      hovered = false;
      if (!(pressed || settle)) {
        rest();
      }
    };
    const focus = () => {
      focused = true;
      if (!(reduced || pressed || settle)) {
        rest();
      }
    };
    const blur = () => {
      focused = false;
      if (!(pressed || settle)) {
        rest();
      }
    };
    const press = (event: Event) => {
      if (!(event instanceof PointerEvent) || event.button !== 0) {
        return;
      }
      clearTimeout(settle);
      settle = undefined;
      pressed = true;
      setLocalExpression("surprised");
    };
    const release = (event: Event) => {
      if (!pressed) {
        return;
      }
      pressed = false;
      if (event.target instanceof Node && host.contains(event.target)) {
        setLocalExpression("wink");
        settle = setTimeout(() => {
          settle = undefined;
          rest();
        }, HINT_TIME);
      } else {
        rest();
      }
    };
    const cancel = () => {
      pressed = false;
      rest();
    };
    const track = (point: Point | null) => {
      const box = point && pointer.matches ? svg.getBoundingClientRect() : null;
      const gaze =
        point && box?.width && box.height ? gazeAt(point, box) : REST_GAZE;
      eyeX.set(gaze.x);
      eyeY.set(gaze.y);
    };
    rest();
    const unsubscribe = reduced ? undefined : subscribeGaze(track);
    host.addEventListener("pointerenter", enter);
    host.addEventListener("pointerleave", leave);
    host.addEventListener("focus", focus);
    host.addEventListener("blur", blur);
    if (interactive) {
      host.addEventListener("pointerdown", press);
      window.addEventListener("pointerup", release);
      window.addEventListener("pointercancel", cancel);
      window.addEventListener("blur", cancel);
    }
    return () => {
      clearTimeout(settle);
      unsubscribe?.();
      host.removeEventListener("pointerenter", enter);
      host.removeEventListener("pointerleave", leave);
      host.removeEventListener("focus", focus);
      host.removeEventListener("blur", blur);
      host.removeEventListener("pointerdown", press);
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", cancel);
      window.removeEventListener("blur", cancel);
      eyeX.jump(0);
      eyeY.jump(0);
    };
  }, [eyeX, eyeY, reduced, visible]);

  useEffect(() => {
    if (reduced || !visible || (face !== "neutral" && face !== "curious")) {
      return;
    }
    let timer: ReturnType<typeof setTimeout> | undefined;
    let running: { stop: () => void } | undefined;
    const pause = () => {
      clearTimeout(timer);
      running?.stop();
      blink.jump(1);
    };
    const schedule = () => {
      if (!document.hidden) {
        timer = setTimeout(
          () => {
            running = animate(blink, [1, 0.08, 1], {
              duration: 0.19,
              ease: EASE_IN_OUT,
              times: [0, 0.42, 1],
            });
            schedule();
          },
          MIN_IDLE_BLINK + Math.random() * IDLE_BLINK_RANGE
        );
      }
    };
    const visibility = () => {
      pause();
      schedule();
    };
    schedule();
    document.addEventListener("visibilitychange", visibility);
    return () => {
      pause();
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [blink, face, reduced, visible]);

  useEffect(() => {
    controls.stop();
    if (reduced || !visible) {
      controls.set(REST_POSE);
      return;
    }
    if (reactionKey >= 0) {
      controls.start({
        ...REST_POSE,
        ...POSE_BOUNCE[face],
        transition: { duration: DURATION.complex, ease: EASE_OUT },
      });
    }
    return () => controls.stop();
  }, [controls, face, reactionKey, reduced, visible]);

  return {
    blink,
    controls,
    eyeX,
    eyeY,
    face,
    ref,
    transition: reduced
      ? DURATION_INSTANT
      : { duration: DURATION.fast, ease: EASE_OUT },
  };
}
