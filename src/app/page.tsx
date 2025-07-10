import BlurMagic from "@/components/blurMagic"
import Footer from "@/components/footer"
import { BgLines } from "@/components/landing/bg-lines"
import { ComponentsSlideshow } from "@/components/landing/components-slideshow"
import Divider from "@/components/landing/divider"
import { FAQ } from "@/components/landing/faq"
import { Features } from "@/components/landing/features"
import { Hero } from "@/components/landing/hero"
import Navbar from "@/components/landing/navbar/navbar"

export default function Home() {
  return (
    <div className="bg-primary relative isolate">
      <BgLines />
      <main className="relative mx-auto min-h-screen max-w-7xl overflow-y-auto">
        <Navbar className="mx-auto max-w-7xl" />
        <Divider orientation="vertical" />
        <Divider orientation="vertical" className="right-auto left-0" />
        <section className="flex flex-col overflow-hidden">
          <Hero />
          <Features />
          <ComponentsSlideshow />
          <FAQ />
          <Footer />
        </section>
      </main>
      <BlurMagic side="top" className="z-2 !h-[120px]" stop="50%" blur="4px" />
      <BlurMagic side="bottom" className="z-2 !h-[120px]" />
    </div>
  )
}
