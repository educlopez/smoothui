"use client";

import type { Testimonial } from "@repo/smoothui/components/inline-testimonials";
import InlineTestimonials from "@repo/smoothui/components/inline-testimonials";

const TESTIMONIALS: Testimonial[] = [
  {
    avatar: "https://i.pravatar.cc/128?img=15",
    id: "farah",
    name: "Farah Nassar",
    quote:
      "We shipped the new dashboard three weeks early, and nobody had to touch the data layer to do it.",
    rating: 5,
    role: "Head of Product, Lumen",
  },
  {
    avatar: "https://i.pravatar.cc/128?img=26",
    id: "kwame",
    name: "Kwame Osei",
    quote:
      "The accessibility defaults meant our audit came back clean on the first try. Rare for a motion-heavy library.",
    rating: 5,
    role: "Staff Engineer, Northwind",
  },
  {
    avatar: "https://i.pravatar.cc/128?img=32",
    id: "mei",
    name: "Mei Tanaka",
    quote:
      "I reviewed 40 screens in an afternoon. Every transition already behaved the same way.",
    rating: 4,
    role: "Design Lead, Lumen",
  },
];

const STORY =
  "The brief was small: make the dashboard feel fast. {{farah}} ruled out a rewrite, so the team replaced the interaction layer instead. {{kwame}} took the accessibility pass, and by the time {{mei}} reviewed it, only copy tweaks were left.";

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
