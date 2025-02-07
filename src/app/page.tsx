import Footer from "@/app/components/footer"
import { ComponentsSlideshow } from "@/app/components/landing/components-slideshow"
import Divider from "@/app/components/landing/divider"
import { FAQ } from "@/app/components/landing/faq"
import { Features } from "@/app/components/landing/features"
import { Hero } from "@/app/components/landing/hero"

export default function Home() {
  return (
    <>
      <main className="relative mx-auto flex min-h-screen max-w-7xl flex-col">
        <Divider orientation="vertical" />
        <Divider orientation="vertical" className="right-auto left-0" />
        <Hero />
        <Features />
        <ComponentsSlideshow />
        <FAQ />
        <Footer />
      </main>
    </>
  )
}
