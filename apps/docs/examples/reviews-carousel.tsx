"use client";

import type { Review } from "@repo/smoothui/components/reviews-carousel";
import ReviewsCarousel from "@repo/smoothui/components/reviews-carousel";

const sampleReviews: Review[] = [
  {
    author: "Sarah Johnson",
    body: "SmoothUI has completely transformed how I build user interfaces. The animations are smooth, the components are well-designed, and the documentation is excellent. Highly recommend!",
    id: 1,
    title: "Frontend Developer at TechCorp",
  },
  {
    author: "Michael Chen",
    body: "I've been using SmoothUI for my latest project and I'm impressed by the quality of the components. The spring animations feel natural and the API is intuitive.",
    id: 2,
    title: "UI/UX Designer",
  },
  {
    author: "Emily Rodriguez",
    body: "The best part about SmoothUI is how easy it is to customize. I can create beautiful, animated interfaces without spending hours on implementation details.",
    id: 3,
    title: "Full Stack Developer",
  },
  {
    author: "David Kim",
    body: "As someone who values both aesthetics and performance, SmoothUI hits the perfect balance. The components are performant and look amazing.",
    id: 4,
    title: "Product Engineer",
  },
  {
    author: "Lisa Anderson",
    body: "The carousel component is particularly impressive. The spring physics make the interactions feel natural and delightful. Great work!",
    id: 5,
    title: "Creative Director",
  },
];

export default function ReviewsCarouselDemo() {
  return (
    <div className="flex min-h-[600px] w-full items-center justify-center overflow-visible p-8">
      <div className="w-full max-w-4xl overflow-visible">
        <ReviewsCarousel height="300px" reviews={sampleReviews} />
      </div>
    </div>
  );
}
