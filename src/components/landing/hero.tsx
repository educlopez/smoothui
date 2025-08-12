"use client"

import Link from "next/link"
import { User } from "lucide-react"
import { motion } from "motion/react"

import { Button } from "@/components/button"
import Divider from "@/components/landing/divider"
import { MotionLogo } from "@/components/resources/logos/MotionLogo"
import { ReactLogo } from "@/components/resources/logos/ReactLogo"
import { TailwindLogo } from "@/components/resources/logos/TailwindLogo"
import AnimatedInput from "@/components/smoothui/ui/AnimatedInput"
import ButtonCopy from "@/components/smoothui/ui/ButtonCopy"
import ClipCornersButton from "@/components/smoothui/ui/ClipCornersButton"
import ExpandableCards from "@/components/smoothui/ui/ExpandableCards"
import ScrambleHover from "@/components/smoothui/ui/ScrambleHover"
import SiriOrb from "@/components/smoothui/ui/SiriOrb"

export function Hero() {
  return (
    <section className="bg-background transition">
      <div className="relative py-24 md:py-36">
        <Divider />
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            {/* Left side - Hero content */}
            <motion.div
              className="space-y-8"
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94], // ease-out-quad
              }}
            >
              {/* Main heading */}
              <h1 className="text-4xl font-bold text-balance md:text-5xl lg:text-6xl">
                Super Smooth UI Components for Every Team
              </h1>

              {/* Description */}
              <p className="text-muted-foreground max-w-lg text-lg">
                Highly customizable, production-ready UI blocks for building
                beautiful websites and apps that look and feel the way you mean
                it.
              </p>

              {/* CTA buttons */}
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button variant="candy" size="lg" asChild>
                  <Link href="/doc">Explore Docs</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/doc/components/job-listing-component">
                    Explore components
                  </Link>
                </Button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="text-primary-foreground mt-14 hidden cursor-default items-center justify-start gap-3 text-xs font-medium tracking-widest uppercase transition sm:flex sm:justify-center">
                    <span className="group flex items-center gap-1.5">
                      <ReactLogo className="text-smooth-700 group-hover:text-brand h-6" />
                      <span className="group-hover:text-brand">React</span>
                    </span>
                    <span className="group flex items-center gap-1.5">
                      <TailwindLogo className="text-smooth-700 group-hover:text-brand h-5" />
                      <span className="group-hover:text-brand">
                        Tailwind CSS
                      </span>
                    </span>
                    <span className="group flex items-center gap-1.5">
                      <MotionLogo className="text-smooth-700 group-hover:text-brand h-4" />
                      <span className="group-hover:text-brand">Motion</span>
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right side - SmoothUI Component showcase */}
            <motion.div
              className="relative"
              initial={{
                opacity: 0,
                x: 20,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.6,
                delay: 0.2,
                ease: [0.25, 0.46, 0.45, 0.94], // ease-out-quad
              }}
            >
              <div className="grid grid-cols-2 gap-4">
                {/* SiriOrb Component */}
                <div className="bg-primary col-span-2 flex justify-center rounded-lg border p-6">
                  <SiriOrb
                    size="120px"
                    animationDuration={15}
                    colors={{
                      bg: "var(--color-primary)",
                    }}
                    className="drop-shadow-lg"
                  />
                </div>

                {/* AnimatedInput Component */}
                <div className="bg-primary rounded-lg border p-4">
                  <AnimatedInput
                    label="Username"
                    icon={<User size={16} strokeWidth={1.5} />}
                    placeholder="Enter username"
                  />
                </div>

                {/* ScrambleHover Component */}
                <div className="bg-primary flex items-center justify-center rounded-lg border p-4">
                  <ScrambleHover className="text-sm font-medium">
                    Hover to Scramble
                  </ScrambleHover>
                </div>

                {/* ClipCornersButton Component */}
                <div className="bg-primary flex items-center justify-center rounded-lg border p-4">
                  <ClipCornersButton className="px-4 py-2 text-xs">
                    Clip Corners
                  </ClipCornersButton>
                </div>

                {/* ButtonCopy Component */}
                <div className="bg-primary flex items-center justify-center rounded-lg border p-4">
                  <ButtonCopy className="text-xs" />
                </div>

                {/* ExpandableCards Component */}
                <div className="bg-primary col-span-2 rounded-lg border p-4">
                  <ExpandableCards className="text-xs" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
