import { ComponentsSlideshow } from "@docs/components/landing/components-slideshow";
import { FAQ } from "@docs/components/landing/faqs";
import { Features } from "@docs/components/landing/features";
import Footer from "@docs/components/landing/footer";
import { Hero } from "@docs/components/landing/hero";

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <ComponentsSlideshow />
      <FAQ />
      <Footer />
    </>
  );
}
