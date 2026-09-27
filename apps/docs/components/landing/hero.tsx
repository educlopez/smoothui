"use client";

import { HeroDither } from "@docs/components/landing/hero-dither";
import { ShowcaseDemo } from "@docs/components/landing/showcase-demo";
import { Button } from "@docs/components/smoothbutton";
import { useUiSound } from "@docs/components/sound-provider";
import { COMPONENT_COUNT } from "@docs/lib/generated/counts";
import { cn } from "@repo/shadcn-ui/lib/utils";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import {
  IconImageFill24,
  IconLayersStackedFill24,
  IconPhotosFill24,
} from "nucleo-core-fill-24";
import { useEffect, useRef, useState } from "react";
import { preload } from "react-dom";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

const BACKGROUND_SRC = "/hero/pink-dunes.jpg";

preload(BACKGROUND_SRC, { as: "image", fetchPriority: "high" });

const EXAMPLES = [
  {
    icon: IconImageFill24,
    label: "Image metadata",
    slug: "image-metadata-preview",
  },
  {
    icon: IconPhotosFill24,
    label: "Phototab",
    slug: "phototab",
  },
  {
    icon: IconLayersStackedFill24,
    label: "Photo stack",
    slug: "photo-stack",
  },
] as const;

export function Hero() {
  const shouldReduceMotion = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState({ height: 0, width: 0 });
  const [showPhoto, setShowPhoto] = useState(false);

  useEffect(() => {
    const node = stageRef.current;
    if (!node) {
      return;
    }
    const measure = () => {
      const box = node.getBoundingClientRect();
      setStage({
        height: Math.max(1, Math.round(box.height)),
        width: Math.max(1, Math.round(box.width)),
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => {
      observer.disconnect();
    };
  }, []);
  const playClick = useUiSound("/sounds/button.wav", 0.4);
  const [example, setExample] = useState<(typeof EXAMPLES)[number]["slug"]>(
    "image-metadata-preview"
  );
  const active = EXAMPLES.find((item) => item.slug === example) ?? EXAMPLES[0];

  return (
    <section className="relative overflow-hidden bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent_0%,transparent_46%,black_58%,black_74%,transparent_96%)]"
      >
        <div className="absolute inset-x-0 -top-[22%] h-[120%]" ref={stageRef}>
          {showPhoto ? (
            <img
              alt=""
              className="size-full object-fill"
              src={BACKGROUND_SRC}
            />
          ) : null}
          {stage.width > 1 ? (
            <HeroDither
              height={stage.height}
              onFallback={() => setShowPhoto(true)}
              src={BACKGROUND_SRC}
              width={stage.width}
            />
          ) : null}
        </div>
      </div>

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 pt-32 text-center md:pt-40">
        <motion.div
          animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          className="flex flex-col items-center"
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { duration: 0.35, ease: EASE_OUT }
          }
        >
          <h1 className="text-balance font-semibold font-title text-5xl text-foreground tracking-tight md:text-6xl lg:text-7xl lg:leading-[1.05]">
            React components.
            <span className="mt-1 block">Made to move.</span>
          </h1>

          <p className="mt-6 max-w-xl text-balance text-lg text-muted-foreground leading-relaxed md:text-xl">
            {COMPONENT_COUNT} animated components for React and shadcn/ui — copy
            the code and make it yours.
          </p>

          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
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

          <a
            className="mt-12 opacity-80 transition-opacity duration-150 hover:opacity-100"
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
        </motion.div>
      </div>

      <div className="relative z-10 mx-auto mt-10 w-full max-w-5xl px-4 pb-20 md:mt-14 md:px-6 md:pb-28">
        <div className="mx-auto max-w-3xl">
          <div
            aria-label="Component examples"
            className="grid grid-cols-3"
            role="tablist"
          >
            {EXAMPLES.map((item) => {
              const selected = item.slug === active.slug;
              const Icon = item.icon;
              return (
                <button
                  aria-selected={selected}
                  className="group flex h-16 cursor-pointer items-center justify-center px-2"
                  id={`hero-tab-${item.slug}`}
                  key={item.slug}
                  onClick={() => {
                    setExample(item.slug);
                    playClick();
                  }}
                  role="tab"
                  type="button"
                >
                  <span
                    className={cn(
                      "flex h-10 items-center gap-2 rounded-full bg-card px-4 text-foreground text-sm shadow-sm ring-1 ring-foreground/15 transition-colors duration-150",
                      selected
                        ? "shadow-md ring-foreground/25"
                        : "text-foreground/80 group-hover:text-foreground group-hover:ring-foreground/30"
                    )}
                  >
                    <Icon className="size-4" />
                    <span className="max-md:sr-only">{item.label}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mx-auto -mt-px max-w-6xl">
          <div
            aria-labelledby={`hero-tab-${active.slug}`}
            className="flex min-h-[28rem] items-center justify-center overflow-hidden rounded-2xl bg-card p-6 shadow-lg ring-1 ring-foreground/10 md:p-8"
            role="tabpanel"
          >
            <div className="[&_[data-metadata-stage]>div]:translate-none flex w-full items-center justify-center [&_[data-metadata-stage]>div]:static [&_[data-metadata-stage]>div]:inset-auto [&_[data-metadata-stage]>div]:w-[300px] [&_[data-metadata-stage]>div]:max-w-none [&_[data-metadata-stage]]:flex [&_[data-metadata-stage]]:h-auto [&_[data-metadata-stage]]:w-full [&_[data-metadata-stage]]:justify-center">
              <ShowcaseDemo slug={active.slug} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
