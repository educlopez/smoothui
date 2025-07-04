"use client"

import Link from "next/link"
import { motion } from "motion/react"

import { Button } from "@/components/button"
import Divider from "@/components/landing/divider"
import { MotionLogo } from "@/components/resources/logos/MotionLogo"
import { ReactLogo } from "@/components/resources/logos/ReactLogo"
import { TailwindLogo } from "@/components/resources/logos/TailwindLogo"

export function Hero() {
  return (
    <>
      <main>
        <section>
          <div className="relative -mt-8 -mb-8 overflow-hidden py-24 md:py-36">
            <Divider />
            <motion.div
              className="box-border max-w-full"
              style={{ transformOrigin: "center top" }}
              initial={{
                scale: 1.2,
                y: -40,
                opacity: 0,
                filter: "blur(12px)",
              }}
              animate={{
                scale: 1,
                y: 0,
                opacity: 1,
                filter: "blur(0px)",
              }}
              transition={{
                type: "spring",
                bounce: 0.38,
                duration: 1.2,
              }}
            >
              <div className="mx-auto max-w-7xl px-6">
                <div className="mt-8 text-center sm:mx-auto lg:mt-16 lg:mr-auto">
                  <h1 className="text-4xl font-bold text-balance whitespace-pre-line md:text-5xl">
                    Super Smooth
                    <br /> UI Components for Every Team
                  </h1>
                  <p className="mx-auto mt-8 max-w-2xl text-lg text-balance">
                    Highly customizable, production-ready UI blocks for building
                    beautiful websites and apps that look and feel the way you
                    mean it.
                  </p>
                  <div className="mt-12 flex flex-col items-center justify-center gap-2 md:flex-row">
                    <Button variant="candy" asChild>
                      <Link href="/doc">Get Started</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/doc/components/job-listing-component">
                        Explore components
                      </Link>
                    </Button>
                  </div>
                  <div>
                    <div className="text-primary-foreground mt-14 hidden cursor-default items-center justify-start gap-3 text-xs font-medium tracking-widest uppercase transition sm:flex sm:justify-center">
                      <span className="group flex items-center gap-1.5">
                        <ReactLogo className="text-smooth-700 group-hover:text-brand h-6 transition" />
                        <span className="group-hover:text-brand">React</span>
                      </span>
                      <span className="group flex items-center gap-1.5">
                        <TailwindLogo className="text-smooth-700 group-hover:text-brand h-5 transition" />
                        <span className="group-hover:text-brand">
                          Tailwind CSS
                        </span>
                      </span>
                      <span className="group flex items-center gap-1.5">
                        <MotionLogo className="text-smooth-700 group-hover:text-brand h-4 transition" />
                        <span className="group-hover:text-brand">Motion</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  )
}
