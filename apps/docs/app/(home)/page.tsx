import { AISection } from "@docs/components/landing/ai-section";
import { BlockCategories } from "@docs/components/landing/block-categories";
import { ClosingCta } from "@docs/components/landing/closing-cta";
import { ComponentsSlideshow } from "@docs/components/landing/components-slideshow";
import { Coverage } from "@docs/components/landing/coverage";
import { FAQ } from "@docs/components/landing/faqs";
import { Features } from "@docs/components/landing/features";
import Footer from "@docs/components/landing/footer";
import { Hero } from "@docs/components/landing/hero";
import { LatestPosts } from "@docs/components/landing/latest-posts";
import { SkillsSection } from "@docs/components/landing/skills-section";
import { SocialProof } from "@docs/components/landing/social-proof";
import { WhatTheySay } from "@docs/components/landing/what-they-say";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

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
      <SocialProof />
      <Suspense fallback={<SectionSkeleton minHeight="600px" />}>
        <ComponentsSlideshow />
      </Suspense>
      <Features />
      <BlockCategories />
      <AISection />
      <SkillsSection />
      <Suspense fallback={<SectionSkeleton minHeight="700px" />}>
        <WhatTheySay />
      </Suspense>
      <Coverage />
      <FAQ />
      <Suspense fallback={<SectionSkeleton minHeight="500px" />}>
        <LatestPosts />
      </Suspense>
      <ClosingCta />
      <Footer />
    </>
  );
}
