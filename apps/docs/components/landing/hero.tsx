"use client";

import Divider from "@docs/components/landing/divider";
import { HeroMaterial } from "@docs/components/landing/hero-material";
import { GsapLogo } from "@docs/components/landing/logos/gsap-logo";
import { MotionLogo } from "@docs/components/landing/logos/motion-logo";
import { ReactLogo } from "@docs/components/landing/logos/react-logo";
import { ShadcnLogo } from "@docs/components/landing/logos/shadcn-logo";
import { TailwindLogo } from "@docs/components/landing/logos/tailwind-logo";
import { Button } from "@docs/components/smoothbutton";
import { useUiSound } from "@docs/components/sound-provider";
import { COMPONENT_COUNT } from "@docs/lib/generated/counts";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@repo/shadcn-ui/components/ui/tooltip";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { IconCheckFill24, IconCopy2Fill24 } from "nucleo-core-fill-24";
import { useState } from "react";

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

const INSTALL_COMMAND = "npx shadcn@latest add @smoothui/dynamic-island";

export function Hero() {
  const shouldReduceMotion = useReducedMotion();
  const playClick = useUiSound("/sounds/button.wav", 0.4);
  const [installCopied, setInstallCopied] = useState(false);

  const copyInstall = async () => {
    try {
      await navigator.clipboard.writeText(INSTALL_COMMAND);
      setInstallCopied(true);
      playClick();
      setTimeout(() => setInstallCopied(false), 1600);
    } catch {
      // clipboard unavailable — no-op
    }
  };

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
              className="flex max-w-xl flex-col"
              initial={
                shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }
              }
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { duration: 0.35, ease: EASE_OUT_QUAD }
              }
            >
              {/* Primary message */}
              <div className="flex flex-col gap-5">
                <h1 className="text-balance font-semibold font-title text-4xl text-foreground tracking-tight md:text-5xl lg:text-6xl lg:leading-[1.1]">
                  <span className="block">React components.</span>
                  <span className="block text-muted-foreground">
                    Made to move.
                  </span>
                </h1>

                <p className="max-w-lg text-balance text-foreground/70 text-lg leading-relaxed md:text-xl">
                  {COMPONENT_COUNT} animated components to make every
                  interaction feel considered. Copy the code, make it yours.
                  Built for React and shadcn/ui.
                </p>
              </div>

              {/* Actions */}
              <div className="mt-10 flex flex-col gap-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                  <Button
                    asChild
                    onClick={() => playClick()}
                    size="sm"
                    variant="candy"
                  >
                    <Link href="/docs/components">Browse components</Link>
                  </Button>
                  <Button
                    asChild
                    onClick={() => playClick()}
                    size="sm"
                    variant="outline"
                  >
                    <Link href="/docs/guides">Read the docs</Link>
                  </Button>
                </div>

                <button
                  aria-label="Copy install command"
                  className="group flex w-fit max-w-full cursor-pointer items-center gap-2.5 rounded-lg border border-border bg-background px-3 py-2 font-mono text-foreground/80 text-sm transition-colors hover:border-brand/40"
                  onClick={copyInstall}
                  type="button"
                >
                  <span
                    aria-hidden
                    className="select-none text-muted-foreground"
                  >
                    $
                  </span>
                  <span className="truncate">{INSTALL_COMMAND}</span>
                  <span className="shrink-0 text-muted-foreground transition-colors group-hover:text-foreground">
                    {installCopied ? (
                      <IconCheckFill24 className="size-4 text-brand" />
                    ) : (
                      <IconCopy2Fill24 className="size-4" />
                    )}
                  </span>
                  <span aria-live="polite" className="sr-only">
                    {installCopied ? "Copied to clipboard" : ""}
                  </span>
                </button>
              </div>

              {/* Trust — Vercel OSS + stack */}
              <div className="mt-12 flex flex-col gap-5 border-border/60 border-t pt-8">
                <a
                  className="w-fit opacity-80 transition-opacity hover:opacity-100"
                  href="https://vercel.com/oss"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <img
                    alt="Vercel Open Source Software Program"
                    draggable={false}
                    height={24}
                    src="/vercel-oss-badge.svg"
                    width={240}
                  />
                </a>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                  {[
                    { className: "size-6", icon: ReactLogo, name: "React" },
                    {
                      className: "h-5 w-auto",
                      icon: TailwindLogo,
                      name: "Tailwind CSS",
                    },
                    {
                      className: "size-6",
                      icon: ShadcnLogo,
                      name: "shadcn/ui",
                    },
                    {
                      className: "h-4 w-auto",
                      icon: MotionLogo,
                      name: "Motion",
                    },
                    { className: "h-4 w-auto", icon: GsapLogo, name: "GSAP" },
                  ].map((tech) => (
                    <Tooltip key={tech.name}>
                      <TooltipTrigger asChild>
                        <span className="cursor-default text-smooth-700 transition-colors hover:text-brand">
                          <tech.icon className={tech.className} />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" sideOffset={8}>
                        {tech.name}
                      </TooltipContent>
                    </Tooltip>
                  ))}
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
                  : { delay: 0.2, duration: 0.35, ease: EASE_OUT_QUAD }
              }
            >
              <HeroMaterial />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
