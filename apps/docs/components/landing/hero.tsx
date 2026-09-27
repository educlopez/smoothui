"use client";

import { HeroStage } from "@docs/components/landing/hero-stage";
import { Button } from "@docs/components/smoothbutton";
import { useUiSound } from "@docs/components/sound-provider";
import { COMPONENT_COUNT } from "@docs/lib/generated/counts";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { preload } from "react-dom";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

const BACKGROUND_SRC = "/hero/pink-dunes.jpg";

preload(BACKGROUND_SRC, { as: "image", fetchPriority: "high" });

export function Hero() {
  const shouldReduceMotion = useReducedMotion();
  const playClick = useUiSound("/sounds/button.wav", 0.4);

  return (
    <section className="relative overflow-hidden bg-background">
      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 pt-32 text-center md:pt-40">
        <motion.div
          animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          className="flex flex-col items-center"
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { duration: 0.35, ease: EASE_OUT }
          }
        >
          <h1 className="text-balance font-semibold font-title text-5xl text-foreground tracking-tight md:text-6xl lg:text-7xl lg:leading-[1.05]">
            React components.
            <span className="mt-1 block">Made to move.</span>
          </h1>

          <p className="mt-6 max-w-xl text-balance text-lg text-muted-foreground leading-relaxed md:text-xl">
            {COMPONENT_COUNT} animated components for React and shadcn/ui — copy
            the code and make it yours.
          </p>

          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
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

          <a
            className="mt-12 opacity-80 transition-opacity duration-150 hover:opacity-100"
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
        </motion.div>
      </div>

      <HeroStage src={BACKGROUND_SRC} />
    </section>
  );
}
