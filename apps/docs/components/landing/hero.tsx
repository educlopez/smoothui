"use client";

import Divider from "@docs/components/landing/divider";
import { MotionLogo } from "@docs/components/landing/logos/motion-logo";
import { ReactLogo } from "@docs/components/landing/logos/react-logo";
import { ShadcnLogo } from "@docs/components/landing/logos/shadcn-logo";
import { TailwindLogo } from "@docs/components/landing/logos/tailwind-logo";
import { Button } from "@docs/components/smoothbutton";
import AnimatedInput from "@repo/smoothui/components/animated-input";
import ButtonCopy from "@repo/smoothui/components/button-copy";
import ClipCornersButton from "@repo/smoothui/components/clip-corners-button";
import ExpandableCards, {
  type Card,
} from "@repo/smoothui/components/expandable-cards";
import ScrambleHover from "@repo/smoothui/components/scramble-hover";
import SiriOrb from "@repo/smoothui/components/siri-orb";
import { User } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

const EASE_OUT_QUAD_X1 = 0.25;
const EASE_OUT_QUAD_Y1 = 0.46;
const EASE_OUT_QUAD_X2 = 0.45;
const EASE_OUT_QUAD_Y2 = 0.94;
const EASE_OUT_QUAD = [
  EASE_OUT_QUAD_X1,
  EASE_OUT_QUAD_Y1,
  EASE_OUT_QUAD_X2,
  EASE_OUT_QUAD_Y2,
] as const;

const heroCards: Card[] = [
  {
    id: 1,
    title: "Component",
    content: "Beautiful UI components ready to use",
    image: "",
  },
  {
    id: 2,
    title: "Animation",
    content: "Smooth animations out of the box",
    image: "",
  },
];

export function Hero() {
  return (
    <section className="bg-background transition">
      <div className="relative py-24 md:py-36">
        <Divider />
        <div className="mx-auto max-w-7xl px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            {/* Left side - Hero content */}
            <motion.div
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="space-y-8"
              initial={{
                opacity: 0,
                y: 20,
              }}
              transition={{
                duration: 0.6,
                ease: EASE_OUT_QUAD,
              }}
            >
              {/* Main heading */}
              <h1 className="text-balance font-semibold text-4xl text-foreground md:text-5xl lg:text-6xl lg:leading-15 lg:tracking-tight">
                Super Smooth UI Components for Every Team
              </h1>

              {/* Description */}
              <p className="text-balance text-foreground/70 sm:text-lg md:text-xl">
                Highly customizable, production-ready UI blocks for building
                beautiful websites and apps that look and feel the way you mean
                it.
              </p>

              {/* CTA buttons */}
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button asChild size="sm" variant="candy">
                  <Link href="/docs/guides">Explore Docs</Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link href="/docs/components">Explore components</Link>
                </Button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="mt-14 hidden cursor-default items-center justify-start gap-3 font-medium text-primary-foreground text-xs uppercase tracking-widest transition sm:flex sm:justify-center">
                    <span className="group flex items-center gap-1.5">
                      <ReactLogo className="h-6 text-smooth-700 group-hover:text-brand" />
                      <span className="group-hover:text-brand">React</span>
                    </span>
                    <span className="group flex items-center gap-1.5">
                      <TailwindLogo className="h-5 text-smooth-700 group-hover:text-brand" />
                      <span className="group-hover:text-brand">
                        Tailwind CSS
                      </span>
                    </span>
                    <span className="group flex items-center gap-1.5">
                      <MotionLogo className="h-4 text-smooth-700 group-hover:text-brand" />
                      <span className="group-hover:text-brand">Motion</span>
                    </span>
                    <span className="group flex items-center gap-1.5">
                      <ShadcnLogo className="h-5 text-smooth-700 group-hover:text-brand" />
                      <span className="group-hover:text-brand">shadcn/ui</span>
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right side - SmoothUI Component showcase */}
            <motion.div
              animate={{
                opacity: 1,
                x: 0,
              }}
              className="relative"
              initial={{
                opacity: 0,
                x: 20,
              }}
              transition={{
                duration: 0.6,
                delay: 0.2,
                ease: EASE_OUT_QUAD,
              }}
            >
              <div className="grid grid-cols-2 gap-4">
                {/* SiriOrb Component */}
                <div className="frame-box relative col-span-2 flex justify-center rounded-lg p-6">
                  <SiriOrb
                    animationDuration={15}
                    className="drop-shadow-lg"
                    colors={{
                      bg: "var(--color-primary)",
                    }}
                    size="120px"
                  />
                </div>

                {/* AnimatedInput Component */}
                <div className="frame-box relative rounded-lg p-4">
                  <AnimatedInput
                    icon={<User size={16} strokeWidth={1.5} />}
                    label="Username"
                    placeholder="Enter username"
                  />
                </div>

                {/* ScrambleHover Component */}
                <div className="frame-box relative flex items-center justify-center rounded-lg p-4">
                  <ScrambleHover
                    className="z-10 font-medium text-sm"
                    duration={1200}
                    speed={50}
                  >
                    Hover to Scramble
                  </ScrambleHover>
                </div>

                {/* ClipCornersButton Component */}
                <div className="frame-box relative flex items-center justify-center rounded-lg p-4">
                  <ClipCornersButton className="px-4 py-2 text-xs">
                    Clip Corners
                  </ClipCornersButton>
                </div>

                {/* ButtonCopy Component */}
                <div className="frame-box relative flex items-center justify-center rounded-lg p-4">
                  <ButtonCopy className="text-xs" />
                </div>

                {/* ExpandableCards Component */}
                <div className="frame-box relative col-span-2 rounded-lg p-4">
                  <ExpandableCards cards={heroCards} className="text-xs" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
