"use client";

import type { EmojiReactionItem } from "@repo/smoothui/components/emoji-reaction";
import EmojiReaction from "@repo/smoothui/components/emoji-reaction";
import { useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

/** Long enough for the odometer spring to settle before the next hand-off. */
const REACT_MS = 1900;

const INITIAL: EmojiReactionItem[] = [
  { count: 128, emoji: "🔥", id: "fire", label: "Fire", reacted: true },
  { count: 41, emoji: "🎉", id: "party", label: "Celebrate" },
  { count: 17, emoji: "🚀", id: "ship", label: "Ship it" },
];

/**
 * Reactions here are exclusive, so a tick hands one point from the lit pill to
 * the next: both odometers roll at once, in opposite directions, and the
 * pressed-in styling moves along the row. Counts orbit their starting values
 * rather than inflating over an afternoon on the landing page.
 */
const handOver = (current: EmojiReactionItem[]): EmojiReactionItem[] => {
  const lit = current.findIndex((reaction) => reaction.reacted);
  const next = (lit + 1) % current.length;

  return current.map((reaction, index) => {
    if (index === lit) {
      return {
        ...reaction,
        count: Math.max(0, (reaction.count ?? 0) - 1),
        reacted: false,
      };
    }
    if (index === next) {
      return { ...reaction, count: (reaction.count ?? 0) + 1, reacted: true };
    }
    return reaction;
  });
};

/**
 * Driven through the `reactions` prop rather than by pressing the pills. A
 * synthetic press would also fire the particle burst, but the emoji glyph is
 * keyed on a press counter and its predecessors are left in the DOM, so a demo
 * that pressed all day would slowly grow a row of emoji. The prop route keeps
 * the odometer — the part that actually reads as alive.
 */
const EmojiReactionCanvasDemo = () => {
  const shouldReduceMotion = useReducedMotion();
  const [reactions, setReactions] = useState(INITIAL);

  useEffect(() => {
    if (shouldReduceMotion) {
      return;
    }
    const timer = setInterval(() => {
      setReactions(handOver);
    }, REACT_MS);
    return () => clearInterval(timer);
  }, [shouldReduceMotion]);

  return (
    <div className="flex w-[240px] items-center justify-center py-4">
      <EmojiReaction reactions={reactions} />
    </div>
  );
};

export default EmojiReactionCanvasDemo;
