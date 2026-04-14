"use client";

import Divider from "@docs/components/landing/divider";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";

function McpIllustration() {
  const shouldReduceMotion = useReducedMotion();

  const bubbleTransition = (delay: number) =>
    shouldReduceMotion
      ? { duration: 0 }
      : { type: "spring" as const, duration: 0.3, bounce: 0.1, delay };

  return (
    <div aria-hidden className="mx-auto max-w-56 self-center">
      <div className="space-y-2">
        <motion.div
          className="flex items-center gap-2"
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
          transition={bubbleTransition(0)}
          viewport={{ once: true, amount: 0.5 }}
          whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1 }}
        >
          <div className="size-4 rounded-full bg-brand/20 ring-1 ring-brand/30" />
          <span className="text-foreground/60 text-sm">AI Agent</span>
        </motion.div>
        <motion.div
          className="w-fit rounded-2xl rounded-tl border border-transparent bg-primary/60 p-2.5 text-foreground/70 text-xs shadow shadow-black/10 ring-1 ring-border"
          initial={
            shouldReduceMotion
              ? { opacity: 1 }
              : { opacity: 0, transform: "translateY(8px)" }
          }
          transition={bubbleTransition(0.1)}
          viewport={{ once: true, amount: 0.5 }}
          whileInView={
            shouldReduceMotion
              ? { opacity: 1 }
              : { opacity: 1, transform: "translateY(0px)" }
          }
        >
          Install the <span className="text-brand">SiriOrb</span> component from
          smoothui
        </motion.div>
        <motion.div
          className="ml-auto w-fit rounded-2xl rounded-tr border border-transparent bg-brand/10 p-2.5 text-foreground/70 text-xs shadow shadow-black/10 ring-1 ring-brand/20"
          initial={
            shouldReduceMotion
              ? { opacity: 1 }
              : { opacity: 0, transform: "translateY(8px)" }
          }
          transition={bubbleTransition(0.25)}
          viewport={{ once: true, amount: 0.5 }}
          whileInView={
            shouldReduceMotion
              ? { opacity: 1 }
              : { opacity: 1, transform: "translateY(0px)" }
          }
        >
          <code className="font-mono text-[11px]">
            npx shadcn@latest add @smoothui/siri-orb
          </code>
        </motion.div>
      </div>
    </div>
  );
}

