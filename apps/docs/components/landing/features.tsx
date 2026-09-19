"use client";

import { ArtworkPattern } from "@docs/components/landing/artwork-pattern";
import Divider from "@docs/components/landing/divider";
import { ReactLogo } from "@docs/components/landing/logos/react-logo";
import { ShadcnLogo } from "@docs/components/landing/logos/shadcn-logo";
import { TailwindLogo } from "@docs/components/landing/logos/tailwind-logo";
import { SectionHeader } from "@docs/components/landing/section-header";
import { landingBackgrounds } from "@docs/lib/landing-backgrounds";
import { cn } from "@repo/shadcn-ui/lib/utils";
import { Package, Terminal } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ReactSettingsIllustration, TokenIllustration } from "./bento-controls";
import { CommandCopy } from "./command-copy";

const lead = {
  description:
    "Every component ships with motion built in — powered by Motion and GSAP, tuned for spring physics, and fully reduced-motion aware.",
  title: "Smooth animations",
};

const cardBase =
  "group relative flex flex-col rounded-2xl border bg-primary/40 p-6 transition-colors hover:bg-primary";

const SHOWCASE_ROW_A = [
  "Siri Orb",
  "Dynamic Island",
  "Number Flow",
  "Apple Invites",
  "Scramble Hover",
];

const SHOWCASE_ROW_B = [
  "Wave Text",
  "Grid Loader",
  "Social Selector",
  "Image Metadata",
  "Power Off Slide",
];

const Pill = ({ children }: { children: string }) => (
  <span className="flex shrink-0 items-center whitespace-nowrap rounded-full border border-border bg-background px-3 py-1.5 text-foreground/70 text-sm">
    {children}
  </span>
);

