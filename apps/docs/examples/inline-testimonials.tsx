"use client";

import type { Testimonial } from "@repo/smoothui/components/inline-testimonials";
import InlineTestimonials from "@repo/smoothui/components/inline-testimonials";
import { somePeople } from "@smoothui/data/people";

// Three of the shared cast, so these faces and job titles match wherever else
// they turn up in the docs. The quotes belong to this demo's story, not to the
// people, so they stay here rather than in the dictionary.
const QUOTES = [
  {
    quote:
      "We shipped the new dashboard three weeks early, and nobody had to touch the data layer to do it.",
    rating: 5,
  },
  {
    quote:
      "The accessibility defaults meant our audit came back clean on the first try. Rare for a motion-heavy library.",
    rating: 5,
  },
  {
    quote:
      "I reviewed 40 screens in an afternoon. Every transition already behaved the same way.",
    rating: 4,
  },
];

const CAST = somePeople(QUOTES.length, 20);

const TESTIMONIALS: Testimonial[] = CAST.map((person, index) => ({
  avatar: `${person.avatar}?tr=w-128,h-128,f-auto`,
  id: person.id,
  name: person.name,
  quote: QUOTES[index].quote,
  rating: QUOTES[index].rating,
  role: `${person.role}, ${person.company}`,
}));

const [lead, engineer, reviewer] = CAST;

const STORY = `The brief was small: make the dashboard feel fast. {{${lead.id}}} ruled out a rewrite, so the team replaced the interaction layer instead. {{${engineer.id}}} took the accessibility pass, and by the time {{${reviewer.id}}} reviewed it, only copy tweaks were left.`;

export default function InlineTestimonialsDemo() {
  return (
    <div className="flex min-h-[22rem] w-full items-center justify-center py-6">
      <div className="flex w-full max-w-xl flex-col gap-4">
        <span className="font-medium text-[11px] text-muted-foreground uppercase tracking-[0.14em]">
          Case study
        </span>

        <InlineTestimonials
          className="text-lg leading-8"
          testimonials={TESTIMONIALS}
          text={STORY}
        />

        <p className="text-muted-foreground text-xs">
          Hover a name, or tab to it — the quote card opens from the name it
          belongs to.
        </p>
      </div>
    </div>
  );
}
