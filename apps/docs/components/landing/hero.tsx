"use client";

import { GsapLogo } from "@docs/components/landing/logos/gsap-logo";
import { MotionLogo } from "@docs/components/landing/logos/motion-logo";
import { ReactLogo } from "@docs/components/landing/logos/react-logo";
import { ShadcnLogo } from "@docs/components/landing/logos/shadcn-logo";
import { TailwindLogo } from "@docs/components/landing/logos/tailwind-logo";
import { EditorialKicker } from "@docs/components/landing/motion/editorial-kicker";
import { ScrollFilm } from "@docs/components/landing/motion/scroll-film";
import { Button } from "@docs/components/smoothbutton";
import { useUiSound } from "@docs/components/sound-provider";
import { BLOCK_COUNT, COMPONENT_COUNT } from "@docs/lib/generated/counts";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@repo/shadcn-ui/components/ui/tooltip";
import Link from "next/link";
import { IconCheckFill24, IconCopy2Fill24 } from "nucleo-core-fill-24";
import { useState } from "react";

const INSTALL_COMMAND = "npx shadcn@latest add @smoothui/dynamic-island";

const STATS = [
  { label: "Components", value: String(COMPONENT_COUNT) },
  { label: "Blocks", value: String(BLOCK_COUNT) },
  { label: "License", value: "MIT" },
] as const;

const TECH = [
  { className: "size-5", icon: ReactLogo, name: "React" },
  { className: "h-4 w-auto", icon: TailwindLogo, name: "Tailwind CSS" },
  { className: "size-5", icon: ShadcnLogo, name: "shadcn/ui" },
  { className: "h-3.5 w-auto", icon: MotionLogo, name: "Motion" },
  { className: "h-3.5 w-auto", icon: GsapLogo, name: "GSAP" },
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
    <section className="relative min-h-[100svh] overflow-hidden">
      <ScrollFilm
        poster="/scenes/why-choose.webp"
        preload="auto"
        src="/films/foundations.mp4"
      />
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-8 pt-32 pb-16 md:px-12 md:pb-20">
        <EditorialKicker index="01" label="Introduction" />
        <h1 className="mt-6 max-w-4xl font-display text-5xl text-white leading-[0.92] tracking-tight md:text-7xl lg:text-[6.75rem]">
          Animated React
          <br />
          <em>components</em>
        </h1>
        <p className="mt-6 max-w-md text-pretty text-lg text-white/80 leading-relaxed md:text-xl">
          {COMPONENT_COUNT} drop-in pieces for shadcn/ui — one command, Motion
          and GSAP, fully typed.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          <Button asChild onClick={() => playClick()} size="sm" variant="candy">
            <Link href="/docs/components">Browse components</Link>
          </Button>
          <Link
            className="inline-flex h-9 items-center justify-center rounded-lg border border-white/45 px-4 font-medium text-sm text-white transition-colors hover:bg-white/10"
            href="/docs/guides"
            onClick={() => playClick()}
          >
            Read the docs
          </Link>
        </div>

        <button
          aria-label="Copy install command"
          className="mt-5 flex w-fit max-w-full cursor-pointer items-center gap-2.5 font-meta text-[11px] text-white/70 uppercase tracking-[0.16em] transition-colors hover:text-white"
          onClick={copyInstall}
          type="button"
        >
          <span aria-hidden>$</span>
          <span className="truncate normal-case tracking-normal">
            {INSTALL_COMMAND}
          </span>
          {installCopied ? (
            <IconCheckFill24 className="size-3.5 text-white" />
          ) : (
            <IconCopy2Fill24 className="size-3.5" />
          )}
          <span aria-live="polite" className="sr-only">
            {installCopied ? "Copied to clipboard" : ""}
          </span>
        </button>

        <dl className="mt-14 grid max-w-xl grid-cols-3 gap-6 border-white/20 border-t pt-8">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <dt className="font-meta text-[10px] text-white/55 uppercase tracking-[0.2em]">
                {stat.label}
              </dt>
              <dd className="mt-2 font-display text-4xl text-white tabular-nums md:text-5xl">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
          {TECH.map((tech) => (
            <Tooltip key={tech.name}>
              <TooltipTrigger asChild>
                <span className="cursor-default text-white/70 transition-colors hover:text-white">
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
    </section>
  );
}
