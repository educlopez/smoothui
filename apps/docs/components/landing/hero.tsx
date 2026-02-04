"use client";

import Divider from "@docs/components/landing/divider";
import { MotionLogo } from "@docs/components/landing/logos/motion-logo";
import { ReactLogo } from "@docs/components/landing/logos/react-logo";
import { ShadcnLogo } from "@docs/components/landing/logos/shadcn-logo";
import { TailwindLogo } from "@docs/components/landing/logos/tailwind-logo";
import { Button } from "@docs/components/smoothbutton";
import ExpandableCardsDemo from "@docs/examples/expandable-cards";
import AnimatedInput from "@repo/smoothui/components/animated-input";
import ButtonCopy from "@repo/smoothui/components/button-copy";
import ClipCornersButton from "@repo/smoothui/components/clip-corners-button";
import ScrambleHover from "@repo/smoothui/components/scramble-hover";
import SiriOrb from "@repo/smoothui/components/siri-orb";
import { ArrowUpRight, Terminal, User } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";

function AnnouncementBadge() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <Link
      className="group inline-flex max-w-full items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-full border bg-background px-3 py-0.5 font-medium text-foreground text-xs shadow-sm transition-all hover:shadow-md"
      href="/docs/guides/installation"
    >
      <div className="relative -ml-2.5 flex shrink-0 items-center gap-1 overflow-hidden truncate rounded-full bg-brand/10 px-2.5 py-1 text-brand text-xs">
        {!shouldReduceMotion && (
          <motion.div
            animate={{ x: ["-100%", "200%"] }}
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 3,
              ease: "easeInOut",
            }}
          />
        )}
        <Terminal className="size-3" />
        <span>New</span>
      </div>
      <div className="flex items-center gap-1 truncate py-1">
        <span>SmoothUI CLI is here</span>
        <ArrowUpRight
          aria-hidden="true"
          className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </div>
    </Link>
  );
}

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

export function Hero() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="bg-background transition">
      <div className="relative py-24 md:py-36">
        <Divider />
        <div className="mx-auto max-w-7xl px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            {/* Left side - Hero content */}
            <motion.div
              animate={
                shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }
              }
              className="space-y-8"
              initial={
                shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }
              }
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { duration: 0.35, ease: EASE_OUT_QUAD }
              }
            >
              {/* Announcement badge */}
              <AnnouncementBadge />

              {/* Main heading */}
              <h1 className="text-balance font-semibold text-4xl text-foreground md:text-5xl lg:text-6xl lg:leading-15 lg:tracking-tight">
                Animated React Components for shadcn/ui
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
              animate={
                shouldReduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 }
              }
              className="relative"
              initial={
                shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: 20 }
              }
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { duration: 0.35, delay: 0.2, ease: EASE_OUT_QUAD }
              }
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
                  <ExpandableCardsDemo />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
