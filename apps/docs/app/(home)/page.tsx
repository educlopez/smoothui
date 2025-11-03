import { ComponentsSlideshow } from "../../components/landing/components-slideshow";
import { FAQ } from "../../components/landing/faqs";
import { Features } from "../../components/landing/features";
import Footer from "../../components/landing/footer";
import { Hero } from "../../components/landing/hero";

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
