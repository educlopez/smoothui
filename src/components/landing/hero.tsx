import Link from "next/link"
import { ArrowRight } from "lucide-react"

import Divider from "@/components/landing/divider"
import { ReactLogo } from "@/components/resources/logos/ReactLogo"
import { TailwindLogo } from "@/components/resources/logos/TailwindLogo"

import { Button } from "../button"
import { AnimatedGroup } from "./animated-group"
import { AnimatedText } from "./animated-text"
import GithubStars from "./githubstars"
import Rule from "./rule"

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: "blur(12px)",
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        type: "spring",
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
}

export function Hero() {
  return (
    <>
      <main>
        <section>
          <div className="relative py-24 md:py-36">
            <Rule position="bottom-right" />
            <Rule position="bottom-left" />
            <Divider />
            <div className="mx-auto max-w-7xl px-6">
              <div className="text-center sm:mx-auto lg:mt-0 lg:mr-auto">
                <AnimatedText
                  as="h1"
                  className="font-title mt-8 text-4xl font-bold text-balance md:text-5xl lg:mt-16"
                >
                  Build and Ship 10x Faster with Modern React & Tailwind
                  Components
                </AnimatedText>
                <AnimatedText
                  as="p"
                  delay={0.5}
                  className="mx-auto mt-8 max-w-2xl text-lg text-balance"
                >
                  Highly customizable, production-ready UI blocks for building
                  beautiful websites and apps that look and feel the way you
                  mean it.
                </AnimatedText>
                <AnimatedGroup
                  variants={{
                    container: {
                      visible: {
                        transition: {
                          staggerChildren: 0.05,
                          delayChildren: 0.75,
                        },
                      },
                    },
                    ...transitionVariants,
                  }}
                  className="mt-12 flex flex-col items-center justify-center gap-2 md:flex-row"
                >
                  <Button variant="candy" asChild>
                    <Link href="/doc">Get Started</Link>
                  </Button>
                  <GithubStars />
                </AnimatedGroup>
                <AnimatedGroup
                  variants={{
                    container: {
                      visible: {
                        transition: {
                          staggerChildren: 0.05,
                          delayChildren: 0.75,
                        },
                      },
                    },
                    ...transitionVariants,
                  }}
                >
                  <div className="text-primary-foreground mt-14 hidden cursor-default items-center justify-start gap-3 text-xs font-medium tracking-widest uppercase transition sm:flex sm:justify-center">
                    <span>Built for</span>
                    <span className="group flex items-center gap-1.5">
                      <ReactLogo className="text-smooth-700 group-hover:text-candy h-6 transition" />
                      <span className="group-hover:text-candy">React</span>
                    </span>
                    <span className="group flex items-center gap-1.5">
                      <TailwindLogo className="text-smooth-700 group-hover:text-candy h-5 transition" />
                      <span className="group-hover:text-candy">
                        Tailwind CSS
                      </span>
                    </span>
                  </div>
                </AnimatedGroup>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
