import Link from "next/link"
import { ArrowRight } from "lucide-react"

import Divider from "@/app/components/landing/divider"
import { ReactLogo } from "@/app/components/resources/logos/ReactLogo"
import { TailwindLogo } from "@/app/components/resources/logos/TailwindLogo"

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
      <main className="overflow-hidden">
        <section>
          <div className="relative py-24 md:py-36">
            <Rule position="bottom-right" />
            <Rule position="bottom-left" />
            <Divider />
            <div className="mx-auto max-w-7xl px-6">
              <div className="text-center sm:mx-auto lg:mt-0 lg:mr-auto">
                <AnimatedGroup variants={transitionVariants}>
                  <Link
                    href="/doc/changelog"
                    className="hover:bg-background dark:hover:border-t-border bg-muted group mx-auto flex w-fit items-center gap-4 rounded-full border p-1 pl-4 shadow-md shadow-zinc-950/5 transition-colors duration-300 dark:border-t-white/5 dark:shadow-zinc-950"
                  >
                    <span className="text-foreground text-sm">Changelog</span>
                    <span className="dark:border-background block h-4 w-0.5 border-l bg-white dark:bg-zinc-700"></span>

                    <div className="bg-background group-hover:bg-muted size-6 overflow-hidden rounded-full duration-500">
                      <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                        <span className="flex size-6">
                          <ArrowRight className="m-auto size-3" />
                        </span>
                        <span className="flex size-6">
                          <ArrowRight className="m-auto size-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </AnimatedGroup>

                <AnimatedText
                  as="h1"
                  className="mt-8 text-4xl text-balance md:text-5xl lg:mt-16"
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
                    <Link href="/doc">
                      Get Started
                      <ArrowRight className="transition-transform group-hover:translate-x-1" />
                    </Link>
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
