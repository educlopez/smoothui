"use client";

import { HeroDither } from "@docs/components/landing/hero-dither";
import { UiCraftInstallSelector } from "@docs/components/landing/ui-craft-install-selector";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { IconArrowUpRightFill24 } from "nucleo-core-fill-24";
import { useEffect, useRef, useState } from "react";

/** Same pink dunes as the hero. */
const BACKGROUND_SRC = "/hero/pink-dunes.jpg";

export function SkillsSection() {
  const shouldReduceMotion = useReducedMotion();
  const bandRef = useRef<HTMLDivElement>(null);
  const [band, setBand] = useState({ height: 0, width: 0 });
  const [showPhoto, setShowPhoto] = useState(false);

  useEffect(() => {
    const node = bandRef.current;
    if (!node) {
      return;
    }
    const measure = () => {
      const box = node.getBoundingClientRect();
      setBand({
        height: Math.max(1, Math.round(box.height)),
        width: Math.max(1, Math.round(box.width)),
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const lift = (delay: number) => ({
    initial: shouldReduceMotion
      ? { opacity: 1 }
      : { opacity: 0, transform: "translateY(16px)" },
    transition: shouldReduceMotion
      ? { duration: 0 }
      : { bounce: 0.1, delay, duration: 0.35, type: "spring" as const },
    viewport: { amount: 0.3, once: true },
    whileInView: shouldReduceMotion
      ? { opacity: 1 }
      : { opacity: 1, transform: "translateY(0px)" },
  });

  return (
    <section className="relative overflow-hidden bg-background">
      <div
        aria-hidden
        className="mask-t-from-35% mask-t-to-65% mask-b-from-55% mask-b-to-75% dark:mask-t-to-55% pointer-events-none absolute inset-0"
        data-landing-background="uicraft"
        ref={bandRef}
      >
        {showPhoto ? (
          <img
            alt=""
            className="size-full object-cover object-bottom"
            height={1024}
            src={BACKGROUND_SRC}
            width={1024}
          />
        ) : null}
        {band.width > 1 ? (
          <HeroDither
            height={band.height}
            onFallback={() => setShowPhoto(true)}
            src={BACKGROUND_SRC}
            width={band.width}
          />
        ) : null}
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-center px-8 py-32 md:py-40">
        <div
          className="mx-auto flex w-full max-w-3xl flex-col items-center gap-5 rounded-2xl border border-border bg-background px-4 py-10 text-center shadow-xl md:px-8 md:py-12"
          data-uicraft-copy
        >
          <motion.div {...lift(0.05)}>
            <Image
              alt="UI Craft"
              className="size-14 rounded-2xl shadow-black/20 shadow-lg ring-1 ring-white/40"
              draggable={false}
              height={56}
              src="/icon-ui-craft.png"
              width={56}
            />
          </motion.div>

          <motion.span
            className="font-medium text-[11px] text-muted-foreground uppercase tracking-[0.18em]"
            {...lift(0.1)}
          >
            UI Craft
          </motion.span>

          <motion.h2
            className="max-w-2xl text-balance font-semibold font-title text-3xl text-foreground tracking-tight md:text-5xl"
            {...lift(0.15)}
          >
            The system behind design taste
          </motion.h2>

          <motion.p
            className="max-w-xl text-balance text-muted-foreground"
            {...lift(0.2)}
          >
            Anti-slop detection, a scored quality gate, and a convergence loop —
            so your agent ships UI you&apos;d actually put in production.
          </motion.p>

          <motion.div className="mt-3 w-full min-w-0" {...lift(0.25)}>
            <UiCraftInstallSelector className="w-full min-w-0" />
          </motion.div>

          <motion.div {...lift(0.3)}>
            <Link
              className="group mt-2 flex items-center gap-1.5 font-medium text-foreground/80 text-sm transition-colors hover:text-foreground"
              href="https://skills.smoothui.dev"
              rel="noopener noreferrer"
              target="_blank"
            >
              Explore UI Craft
              <IconArrowUpRightFill24
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                size={14}
              />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
