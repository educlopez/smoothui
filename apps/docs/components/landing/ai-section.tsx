"use client";

import Divider from "@docs/components/landing/divider";
import { SectionHeader } from "@docs/components/landing/section-header";
import { cn } from "@repo/shadcn-ui/lib/utils";
import AgentAvatar from "@repo/smoothui/components/agent-avatar";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

function McpIllustration() {
  const shouldReduceMotion = useReducedMotion();

  const bubbleTransition = (delay: number) =>
    shouldReduceMotion
      ? { duration: 0 }
      : { type: "spring" as const, duration: 0.3, bounce: 0.1, delay };

  return (
    <div aria-hidden className="mx-auto max-w-56 self-end">
      <div className="space-y-2">
        <motion.div
          className="flex items-center gap-2"
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
          transition={bubbleTransition(0)}
          viewport={{ once: true, amount: 0.5 }}
          whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1 }}
        >
          <AgentAvatar
            animated
            className="rounded-full"
            seed="SmoothUI Agent"
            size={20}
          />
          <span className="text-foreground/60 text-sm">AI Agent</span>
        </motion.div>
        <motion.div
          className="w-fit rounded-2xl rounded-tl border border-border bg-background p-2.5 text-foreground/70 text-xs"
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
          className="ml-auto w-fit rounded-2xl rounded-tr border border-border bg-muted p-2.5 text-foreground/70 text-xs"
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
    <div aria-hidden className="self-end">
      <motion.div
        className="space-y-2.5 rounded-2xl border border-border bg-background p-4"
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
          <span className="font-mono text-foreground/50 text-xs">
            /api/v1/suggest
          </span>
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
    <div aria-hidden className="relative w-full select-none self-end">
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
          className="-mx-5 flex rounded-xl border border-border bg-background py-1 pr-4 pl-2 text-xs"
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
          <div className="relative mt-0.5 ml-7 inline-flex items-center gap-2 font-medium text-sm before:absolute before:inset-y-0 before:-left-[19px] before:my-auto before:size-[5px] before:rounded-full before:border before:border-foreground/40 before:bg-background before:ring before:ring-background">
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

const cardBase =
  "group relative flex flex-col rounded-2xl border bg-primary/40 p-6 transition-colors hover:bg-primary";

export function AISection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative bg-background px-8 py-40 transition">
      <Divider />
      <div className="mx-auto max-w-5xl">
        <SectionHeader
          description="The first component library designed for AI agents. Discover, search, and install components programmatically."
          eyebrow="AI-Native"
          title="Built for AI-assisted development"
        />

        <div className="mt-16 grid w-full gap-4 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
          {/* MCP — lead pillar: agent-chat mockup over a saturated blurred photo */}
          <div
            className={cn(
              cardBase,
              "relative overflow-hidden border-0 p-0 text-white md:col-span-2 lg:col-span-2 lg:row-span-2"
            )}
          >
            <Image
              alt=""
              aria-hidden
              className="object-cover"
              fill
              sizes="(max-width: 768px) 100vw, 420px"
              src="/blur/ai-mcp.jpg"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/20" />
            <div className="relative flex flex-1 items-center justify-center p-6">
              <div className="w-full max-w-xs rounded-2xl border border-white/30 bg-background/90 p-4 shadow-lg backdrop-blur-md">
                <McpIllustration />
              </div>
            </div>
            <div className="relative p-6">
              <h3 className="font-semibold text-lg tracking-tight drop-shadow-sm">
                {aiFeatures[0].title}
              </h3>
              <p className="mt-1.5 max-w-sm text-sm text-white/80">
                {aiFeatures[0].description}
              </p>
            </div>
          </div>

          {/* REST API — the endpoint response artifact */}
          <div className={cn(cardBase, "lg:col-span-2")}>
            <div className="mb-4 flex justify-center">
              <ApiIllustration />
            </div>
            <h3 className="font-semibold text-foreground text-lg tracking-tight">
              {aiFeatures[1].title}
            </h3>
            <p className="mt-1.5 text-muted-foreground text-sm">
              {aiFeatures[1].description}
            </p>
          </div>

          {/* llms.txt — the machine-readable catalog artifact */}
          <div className={cn(cardBase, "lg:col-span-2")}>
            <div className="mb-4">
              <LlmsIllustration />
            </div>
            <h3 className="font-semibold text-foreground text-lg tracking-tight">
              {aiFeatures[2].title}
            </h3>
            <p className="mt-1.5 text-muted-foreground text-sm">
              {aiFeatures[2].description}
            </p>
          </div>
        </div>

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
