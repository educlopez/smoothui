"use client";

import { HeroDither } from "@docs/components/landing/hero-dither";
import { UiCraftInstallSelector } from "@docs/components/landing/ui-craft-install-selector";
import Image from "next/image";
import Link from "next/link";
import { IconArrowUpRightFill24 } from "nucleo-core-fill-24";
import { useEffect, useRef, useState } from "react";

/** Same pink dunes as the hero. */
const BACKGROUND_SRC = "/hero/pink-dunes.jpg";

export function SkillsSection() {
  const bandRef = useRef<HTMLDivElement>(null);
  const [band, setBand] = useState({ height: 0, width: 0 });
  const [showPhoto, setShowPhoto] = useState(false);

  useEffect(() => {
    const node = bandRef.current;
    if (!node) {
      return;
    }
    const measure = () => {
      const box = node.getBoundingClientRect();
      setBand({
        height: Math.max(1, Math.round(box.height)),
        width: Math.max(1, Math.round(box.width)),
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative overflow-hidden bg-background px-8 py-32 md:py-40">
      <div
        aria-hidden
        className="mask-t-from-35% mask-t-to-65% mask-b-from-55% mask-b-to-75% dark:mask-t-to-55% pointer-events-none absolute inset-y-0 left-1/2 w-screen max-w-none -translate-x-1/2"
        data-landing-background="uicraft"
        ref={bandRef}
      >
        {showPhoto ? (
          <img
            alt=""
            className="size-full object-cover object-bottom"
            height={1024}
            src={BACKGROUND_SRC}
            width={1024}
          />
        ) : null}
        {band.width > 1 ? (
          <HeroDither
            height={band.height}
            onFallback={() => setShowPhoto(true)}
            src={BACKGROUND_SRC}
            width={band.width}
          />
        ) : null}
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-center">
        <div
          className="mx-auto flex w-full max-w-3xl flex-col items-center gap-5 rounded-2xl border border-border bg-background px-4 py-10 text-center shadow-xl md:px-8 md:py-12"
          data-uicraft-copy
        >
          <div>
            <Image
              alt="UI Craft"
              className="size-14 rounded-2xl shadow-black/20 shadow-lg ring-1 ring-white/40"
              draggable={false}
              height={56}
              src="/icon-ui-craft.png"
              width={56}
            />
          </div>

          <span className="font-medium text-[11px] text-muted-foreground uppercase tracking-[0.18em]">
            UI Craft
          </span>

          <h2 className="max-w-2xl text-balance font-semibold font-title text-3xl text-foreground md:text-4xl">
            The system behind design taste
          </h2>

          <p className="max-w-xl text-balance text-muted-foreground">
            Anti-slop detection, a scored quality gate, and a convergence loop —
            so your agent ships UI you&apos;d actually put in production.
          </p>

          <div className="mt-3 w-full min-w-0">
            <UiCraftInstallSelector className="w-full min-w-0" />
          </div>

          <div>
            <Link
              className="group mt-2 flex items-center gap-1.5 font-medium text-foreground/80 text-sm transition-colors hover:text-foreground"
              href="https://ui-craft.smoothui.dev"
              rel="noopener noreferrer"
              target="_blank"
            >
              Explore UI Craft
              <IconArrowUpRightFill24
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                size={14}
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
