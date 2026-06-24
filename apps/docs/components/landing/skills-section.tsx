"use client";

import Divider from "@docs/components/landing/divider";
import { useUiSound } from "@docs/components/sound-provider";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import {
  IconArrowUpRightFill24,
  IconCheckFill24,
  IconCopy2Fill24,
} from "nucleo-core-fill-24";
import { useState } from "react";

const INSTALL_CMD = "npx skills add educlopez/ui-craft";

export function SkillsSection() {
  const shouldReduceMotion = useReducedMotion();
  const [copied, setCopied] = useState(false);

  const playCopied = useUiSound("/sounds/celebration.wav", 0.35);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(INSTALL_CMD);
      setCopied(true);
      playCopied();
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard unavailable — no-op
    }
  };

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
        {/* Static: the install pill uses backdrop-filter, which a transformed
            or faded ancestor would disable mid-animation. So the card and the
            pill's wrapper never animate — only the inner text/icon do, and the
            pill reveals by animating its own blur value. */}
        <div className="relative isolate overflow-hidden rounded-3xl border border-border">
          {/* meadow background */}
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
              UI Craft · AI skill
            </motion.span>

            <motion.h2
              className="max-w-2xl text-balance font-semibold font-title text-3xl text-white tracking-tight md:text-5xl"
              {...lift(0.15)}
            >
              Design taste for your AI agent
            </motion.h2>

            <motion.p
              className="max-w-xl text-balance text-white/85"
              {...lift(0.2)}
            >
              Same prompt. Same model. Different result — UI Craft gives your
              coding agent the design intuition it&apos;s missing.
            </motion.p>

            <div className="mt-3 flex flex-col items-center gap-4">
              <motion.button
                aria-label="Copy install command"
                className="group flex items-center gap-3 rounded-xl border border-white/25 bg-white/10 py-2.5 pr-3 pl-4 transition-colors hover:border-white/40 hover:bg-white/15"
                initial={
                  shouldReduceMotion
                    ? { backdropFilter: "blur(12px)" }
                    : { backdropFilter: "blur(0px)" }
                }
                onClick={copy}
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : {
                        duration: 0.5,
                        delay: 0.3,
                        ease: [0.23, 1, 0.32, 1] as const,
                      }
                }
                type="button"
                viewport={{ once: true, amount: 0.3 }}
                whileInView={{ backdropFilter: "blur(12px)" }}
              >
                <code className="font-mono text-sm text-white">
                  {INSTALL_CMD}
                </code>
                <span className="relative flex size-4 items-center justify-center text-white/70 transition-colors group-hover:text-white">
                  <AnimatePresence initial={false} mode="wait">
                    {copied ? (
                      <motion.span
                        animate={
                          shouldReduceMotion
                            ? { opacity: 1 }
                            : { opacity: 1, scale: 1 }
                        }
                        initial={
                          shouldReduceMotion
                            ? { opacity: 1 }
                            : { opacity: 0, scale: 0.6 }
                        }
                        key="check"
                        transition={
                          shouldReduceMotion
                            ? { duration: 0 }
                            : { type: "spring", stiffness: 500, damping: 28 }
                        }
                      >
                        <IconCheckFill24 className="size-4 text-brand-lighter" />
                      </motion.span>
                    ) : (
                      <motion.span
                        animate={{ opacity: 1 }}
                        exit={
                          shouldReduceMotion
                            ? { opacity: 0, transition: { duration: 0 } }
                            : { opacity: 0, scale: 0.6 }
                        }
                        initial={{ opacity: 1 }}
                        key="copy"
                      >
                        <IconCopy2Fill24 className="size-4" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
                <span aria-live="polite" className="sr-only">
                  {copied ? "Copied to clipboard" : ""}
                </span>
              </motion.button>

              <Link
                className="group flex items-center gap-1.5 font-medium text-sm text-white/80 transition-colors hover:text-white"
                href="https://skills.smoothui.dev"
                rel="noopener noreferrer"
                target="_blank"
              >
                Explore UI Craft skill
                <IconArrowUpRightFill24
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  size={14}
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
