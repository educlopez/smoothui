"use client";

import Divider from "@docs/components/landing/divider";
import { GsapLogo } from "@docs/components/landing/logos/gsap-logo";
import { MotionLogo } from "@docs/components/landing/logos/motion-logo";
import { ReactLogo } from "@docs/components/landing/logos/react-logo";
import { ShadcnLogo } from "@docs/components/landing/logos/shadcn-logo";
import { TailwindLogo } from "@docs/components/landing/logos/tailwind-logo";
import { LandingAtmosphere } from "@docs/components/landing/motion/atmosphere";
import { ChapterEyebrow } from "@docs/components/landing/motion/chapter-eyebrow";
import { ClipRevealGroup } from "@docs/components/landing/motion/clip-reveal";
import { PointerLean } from "@docs/components/landing/motion/pointer-lean";
import { WordReveal } from "@docs/components/landing/motion/word-reveal";
import { Button } from "@docs/components/smoothbutton";
import { useUiSound } from "@docs/components/sound-provider";
import ExpandableCardsDemo from "@docs/examples/expandable-cards";
import { BLOCK_COUNT, COMPONENT_COUNT } from "@docs/lib/generated/counts";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@repo/shadcn-ui/components/ui/tooltip";
import AnimatedInput from "@repo/smoothui/components/animated-input";
import ButtonCopy from "@repo/smoothui/components/button-copy";
import ClipCornersButton from "@repo/smoothui/components/clip-corners-button";
import ScrambleHover from "@repo/smoothui/components/scramble-hover";
import SiriOrb from "@repo/smoothui/components/siri-orb";
import Link from "next/link";
import {
  IconCheckFill24,
  IconCopy2Fill24,
  IconUserFill24,
} from "nucleo-core-fill-24";
import { useState } from "react";

const INSTALL_COMMAND = "npx shadcn@latest add @smoothui/dynamic-island";

const STATS = [
  { label: "Components", value: String(COMPONENT_COUNT) },
  { label: "Blocks", value: String(BLOCK_COUNT) },
  { label: "License", value: "MIT" },
] as const;

const TECH = [
  { className: "size-6", icon: ReactLogo, name: "React" },
  { className: "h-5 w-auto", icon: TailwindLogo, name: "Tailwind CSS" },
  { className: "size-6", icon: ShadcnLogo, name: "shadcn/ui" },
  { className: "h-4 w-auto", icon: MotionLogo, name: "Motion" },
  { className: "h-4 w-auto", icon: GsapLogo, name: "GSAP" },
] as const;

export function Hero() {
  const playClick = useUiSound("/sounds/button.wav", 0.4);
  const [installCopied, setInstallCopied] = useState(false);

  const copyInstall = async () => {
    try {
      await navigator.clipboard.writeText(INSTALL_COMMAND);
      setInstallCopied(true);
      playClick();
      setTimeout(() => setInstallCopied(false), 1600);
    } catch {
      // clipboard unavailable — no-op
    }
  };

  return (
    <section className="relative bg-background transition">
      <LandingAtmosphere />
      <div className="relative py-24 md:py-36">
        <Divider />
        <div className="mx-auto max-w-7xl px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div className="flex max-w-xl flex-col">
              <ChapterEyebrow align="left" index="01" label="Introduction" />

              <div className="flex flex-col gap-5">
                <h1 className="text-balance font-semibold font-title text-4xl text-foreground tracking-tight md:text-5xl lg:text-6xl lg:leading-[1.1]">
                  <WordReveal
                    as="span"
                    className="block"
                    text="Animated React components"
                  />
                  <WordReveal
                    as="span"
                    className="block text-muted-foreground"
                    text="for shadcn/ui"
                  />
                </h1>

                <p className="max-w-lg text-balance text-foreground/70 text-lg leading-relaxed md:text-xl">
                  {COMPONENT_COUNT} drop-in components for your shadcn/ui
                  project — one command, Motion-powered, fully typed.
                </p>
              </div>

              <div className="mt-10 flex flex-col gap-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
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

                <button
                  aria-label="Copy install command"
                  className="group flex w-fit max-w-full cursor-pointer items-center gap-2.5 rounded-lg border border-border bg-background px-3 py-2 font-mono text-foreground/80 text-sm transition-colors hover:border-brand/40"
                  onClick={copyInstall}
                  type="button"
                >
                  <span
                    aria-hidden
                    className="select-none text-muted-foreground"
                  >
                    $
                  </span>
                  <span className="truncate">{INSTALL_COMMAND}</span>
                  <span className="shrink-0 text-muted-foreground transition-colors group-hover:text-foreground">
                    {installCopied ? (
                      <IconCheckFill24 className="size-4 text-brand" />
                    ) : (
                      <IconCopy2Fill24 className="size-4" />
                    )}
                  </span>
                  <span aria-live="polite" className="sr-only">
                    {installCopied ? "Copied to clipboard" : ""}
                  </span>
                </button>
              </div>

              <dl className="mt-10 grid grid-cols-3 gap-4 border-border/60 border-t pt-8">
                {STATS.map((stat) => (
                  <div key={stat.label}>
                    <dt className="font-medium text-[11px] text-muted-foreground uppercase tracking-[0.16em]">
                      {stat.label}
                    </dt>
                    <dd className="mt-1 font-mono font-semibold text-2xl text-foreground tabular-nums">
                      {stat.value}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-8 flex flex-col gap-5">
                <a
                  className="w-fit opacity-80 transition-opacity hover:opacity-100"
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

                <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                  {TECH.map((tech) => (
                    <Tooltip key={tech.name}>
                      <TooltipTrigger asChild>
                        <span className="cursor-default text-smooth-700 transition-colors hover:text-brand">
                          <tech.icon className={tech.className} />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" sideOffset={8}>
                        {tech.name}
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </div>
            </div>

            <PointerLean className="relative">
              <ClipRevealGroup className="grid grid-cols-2 gap-4">
                <div
                  className="frame-box relative col-span-2 flex justify-center rounded-lg p-6"
                  data-reveal
                >
                  <SiriOrb
                    animationDuration={15}
                    className="drop-shadow-lg"
                    colors={{
                      bg: "var(--color-primary)",
                    }}
                    size="120px"
                  />
                </div>

                <div className="frame-box relative rounded-lg p-4" data-reveal>
                  <AnimatedInput
                    icon={<IconUserFill24 size={16} strokeWidth={1.5} />}
                    label="Username"
                    placeholder="Enter username"
                  />
                </div>

                <div
                  className="frame-box relative flex items-center justify-center rounded-lg p-4"
                  data-reveal
                >
                  <ScrambleHover
                    className="z-10 font-medium text-sm"
                    duration={1200}
                    speed={50}
                  >
                    Hover to Scramble
                  </ScrambleHover>
                </div>

                <div
                  className="frame-box relative flex items-center justify-center rounded-lg p-4"
                  data-reveal
                >
                  <ClipCornersButton className="px-4 py-2 text-xs">
                    Clip Corners
                  </ClipCornersButton>
                </div>

                <div
                  className="frame-box relative flex items-center justify-center rounded-lg p-4"
                  data-reveal
                >
                  <ButtonCopy className="text-xs" />
                </div>

                <div
                  className="frame-box relative col-span-2 rounded-lg p-4"
                  data-reveal
                >
                  <ExpandableCardsDemo />
                </div>
              </ClipRevealGroup>
            </PointerLean>
          </div>
        </div>
      </div>
    </section>
  );
}
