"use client";

import { ArtworkPattern } from "@docs/components/landing/artwork-pattern";
import Divider from "@docs/components/landing/divider";
import { SectionHeader } from "@docs/components/landing/section-header";
import { Button } from "@docs/components/smoothbutton";
import { landingBackgrounds } from "@docs/lib/landing-backgrounds";
import { cn } from "@repo/shadcn-ui/lib/utils";
import { Braces, CornerDownLeft, FileCode, Search } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { IconArrowRightFill24 } from "nucleo-core-fill-24";
import { useState } from "react";
import { BentoSegments } from "./bento-controls";

const DEMO_STEPS = [
  "Search the registry",
  "Resolve dependencies",
  "Prepare install command",
];

function McpIllustration() {
  const [step, setStep] = useState(0);
  const reduced = useReducedMotion();
  return (
    <div className="w-full space-y-3">
      <span className="block text-[10px] text-muted-foreground uppercase tracking-wider">
        Workflow preview
      </span>
      <div className="rounded-xl border border-border bg-background p-3">
        {DEMO_STEPS.map((label, index) => (
          <motion.button
            aria-pressed={index === step}
            onClick={() => setStep(index)}
            onPointerEnter={() => setStep(index)}
            onFocus={() => setStep(index)}
            type="button"
            className={`flex min-h-12 w-full items-center gap-3 rounded px-2 py-3 text-left text-sm focus-visible:outline-2 focus-visible:outline-ring ${index === step ? "bg-muted text-foreground" : "text-muted-foreground"}`}
            key={label}
            animate={{ x: index === step && !reduced ? 4 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <span className="flex size-6 shrink-0 items-center justify-center rounded-lg border border-border bg-background font-mono">
              {index < step ? "✓" : index + 1}
            </span>
            {label}
          </motion.button>
        ))}
      </div>

      <p className="text-[10px] text-muted-foreground">
        Illustration only. No command is run.
      </p>
    </div>
  );
}

const SAMPLE_RESULTS = {
  interaction: ["animated-toggle", "number-flow"],
  navigation: ["animated-tabs", "dynamic-island"],
};
function ApiIllustration() {
  const [query, setQuery] = useState<keyof typeof SAMPLE_RESULTS>("navigation");
  const reduced = useReducedMotion();
  return (
    <div className="w-full min-w-0 rounded-xl border border-border/70 bg-muted/50 p-4 shadow-[inset_0_1px_3px_#00000004]">
      <div className="mx-auto overflow-hidden rounded-xl border border-border bg-background shadow-[0_2px_3px_#00000004,0_12px_22px_-10px_#00000020]">
        <div className="flex items-center gap-2 border-b px-3 py-3">
          <Search size={14} className="text-muted-foreground" />
          <span className="flex-1 text-xs">Find a component</span>
          <span className="rounded border px-1 text-[9px] text-muted-foreground">
            API sample
          </span>
        </div>
        <div className="p-2">
          <BentoSegments
            options={["navigation", "interaction"]}
            value={query}
            onChange={(value) => setQuery(value as keyof typeof SAMPLE_RESULTS)}
            label="Example search query"
          />
        </div>
        <div className="space-y-1 px-2 pb-2">
          {SAMPLE_RESULTS[query].map((name, index) => (
            <motion.div
              key={name}
              initial={{ opacity: reduced ? 1 : 0.6, y: reduced ? 0 : 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: reduced ? 0 : index * 0.035,
                duration: reduced ? 0 : 0.18,
              }}
              className={`flex items-center gap-3 rounded-lg px-2 py-2.5 ${index === 0 ? "bg-muted/60" : ""}`}
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border/80 bg-background shadow-sm">
                <Braces size={14} />
              </span>
              <div className="flex-1">
                <p className="font-mono text-[11px]">{name}</p>
                <p className="mt-0.5 text-[10px] text-muted-foreground">
                  React component · {query}
                </p>
              </div>
              {index === 0 ? (
                <span className="size-1.5 rounded-full bg-brand" />
              ) : null}
            </motion.div>
          ))}
        </div>
        <div className="flex justify-between border-t bg-muted/20 px-3 py-2 text-[9px] text-muted-foreground">
          <span>2 matching components</span>
          <span>GET /suggest</span>
        </div>
      </div>
    </div>
  );
}

function LlmsIllustration() {
  const [catalog, setCatalog] = useState<"components" | "blocks">("components");
  return (
    <div className="rounded-xl border border-border/70 bg-muted/50 p-4 shadow-[inset_0_1px_3px_#00000004]">
      <div className="rounded-xl border border-border bg-background p-3 shadow-[0_2px_3px_#00000004,0_12px_22px_-10px_#00000015]">
        <div className="mb-3 flex items-center gap-2">
          <FileCode size={14} />
          <span className="flex-1 font-mono text-xs">llms.txt</span>
          <span className="size-1.5 rounded-full bg-brand" />
        </div>
        <BentoSegments
          options={["components", "blocks"]}
          value={catalog}
          onChange={(value) => setCatalog(value as "components" | "blocks")}
          label="Catalog preview"
        />
        <div className="mt-3 space-y-2 border-border border-l pl-3">
          {(catalog === "components"
            ? ["animated-tabs", "phototab"]
            : ["hero", "pricing"]
          ).map((name) => (
            <div
              key={name}
              className="flex items-center gap-2 font-mono text-[11px]"
            >
              <CornerDownLeft
                size={11}
                className="rotate-180 text-muted-foreground"
              />
              {name}
              <span className="ml-auto text-[9px] text-muted-foreground">
                .tsx
              </span>
            </div>
          ))}
        </div>
        <p className="mt-3 border-t pt-2 text-[9px] text-muted-foreground">
          Typed source · dependencies · usage
        </p>
      </div>
    </div>
  );
}

const aiFeatures = [
  {
    description:
      "The shadcn MCP server works out of the box. AI assistants discover, search, and install any component.",
    illustration: McpIllustration,
    label: "MCP Server",
    title: "AI agents, meet your components",
  },
  {
    description:
      "Public API with search, suggest, and source code retrieval. No auth required. OpenAPI spec included.",
    illustration: ApiIllustration,
    label: "REST API",
    title: "Programmatic access to everything",
  },
  {
    description:
      "Structured component data for LLM context windows and RAG pipelines. JSON and plain text formats.",
    illustration: LlmsIllustration,
    label: "llms.txt",
    title: "Machine-readable catalog",
  },
];

const cardBase =
  "group relative flex flex-col rounded-2xl border bg-primary/40 p-6 transition-colors hover:bg-primary";

export function AISection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative bg-background px-8 py-40 transition">
      <Divider />
      <div className="mx-auto w-full max-w-7xl">
        <SectionHeader
          description="The first component library designed for AI agents. Discover, search, and install components programmatically."
          title="Built for AI-assisted development"
        />

        <div className="mt-16 grid w-full gap-4 md:grid-cols-2 lg:grid-cols-2 lg:items-start">
          {/* MCP — lead pillar: agent-chat mockup over a saturated blurred artwork */}
          <div
            className={cn(
              cardBase,
              "relative overflow-hidden p-0 md:col-span-2 lg:col-span-1 lg:row-span-2 lg:self-stretch"
            )}
          >
            <div
              className="relative flex min-h-72 flex-1 items-center justify-center overflow-hidden"
              data-vivid-stage="ai"
            >
              <Image
                alt=""
                aria-hidden
                className="object-cover motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-105 motion-safe:group-focus-within:scale-105"
                draggable={false}
                fill
                sizes="(max-width: 768px) 100vw, 420px"
                data-landing-background="ai"
                src={`${landingBackgrounds.ai.src}?tr=w-1280,f-auto`}
                unoptimized
              />
              <ArtworkPattern variant="contours" />
              <div className="relative flex w-full items-center justify-center p-6">
                <div className="w-full max-w-[420px] rounded-2xl border border-border bg-background p-5 text-foreground shadow-xl md:w-3/4 md:p-6">
                  <McpIllustration />
                </div>
              </div>
            </div>
            <div
              className="relative border-t bg-background p-6 text-foreground"
              data-lead-caption="ai"
            >
              <h3 className="font-semibold text-lg tracking-tight">
                {aiFeatures[0].title}
              </h3>
              <p className="mt-1.5 max-w-sm text-muted-foreground text-sm">
                {aiFeatures[0].description}
              </p>
            </div>
          </div>

          {/* REST API — the endpoint response artifact */}
          <div className={cn(cardBase, "lg:col-span-1")}>
            <div className="mb-5 flex justify-center">
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
          <div className={cn(cardBase, "lg:col-span-1")}>
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
              : { bounce: 0.1, delay: 0.5, duration: 0.25, type: "spring" }
          }
          viewport={{ amount: 0.5, once: true }}
          whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1 }}
        >
          <Button
            asChild
            className="group"
            color="accent"
            size="sm"
            variant="ghost"
          >
            <Link href="/docs/guides/ai-integration">
              Learn more about AI integration
              <IconArrowRightFill24
                className="transition-transform group-hover:translate-x-1"
                size={14}
              />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
