"use client";

import Divider from "@docs/components/landing/divider";
import { UiCraftInstallSelector } from "@docs/components/landing/ui-craft-install-selector";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { IconArrowUpRightFill24 } from "nucleo-core-fill-24";

export function SkillsSection() {
  const shouldReduceMotion = useReducedMotion();

  const lift = (delay: number) => ({
    initial: shouldReduceMotion
      ? { opacity: 1 }
      : { opacity: 0, transform: "translateY(16px)" },
    whileInView: shouldReduceMotion
      ? { opacity: 1 }
      : { opacity: 1, transform: "translateY(0px)" },
    transition: shouldReduceMotion
      ? { duration: 0 }
      : { type: "spring" as const, duration: 0.35, bounce: 0.1, delay },
    viewport: { once: true, amount: 0.3 },
  });

  return (
    <section className="relative bg-background px-8 py-32 transition">
      <Divider />
      <div className="mx-auto max-w-5xl">
        <div className="relative isolate overflow-hidden rounded-3xl border border-border">
          <Image
            alt=""
            aria-hidden
            className="-z-10 object-cover"
            draggable={false}
            fill
            sizes="(max-width: 1024px) 100vw, 960px"
            src="/scenes/skill-meadow.webp"
          />
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-gradient-to-b from-black/45 via-black/30 to-black/60"
          />

          <div className="flex flex-col items-center gap-5 px-6 py-20 text-center md:py-28">
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
              className="font-medium text-[11px] text-white/75 uppercase tracking-[0.18em]"
              {...lift(0.1)}
            >
              UI Craft
            </motion.span>

            <motion.h2
              className="max-w-2xl text-balance font-semibold font-title text-3xl text-white tracking-tight md:text-5xl"
              {...lift(0.15)}
            >
              The system behind design taste
            </motion.h2>

            <motion.p
              className="max-w-xl text-balance text-white/85"
              {...lift(0.2)}
            >
              Anti-slop detection, a scored quality gate, and a convergence loop
              — so your agent ships UI you&apos;d actually put in production.
            </motion.p>

            <motion.div className="mt-3" {...lift(0.25)}>
              <UiCraftInstallSelector />
            </motion.div>

            <motion.div {...lift(0.3)}>
              <Link
                className="group mt-2 flex items-center gap-1.5 font-medium text-sm text-white/80 transition-colors hover:text-white"
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
      </div>
    </section>
  );
}