const CardHeading = ({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) => (
  <>
    <div className="flex items-center gap-2">
      <Icon className="size-4" />
      <h3 className="font-semibold text-foreground text-lg tracking-tight">
        {title}
      </h3>
    </div>
    <p className="mt-1.5 text-muted-foreground text-sm">{description}</p>
  </>
);

export function Features() {
  const [replay, setReplay] = useState(false);
  const reduced = useReducedMotion();
  return (
    <section className="relative bg-background px-8 py-24 transition">
      <Divider />
      <SectionHeader
        description="Built on the foundations you already love, with the polish you've been wishing for."
        title={
          <>
            Why choose Smooth<span className="text-brand">UI</span>?
          </>
        }
      />
      <div className="mt-16 grid w-full gap-4 md:grid-cols-2 lg:grid-cols-4 lg:items-start">
        {/* Lead — live component marquee over a saturated blurred artwork */}
        <motion.div
          onHoverStart={() => setReplay(true)}
          onHoverEnd={() => setReplay(false)}
          onFocusCapture={() => setReplay(true)}
          onBlurCapture={() => setReplay(false)}
          className={cn(
            cardBase,
            "relative overflow-hidden p-0 md:col-span-2 lg:col-span-2 lg:row-span-2 lg:self-stretch"
          )}
        >
          <div
            className="relative flex min-h-72 flex-1 items-center overflow-hidden"
            data-vivid-stage="features"
          >
            <Image
              alt=""
              aria-hidden
              className="object-cover motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-105 motion-safe:group-focus-within:scale-105"
              draggable={false}
              fill
              sizes="(max-width: 768px) 100vw, 420px"
              data-landing-background="features"
              src={`${landingBackgrounds.features.src}?tr=w-1280,f-auto`}
              unoptimized
            />
            <ArtworkPattern variant="squares" />
            <div
              className="relative mx-6 my-6 w-full max-w-[420px] overflow-hidden rounded-2xl border border-border bg-background text-foreground shadow-xl md:mx-auto md:w-3/4"
              data-motion-library
            >
              <div className="flex items-center gap-3 border-b px-5 py-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border bg-muted/50">
                  <Package aria-hidden size={17} />
                </span>
                <div className="min-w-0">
                  <p className="font-medium text-sm">Motion library</p>
                  <p className="mt-0.5 text-muted-foreground text-xs">
                    Small details. Better interactions.
                  </p>
                </div>
              </div>
              <div className="flex min-h-32 flex-col justify-center gap-3 bg-muted/20 py-6 [mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)]">
                <motion.div
                  className="flex gap-3"
                  key={`a-${replay}`}
                  initial={{ x: 0 }}
                  animate={{ x: replay && !reduced ? [0, -48, 0] : 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  {SHOWCASE_ROW_A.map((name) => (
                    <Pill key={name}>{name}</Pill>
                  ))}
                </motion.div>
                <motion.div
                  className="flex gap-3"
                  key={`b-${replay}`}
                  initial={{ x: 0 }}
                  animate={{ x: replay && !reduced ? [0, 32, 0] : 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  {SHOWCASE_ROW_B.map((name) => (
                    <Pill key={name}>{name}</Pill>
                  ))}
                </motion.div>
              </div>
              <div className="flex items-center gap-2 border-t px-5 py-3 text-muted-foreground text-xs">
                <span aria-hidden className="size-1.5 rounded-full bg-brand" />
                Spring-driven. Reduced-motion ready.
              </div>
            </div>
          </div>
          <div
            className="relative border-t bg-background p-6 text-foreground"
            data-feature-copy
            data-lead-caption="features"
          >
            <h3 className="mb-2 font-semibold text-xl tracking-tight">
              <Link
                href="/docs/components"
                className="rounded focus-visible:outline-2 focus-visible:outline-ring"
              >
                {lead.title}
              </Link>
            </h3>
            <p className="max-w-md text-muted-foreground text-sm">
              {lead.description}
            </p>
          </div>
        </motion.div>

        {/* Modern React — a real code snippet */}
        <div className={cn(cardBase, "lg:col-span-2")}>
          <div className="mb-5">
            <ReactSettingsIllustration />
          </div>
          <CardHeading
            description="Server Components, TypeScript and hooks throughout — built for React 19."
            icon={ReactLogo}
            title="Modern React"
          />
        </div>

        {/* Tailwind v4 — real token / utility chips */}
        <div className={cardBase}>
          <div className="mb-5">
            <TokenIllustration />
          </div>
          <CardHeading
            description="The latest utility-first engine, with a unified token spine."
            icon={TailwindLogo}
            title="Tailwind CSS v4"
          />
        </div>

        {/* shadcn — the real install command */}
        <div className={cn(cardBase, "self-stretch")}>
          <div className="mb-5 flex flex-1 flex-col justify-center rounded-xl border border-border/70 bg-muted/50 p-3 shadow-[inset_0_1px_3px_#00000004]">
            <div className="rounded-xl border border-border bg-background shadow-[0_2px_3px_#00000004,0_12px_22px_-10px_#00000020]">
              <div className="flex items-center gap-2 border-b p-3">
                <span className="flex size-8 items-center justify-center rounded-lg border bg-muted/40">
                  <Package size={15} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-xs">siri-orb</p>
                  <p className="mt-0.5 text-[9px] text-muted-foreground">
                    Registry component
                  </p>
                </div>
                <CommandCopy />
              </div>
              <div className="p-3">
                <div className="flex items-start gap-2 rounded-lg border border-border/60 bg-muted/40 p-2.5">
                  <Terminal
                    size={12}
                    className="mt-0.5 shrink-0 text-muted-foreground"
                  />
                  <code className="break-all font-mono text-[10px] leading-5">
                    <span className="text-muted-foreground">
                      npx shadcn add
                    </span>
                    <br />
                    @smoothui/siri-orb
                  </code>
                </div>
              </div>
              <p className="border-t px-3 py-2 text-[9px] text-muted-foreground">
                Copy into your terminal
              </p>
            </div>
          </div>
          <CardHeading
            description="Drops into any shadcn project — same patterns, one command."
            icon={ShadcnLogo}
            title="shadcn compatible"
          />
        </div>
      </div>
    </section>
  );
}
