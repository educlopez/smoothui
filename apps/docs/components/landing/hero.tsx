"use client";

import { AgentLinks } from "@docs/components/landing/agent-links";
import { HeroDither } from "@docs/components/landing/hero-dither";
import { HeroStage } from "@docs/components/landing/hero-stage";
import { Button } from "@docs/components/smoothbutton";
import { useUiSound } from "@docs/components/sound-provider";
import { UI_COUNT } from "@docs/lib/generated/counts";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { preload } from "react-dom";

const BACKGROUND_SRC = "/hero/pink-dunes.jpg";
const GITHUB_URL = "https://github.com/educlopez/smoothui";

preload(BACKGROUND_SRC, { as: "image", fetchPriority: "high" });

export function Hero() {
  const playClick = useUiSound("/sounds/button.wav", 0.4);
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
    <section className="relative overflow-hidden bg-background">
      <div
        aria-hidden
        className="mask-t-from-35% mask-t-to-65% mask-b-from-55% mask-b-to-75% dark:mask-t-to-55% pointer-events-none absolute inset-0 opacity-45 dark:opacity-55"
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

      <div className="pt-20 pb-10 md:pt-28 md:pb-20 lg:pt-36">
        <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 text-center">
          <h1 className="text-balance font-allo-display font-semibold text-4xl text-foreground tracking-tight sm:text-5xl md:text-6xl lg:text-7xl lg:leading-[1.05]">
            React components.
            <span className="mt-1 block">Made to move.</span>
          </h1>

          <p className="mt-6 max-w-xl text-balance text-lg text-muted-foreground leading-relaxed md:text-xl">
            {UI_COUNT} animated primitives and components for React — copy the
            code and make it yours.
          </p>

          <AgentLinks />

          <Button
            asChild
            className="mt-4"
            onClick={() => playClick()}
            size="lg"
            variant="candy"
          >
            <Link href="/docs/components">Explore components</Link>
          </Button>

          <a
            className="focus-ring state-transition mt-2 inline-flex min-h-11 items-center rounded-md px-2 text-muted-foreground text-sm underline-offset-4 outline-none hover:text-foreground hover:underline"
            href={GITHUB_URL}
            rel="noopener noreferrer"
            target="_blank"
          >
            1,000+ stars on GitHub
          </a>
        </div>

        <HeroStage />
      </div>
    </section>
  );
}
