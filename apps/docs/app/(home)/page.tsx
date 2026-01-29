import { BlockCategories } from "@docs/components/landing/block-categories";
import { ComponentsSlideshow } from "@docs/components/landing/components-slideshow";
import { FAQ } from "@docs/components/landing/faqs";
import { Features } from "@docs/components/landing/features";
import Footer from "@docs/components/landing/footer";
import { Hero } from "@docs/components/landing/hero";
import { Sponsors } from "@docs/components/landing/sponsors";
import { WhatTheySay } from "@docs/components/landing/what-they-say";
import { Suspense } from "react";

function SectionSkeleton({ minHeight = "400px" }: { minHeight?: string }) {
  return (
    <div
      className="flex w-full animate-pulse items-center justify-center bg-background"
      style={{ minHeight }}
    >
      <div className="h-8 w-32 rounded-md bg-muted" />
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <Suspense fallback={<SectionSkeleton minHeight="600px" />}>
        <ComponentsSlideshow />
      </Suspense>
      <BlockCategories />
      <FAQ />
      <Suspense fallback={<SectionSkeleton minHeight="700px" />}>
        <WhatTheySay />
      </Suspense>
      <Sponsors />
      <Footer />
    </>
  );
}
