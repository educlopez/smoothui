import BlurMagic from "@/app/components/blurMagic"
import Footer from "@/app/components/footer"
import { ComponentsSlideshow } from "@/app/components/landing/components-slideshow"
import Divider from "@/app/components/landing/divider"
import { FAQ } from "@/app/components/landing/faq"
import { Features } from "@/app/components/landing/features"
import { Hero } from "@/app/components/landing/hero"
import Navbar from "@/app/components/landing/navbar"

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="relative mx-auto flex min-h-screen max-w-7xl flex-col">
        <Divider orientation="vertical" />
        <Divider orientation="vertical" className="right-auto left-0" />
        <Hero />
        <Features />
        <ComponentsSlideshow />
        <FAQ />
        <Footer />
        <BlurMagic side="top" className="!h-[120px]" stop="50%" blur="4px" />
        <BlurMagic side="bottom" className="!h-[120px]" stop="50%" blur="4px" />
      </main>
    </>
  )
}
