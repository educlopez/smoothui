"use client";

import Divider from "@docs/components/landing/divider";
import { SectionHeader } from "@docs/components/landing/section-header";
import { ArrowUpRight, Eye, Search, Sparkles, Wand2 } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

const modes = [
  { icon: Wand2, label: "Build", description: "Scaffold with taste" },
  { icon: Sparkles, label: "Animate", description: "Motion that feels right" },
  { icon: Eye, label: "Review", description: "Catch what AI misses" },
  { icon: Search, label: "Polish", description: "Pixel-perfect details" },
];

export function SkillsSection() {
  const shouldReduceMotion = useReducedMotion();

  const springTransition = (delay: number) =>
    shouldReduceMotion
      ? { duration: 0 }
      : { type: "spring" as const, duration: 0.3, bounce: 0.1, delay };

  return (
    <section className="relative bg-background px-8 py-24 transition">
      <Divider />
      <div className="mx-auto max-w-5xl">
        <SectionHeader
          description="Same prompt. Same model. Different result. UI Craft gives your coding agent the design intuition it's missing."
          eyebrow="Skills"
          title="Design taste for your AI agent"
        />

        <motion.div
          className="frame-box relative mx-auto mt-16 overflow-hidden rounded-2xl"
          initial={
            shouldReduceMotion
              ? { opacity: 1 }
              : { opacity: 0, transform: "translateY(16px) scale(0.98)" }
          }
          transition={springTransition(0.15)}
          viewport={{ once: true, amount: 0.2 }}
          whileInView={
            shouldReduceMotion
              ? { opacity: 1 }
              : { opacity: 1, transform: "translateY(0px) scale(1)" }
          }
        >
          <div className="grid gap-8 p-8 md:grid-cols-2 md:gap-12 md:p-12">
            {/* Logo side */}
            <motion.div
              className="flex flex-col items-center justify-center gap-6"
              initial={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { opacity: 0, transform: "scale(0.95)" }
              }
              transition={springTransition(0.25)}
              viewport={{ once: true, amount: 0.3 }}
              whileInView={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { opacity: 1, transform: "scale(1)" }
              }
            >
              <Image
                alt="UI Craft — Design taste for AI coding agents"
                className="size-28 rounded-3xl shadow shadow-black/10 ring-1 ring-border"
                height={112}
                src="/icon-ui-craft.png"
                width={112}
              />
              <div className="text-center">
                <p className="font-semibold text-foreground text-lg">
                  UI Craft
                </p>
                <p className="mt-1 text-primary-foreground text-sm">
                  Design taste for AI coding agents
                </p>
              </div>
            </motion.div>

            {/* Info side */}
            <div className="flex flex-col justify-center gap-6">
              {/* 4 modes */}
              <motion.div
                className="grid grid-cols-2 gap-3"
                initial={
                  shouldReduceMotion
                    ? { opacity: 1 }
                    : { opacity: 0, transform: "translateY(8px)" }
                }
                transition={springTransition(0.3)}
                viewport={{ once: true, amount: 0.3 }}
                whileInView={
                  shouldReduceMotion
                    ? { opacity: 1 }
                    : { opacity: 1, transform: "translateY(0px)" }
                }
              >
                {modes.map((mode) => (
                  <div
                    className="flex items-center gap-2.5 rounded-xl border border-border bg-background p-3"
                    key={mode.label}
                  >
                    <mode.icon className="size-4 shrink-0 text-brand" />
                    <div>
                      <p className="font-medium text-foreground text-sm leading-tight">
                        {mode.label}
                      </p>
                      <p className="text-primary-foreground text-xs leading-tight">
                        {mode.description}
                      </p>
                    </div>
                  </div>
                ))}
              </motion.div>

              {/* Install command */}
              <motion.div
                className="overflow-hidden rounded-xl border border-border bg-background p-4"
                initial={
                  shouldReduceMotion
                    ? { opacity: 1 }
                    : { opacity: 0, transform: "translateY(8px)" }
                }
                transition={springTransition(0.35)}
                viewport={{ once: true, amount: 0.3 }}
                whileInView={
                  shouldReduceMotion
                    ? { opacity: 1 }
                    : { opacity: 1, transform: "translateY(0px)" }
                }
              >
                <p className="mb-2 text-primary-foreground text-xs">
                  Install with one command
                </p>
                <code className="block font-mono text-foreground text-sm">
                  npx skills add educlopez/ui-craft
                </code>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="mt-8 flex justify-center"
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
          transition={springTransition(0.5)}
          viewport={{ once: true, amount: 0.5 }}
          whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1 }}
        >
          <Link
            className="group flex items-center gap-2 font-medium text-brand text-sm transition-colors hover:text-foreground"
            href="https://skills.smoothui.dev"
            rel="noopener noreferrer"
            target="_blank"
          >
            Explore UI Craft skill
            <ArrowUpRight
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              size={14}
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