function ApiIllustration() {
  const shouldReduceMotion = useReducedMotion();

  const lineTransition = (delay: number) =>
    shouldReduceMotion
      ? { duration: 0 }
      : { type: "spring" as const, duration: 0.25, bounce: 0.1, delay };

  return (
    <div aria-hidden className="self-center">
      <motion.div
        className="space-y-2.5 rounded-2xl border border-transparent bg-primary/60 p-4 shadow shadow-black/10 ring-1 ring-border"
        initial={
          shouldReduceMotion
            ? { opacity: 1 }
            : { opacity: 0, transform: "scale(0.96)" }
        }
        transition={lineTransition(0.05)}
        viewport={{ once: true, amount: 0.5 }}
        whileInView={
          shouldReduceMotion
            ? { opacity: 1 }
            : { opacity: 1, transform: "scale(1)" }
        }
      >
        <div className="flex justify-between text-sm">
          <span className="text-foreground/50">GET</span>
          <span className="font-mono text-brand text-xs">/api/v1/suggest</span>
        </div>
        <div className="h-px bg-border" />
        <div className="space-y-1.5 font-mono text-xs">
          {[
            {
              text: '{ "results": [',
              className: "text-foreground/40",
              delay: 0.15,
            },
            {
              text: (
                <>
                  {"{"} &quot;name&quot;: &quot;
                  <span className="text-brand">animated-tabs</span>&quot;,
                </>
              ),
              className: "pl-4 text-foreground/60",
              delay: 0.25,
            },
            {
              text: '"score": 0.95 }',
              className: "pl-6 text-foreground/40",
              delay: 0.35,
            },
            { text: "] }", className: "text-foreground/40", delay: 0.4 },
          ].map((line, i) => (
            <motion.div
              className={line.className}
              initial={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { opacity: 0, transform: "translateX(-6px)" }
              }
              key={i}
              transition={lineTransition(line.delay)}
              viewport={{ once: true, amount: 0.5 }}
              whileInView={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { opacity: 1, transform: "translateX(0px)" }
              }
            >
              {line.text}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function LlmsIllustration() {
  const shouldReduceMotion = useReducedMotion();

  const itemTransition = (delay: number) =>
    shouldReduceMotion
      ? { duration: 0 }
      : { type: "spring" as const, duration: 0.25, bounce: 0.1, delay };

  return (
    <div aria-hidden className="relative w-full select-none self-center">
      <div className="relative w-full space-y-2 py-4">
        <motion.div
          className="absolute inset-y-0 left-0 w-px bg-[length:1px_4px] bg-repeat-y opacity-25 [background-image:linear-gradient(180deg,var(--color-foreground)_1px,transparent_1px)]"
          initial={
            shouldReduceMotion
              ? { opacity: 0.25 }
              : { opacity: 0, transform: "scaleY(0)" }
          }
          style={{ transformOrigin: "top" }}
          transition={itemTransition(0)}
          viewport={{ once: true, amount: 0.5 }}
          whileInView={
            shouldReduceMotion
              ? { opacity: 0.25 }
              : { opacity: 0.25, transform: "scaleY(1)" }
          }
        />
        <motion.div
          className="pl-5"
          initial={
            shouldReduceMotion
              ? { opacity: 1 }
              : { opacity: 0, transform: "translateX(-8px)" }
          }
          transition={itemTransition(0.1)}
          viewport={{ once: true, amount: 0.5 }}
          whileInView={
            shouldReduceMotion
              ? { opacity: 1 }
              : { opacity: 1, transform: "translateX(0px)" }
          }
        >
          <div className="relative mt-0.5 inline-flex items-center gap-2 font-medium text-foreground text-sm before:absolute before:inset-y-0 before:-left-[22px] before:my-auto before:size-[5px] before:rounded-full before:border before:border-foreground/40 before:bg-background before:ring before:ring-background">
            <span className="text-foreground/40 text-xs">57</span>
            Components
          </div>
        </motion.div>
        <motion.div
          className="-mx-5 flex rounded-xl border border-transparent bg-primary/60 py-1 pr-4 pl-2 text-xs shadow shadow-black/10 ring-1 ring-border"
          initial={
            shouldReduceMotion
              ? { opacity: 1 }
              : { opacity: 0, transform: "translateX(-8px)" }
          }
          transition={itemTransition(0.2)}
          viewport={{ once: true, amount: 0.5 }}
          whileInView={
            shouldReduceMotion
              ? { opacity: 1 }
              : { opacity: 1, transform: "translateX(0px)" }
          }
        >
          <div className="relative mt-0.5 ml-7 inline-flex items-center gap-2 font-medium text-sm before:absolute before:inset-y-0 before:-left-[19px] before:my-auto before:size-[5px] before:rounded-full before:border before:border-brand before:bg-background before:ring before:ring-background">
            <span className="text-brand">tags</span>
            <span className="text-foreground/40">categories</span>
            <span className="text-foreground/40">useCases</span>
          </div>
        </motion.div>
        <motion.div
          className="pl-5"
          initial={
            shouldReduceMotion
              ? { opacity: 1 }
              : { opacity: 0, transform: "translateX(-8px)" }
          }
          transition={itemTransition(0.3)}
          viewport={{ once: true, amount: 0.5 }}
          whileInView={
            shouldReduceMotion
              ? { opacity: 1 }
              : { opacity: 1, transform: "translateX(0px)" }
          }
        >
          <div className="relative mt-0.5 inline-flex items-center gap-2 font-medium text-foreground text-sm before:absolute before:inset-y-0 before:-left-[22px] before:my-auto before:size-[5px] before:rounded-full before:border before:border-foreground/40 before:bg-background before:ring before:ring-background">
            <span className="text-foreground/40 text-xs">27</span>
            Blocks
          </div>
        </motion.div>
      </div>
    </div>
  );
}

const aiFeatures = [
  {
    label: "MCP Server",
    illustration: McpIllustration,
    title: "AI agents, meet your components",
    description:
      "The shadcn MCP server works out of the box. AI assistants discover, search, and install any component.",
  },
  {
    label: "REST API",
    illustration: ApiIllustration,
    title: "Programmatic access to everything",
    description:
      "Public API with search, suggest, and source code retrieval. No auth required. OpenAPI spec included.",
  },
  {
    label: "llms.txt",
    illustration: LlmsIllustration,
    title: "Machine-readable catalog",
    description:
      "Structured component data for LLM context windows and RAG pipelines. JSON and plain text formats.",
  },
];

export function AISection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative bg-background px-8 py-24 transition">
      <Divider />
      <div className="mx-auto max-w-5xl">
        <motion.p
          className="mb-2 text-center font-medium text-brand text-sm uppercase tracking-wider"
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { type: "spring", duration: 0.3, bounce: 0.1 }
          }
          viewport={{ once: true, amount: 0.5 }}
          whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1 }}
        >
          AI-Native
        </motion.p>
        <motion.h2
          className="text-balance text-center font-semibold font-title text-3xl text-foreground transition"
          initial={
            shouldReduceMotion
              ? { opacity: 1 }
              : { opacity: 0, transform: "translateY(10px)" }
          }
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { type: "spring", duration: 0.3, bounce: 0.1, delay: 0.05 }
          }
          viewport={{ once: true, amount: 0.5 }}
          whileInView={
            shouldReduceMotion
              ? { opacity: 1 }
              : { opacity: 1, transform: "translateY(0px)" }
          }
        >
          Built for AI-Assisted Development
        </motion.h2>
        <motion.p
          className="mx-auto mt-4 max-w-2xl text-balance text-center text-primary-foreground transition"
          initial={
            shouldReduceMotion
              ? { opacity: 1 }
              : { opacity: 0, transform: "translateY(10px)" }
          }
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { type: "spring", duration: 0.3, bounce: 0.1, delay: 0.1 }
          }
          viewport={{ once: true, amount: 0.5 }}
          whileInView={
            shouldReduceMotion
              ? { opacity: 1 }
              : { opacity: 1, transform: "translateY(0px)" }
          }
        >
          The first component library designed for AI agents. Discover, search,
          and install components programmatically.
        </motion.p>

        <motion.div
          className="mx-auto mt-16 overflow-hidden rounded-2xl border border-transparent bg-primary/20 shadow-black/5 shadow-md ring-1 ring-border"
          initial={
            shouldReduceMotion
              ? { opacity: 1 }
              : { opacity: 0, transform: "translateY(16px) scale(0.98)" }
          }
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { type: "spring", duration: 0.4, bounce: 0.1, delay: 0.15 }
          }
          viewport={{ once: true, amount: 0.2 }}
          whileInView={
            shouldReduceMotion
              ? { opacity: 1 }
              : { opacity: 1, transform: "translateY(0px) scale(1)" }
          }
        >
          <div className="grid divide-y md:grid-cols-3 md:divide-x md:divide-y-0">
            {aiFeatures.map((feature, index) => (
              <motion.div
                className="row-span-2 grid grid-rows-subgrid gap-8 p-8"
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
                key={feature.label}
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : {
                        type: "spring",
                        duration: 0.25,
                        bounce: 0.1,
                        delay: 0.25 + index * 0.1,
                      }
                }
                viewport={{ once: true, amount: 0.2 }}
                whileInView={
                  shouldReduceMotion ? { opacity: 1 } : { opacity: 1 }
                }
              >
                <feature.illustration />
                <div className="relative z-10 mx-auto max-w-sm text-center">
                  <h3 className="text-balance font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-balance text-primary-foreground text-sm">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="mt-8 flex justify-center"
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { type: "spring", duration: 0.25, bounce: 0.1, delay: 0.5 }
          }
          viewport={{ once: true, amount: 0.5 }}
          whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1 }}
        >
          <Link
            className="group flex items-center gap-2 font-medium text-brand text-sm transition-colors hover:text-foreground"
            href="/docs/guides/ai-integration"
          >
            Learn more about AI integration
            <ArrowRight
              className="transition-transform group-hover:translate-x-1"
              size={14}
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
