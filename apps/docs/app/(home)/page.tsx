import { BlockCategories } from "@docs/components/landing/block-categories";
import { ComponentsSlideshow } from "@docs/components/landing/components-slideshow";
import { FAQ } from "@docs/components/landing/faqs";
import { Features } from "@docs/components/landing/features";
import Footer from "@docs/components/landing/footer";
import { Hero } from "@docs/components/landing/hero";
import { Sponsors } from "@docs/components/landing/sponsors";
import { WhatTheySay } from "@docs/components/landing/what-they-say";

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <ComponentsSlideshow />
      <BlockCategories />
      <FAQ />
      <WhatTheySay />
      <Sponsors />
      <Footer />
    </>
  );
}
