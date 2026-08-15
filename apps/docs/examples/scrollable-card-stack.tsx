"use client";

import {
  STACK_CAST,
  STACK_SCENES,
  sceneSrc,
} from "@docs/examples/shared/demo-fixtures";
import ScrollableCardStack from "@repo/smoothui/components/scrollable-card-stack";
import { founder } from "@smoothui/data";

/**
 * The same cards as the landing-canvas demo, one card longer. Both read their
 * people and scenes from the shared fixtures, so the component cannot show one
 * set of faces on the landing and another in its own documentation.
 *
 * The real account is the only one with a real link; the invented three point
 * at example.com rather than at x.com handles they do not own.
 */
const cards = [
  {
    avatar: `${founder.avatar}&tr=w-80,h-80,f-auto`,
    handle: "@educalvolpz",
    href: founder.social.twitter,
    name: founder.name,
  },
  ...STACK_CAST.map((person) => ({
    avatar: `${person.avatar}?tr=w-80,h-80,f-auto`,
    handle: person.handle,
    href: `https://example.com/${person.handle.replace("@", "")}`,
    name: person.name,
  })),
];

const items = cards.map((card, index) => ({
  ...card,
  id: STACK_SCENES[index],
  image: sceneSrc(STACK_SCENES[index], "w-600,h-380"),
}));

export default function ScrollableCardStackDemo() {
  return (
    <div className="mx-auto w-full max-w-md">
      <ScrollableCardStack
        cardHeight={200}
        className="mx-auto"
        items={items}
        perspective={1200}
        transitionDuration={200}
      />
    </div>
  );
}
