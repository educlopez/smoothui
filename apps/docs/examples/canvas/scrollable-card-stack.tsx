"use client";

import {
  STACK_CAST,
  STACK_SCENES,
  sceneSrc,
} from "@docs/examples/shared/demo-fixtures";
import ScrollableCardStack from "@repo/smoothui/components/scrollable-card-stack";
import { founder } from "@smoothui/data";
import { useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

/** One card per tick, clear of the component's own 300ms scroll lockout. */
const ADVANCE_MS = 2000;
const CARD_HEIGHT = 150;

const items = [
  {
    avatar: `${founder.avatar}&tr=w-80,h-80,f-auto`,
    handle: "@educalvolpz",
    href: founder.social.twitter,
    id: STACK_SCENES[0],
    image: sceneSrc(STACK_SCENES[0], "w-600,h-380"),
    name: founder.name,
  },
  ...STACK_CAST.slice(0, 2).map((person, index) => ({
    avatar: `${person.avatar}?tr=w-80,h-80,f-auto`,
    handle: person.handle,
    href: `https://example.com/${person.handle.replace("@", "")}`,
    id: STACK_SCENES[index + 1],
    image: sceneSrc(STACK_SCENES[index + 1], "w-600,h-380"),
    name: person.name,
  })),
];

/**
 * The stack advances on the wheel, which the canvas never gives it — the page
 * keeps its own scroll. So the demo walks the component's own pagination
 * instead, up the stack and back down, and the cards scale, blur and settle
 * exactly as they would under a real scroll.
 */
const ScrollableCardStackCanvasDemo = () => {
  const shouldReduceMotion = useReducedMotion();
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (shouldReduceMotion) {
      return;
    }
    let index = 0;
    let direction = 1;

    const timer = setInterval(() => {
      const dots =
        hostRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
      if (!dots?.length) {
        return;
      }
      if (index >= dots.length - 1) {
        direction = -1;
      }
      if (index <= 0) {
        direction = 1;
      }
      index += direction;
      dots[index]?.click();
    }, ADVANCE_MS);

    return () => clearInterval(timer);
  }, [shouldReduceMotion]);

  return (
    <div className="w-[300px]" ref={hostRef}>
      <ScrollableCardStack cardHeight={CARD_HEIGHT} items={items} />
    </div>
  );
};

export default ScrollableCardStackCanvasDemo;
