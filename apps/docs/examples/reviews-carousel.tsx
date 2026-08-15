"use client";

import type { Review } from "@repo/smoothui/components/reviews-carousel";
import ReviewsCarousel from "@repo/smoothui/components/reviews-carousel";
import { somePeople } from "@smoothui/data/people";

/**
 * The words are the demo; who said them comes from the shared cast, so a
 * reviewer here is the same person with the same job elsewhere in the docs.
 */
const BODIES = [
  "SmoothUI has completely transformed how I build user interfaces. The animations are smooth, the components are well-designed, and the documentation is excellent. Highly recommend!",
  "I've been using SmoothUI for my latest project and I'm impressed by the quality of the components. The spring animations feel natural and the API is intuitive.",
  "The best part about SmoothUI is how easy it is to customize. I can create beautiful, animated interfaces without spending hours on implementation details.",
  "As someone who values both aesthetics and performance, SmoothUI hits the perfect balance. The components are performant and look amazing.",
  "The carousel component is particularly impressive. The spring physics make the interactions feel natural and delightful. Great work!",
];

const sampleReviews: Review[] = somePeople(BODIES.length, 55).map(
  (person, index) => ({
    author: person.name,
    body: BODIES[index],
    id: index + 1,
    title: `${person.role} at ${person.company}`,
  })
);

export default function ReviewsCarouselDemo() {
  return (
    <div className="flex min-h-[600px] w-full items-center justify-center overflow-visible p-8">
      <div className="w-full max-w-4xl overflow-visible">
        <ReviewsCarousel height="300px" reviews={sampleReviews} />
      </div>
    </div>
  );
}
