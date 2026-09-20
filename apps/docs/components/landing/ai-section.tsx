"use client";

import {
  ApiDrawing,
  LlmsDrawing,
  McpDrawing,
} from "@docs/components/illustrations/ai-drawings";
import { VividLeadCard } from "@docs/components/illustrations/illustration-card";
import { ArtworkPattern } from "@docs/components/landing/artwork-pattern";
import Divider from "@docs/components/landing/divider";
import { SectionHeader } from "@docs/components/landing/section-header";
import { Button } from "@docs/components/smoothbutton";
import { landingBackgrounds } from "@docs/lib/landing-backgrounds";
import { cn } from "@repo/shadcn-ui/lib/utils";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { IconArrowRightFill24 } from "nucleo-core-fill-24";
import { useState } from "react";

const aiFeatures = [
  {
    description:
      "The shadcn MCP server works out of the box. AI assistants discover, search, and install any component.",
    title: "AI agents, meet your components",
  },
  {
    description:
      "Public API with search, suggest, and source code retrieval. No auth required. OpenAPI spec included.",
    title: "Programmatic access to everything",
  },
  {
    description:
      "Structured component data for LLM context windows and RAG pipelines. JSON and plain text formats.",
    title: "Machine-readable catalog",
  },
] as const;

const cardBase =
  "group relative flex flex-col rounded-2xl border bg-primary/40 p-6 transition-colors hover:bg-primary";

export function AISection() {
  const shouldReduceMotion = useReducedMotion();
  const [mcpActive, setMcpActive] = useState(false);
  const [apiActive, setApiActive] = useState(false);
  const [llmsActive, setLlmsActive] = useState(false);

  return (
    <section className="relative bg-background px-8 py-40 transition">
      <Divider />
      <div className="mx-auto w-full max-w-7xl">
        <SectionHeader
          description="The first component library designed for AI agents. Discover, search, and install components programmatically."
          title="Built for AI-assisted development"
        />

        <div className="mt-16 grid w-full gap-4 md:grid-cols-2 lg:grid-cols-2 lg:items-start">
          <VividLeadCard
            background={
              <Image
                alt=""
                aria-hidden
                className="object-cover motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-105 motion-safe:group-focus-within:scale-105"
                data-landing-background="ai"
                draggable={false}
                fill
                sizes="(max-width: 768px) 100vw, 420px"
                src={`${landingBackgrounds.ai.src}?tr=w-1280,f-auto`}
                unoptimized
              />
            }
            caption={
              <>
                <h3 className="font-semibold text-lg tracking-tight">
                  {aiFeatures[0].title}
                </h3>
                <p className="mt-1.5 max-w-sm text-muted-foreground text-sm">
                  {aiFeatures[0].description}
                </p>
              </>
            }
            className="md:col-span-2 lg:col-span-1 lg:row-span-2 lg:self-stretch"
            onHoverEnd={() => setMcpActive(false)}
            onHoverStart={() => setMcpActive(true)}
            pattern={<ArtworkPattern variant="contours" />}
            stage="ai"
          >
            <McpDrawing active={mcpActive} />
          </VividLeadCard>

          <div
            className={cn(cardBase, "lg:col-span-1")}
            onBlur={() => setApiActive(false)}
            onFocus={() => setApiActive(true)}
            onMouseEnter={() => setApiActive(true)}
            onMouseLeave={() => setApiActive(false)}
          >
            <div className="mb-5 flex justify-center">
              <ApiDrawing active={apiActive} />
            </div>
            <h3 className="font-semibold text-foreground text-lg tracking-tight">
              {aiFeatures[1].title}
            </h3>
            <p className="mt-1.5 text-muted-foreground text-sm">
              {aiFeatures[1].description}
            </p>
          </div>

          <div
            className={cn(cardBase, "lg:col-span-1")}
            onBlur={() => setLlmsActive(false)}
            onFocus={() => setLlmsActive(true)}
            onMouseEnter={() => setLlmsActive(true)}
            onMouseLeave={() => setLlmsActive(false)}
          >
            <div className="mb-4 flex justify-center">
              <LlmsDrawing active={llmsActive} />
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
