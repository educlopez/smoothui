"use client";

import ScrollableCardStack from "@repo/smoothui/components/scrollable-card-stack";
import { founder } from "@smoothui/data";
import { somePeople } from "@smoothui/data/people";
import { sceneById } from "@smoothui/data/scenes";
import { useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

/** One card per tick, clear of the component's own 300ms scroll lockout. */
const ADVANCE_MS = 2000;
const CARD_HEIGHT = 150;

const photo = (id: string) => `${sceneById(id)?.src}?tr=w-600,h-380,f-auto`;
const face = (person: { avatar: string }) =>
  `${person.avatar}?tr=w-80,h-80,f-auto`;

// Two of the cast plus the real account. The invented pair link to example.com
// rather than to x.com handles they do not own.
const [second, third] = somePeople(2, 12);

const items = [
  {
    avatar: `${founder.avatar}&tr=w-80,h-80,f-auto`,
    handle: "@educalvolpz",
    href: founder.social.twitter,
    id: "ridge",
    image: photo("blue-ridge-night"),
    name: founder.name,
  },
  {
    avatar: face(second),
    handle: second.handle,
    href: `https://example.com/${second.handle.replace("@", "")}`,
    id: "harbour",
    image: photo("lake-camp"),
    name: second.name,
  },
  {
    avatar: face(third),
    handle: third.handle,
    href: `https://example.com/${third.handle.replace("@", "")}`,
    id: "dunes",
    image: photo("dune-shadow"),
    name: third.name,
  },
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
