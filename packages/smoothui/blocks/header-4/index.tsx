/**
 * Header 4 - Interactive 3D Grid Hero
 *
 * Inspired by the beautiful interactive grid design from rauno.me 2024 website.
 * Features a 3D-perspective grid with customizable hover colors that respond
 * to user interaction, creating an engaging and modern hero section.
 *
 * @see https://rauno.me
 */

"use client";

import { ExternalLink } from "lucide-react";
import { useEffect, useRef } from "react";
import { AnimatedGroup, AnimatedText, Button, HeroHeader } from "../shared";
import styles from "./hero-grid.module.css";

type InteractiveGridProps = {
  hoverColors?: string | [string, string, string, string];
};

const TOTAL_TILES = 1600;
const INITIAL_TILE = 1;
const TILES_TO_CLONE = TOTAL_TILES - INITIAL_TILE;

function InteractiveGrid({ hoverColors }: InteractiveGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!(containerRef.current && tileRef.current)) {
      return;
    }

    // Clone the first tile to create a 40x40 grid (1600 tiles total)
    for (let i = 0; i < TILES_TO_CLONE; i++) {
      const clonedTile = tileRef.current.cloneNode(true);
      containerRef.current.appendChild(clonedTile);
    }
  }, []);

  // Prepare CSS variables for hover colors
  const style = hoverColors
    ? {
        "--hero-grid-hover-color-1": Array.isArray(hoverColors)
          ? hoverColors[0]
          : hoverColors,
        "--hero-grid-hover-color-2": Array.isArray(hoverColors)
          ? (hoverColors[1] ?? hoverColors[0])
          : hoverColors,
        "--hero-grid-hover-color-3": Array.isArray(hoverColors)
          ? (hoverColors[2] ?? hoverColors[0])
          : hoverColors,
        "--hero-grid-hover-color-4": Array.isArray(hoverColors)
          ? (hoverColors[3] ?? hoverColors[0])
          : hoverColors,
      }
    : undefined;

  return (
    <div
      aria-hidden="true"
      className={styles.gridContainer}
      style={style as React.CSSProperties}
    >
      <div className={styles.mainGrid} ref={containerRef}>
        <div className={styles.tile} ref={tileRef} />
      </div>
    </div>
  );
}

type HeroGridProps = {
  hoverColors?: string | [string, string, string, string];
};

export function HeroGrid({ hoverColors }: HeroGridProps) {
  return (
    <div className="relative">
      <HeroHeader />
      <main>
        <section className="relative overflow-hidden py-36">
          {/* Interactive animated grid background */}
          <InteractiveGrid hoverColors={hoverColors} />
          <AnimatedGroup
            className="pointer-events-none flex flex-col items-center gap-6 text-center"
            preset="blur-slide"
          >
            <div>
              <AnimatedText
                as="h1"
                className="mb-6 text-pretty font-bold text-2xl tracking-tight lg:text-5xl"
              >
                Build your next project with{" "}
                <span className="text-brand">Smoothui</span>
              </AnimatedText>
              <AnimatedText
                as="p"
                className="mx-auto max-w-3xl text-muted-foreground lg:text-xl"
                delay={0.15}
              >
                Smoothui gives you the building blocks to create stunning,
                animated interfaces in minutes.
              </AnimatedText>
            </div>
            <AnimatedGroup
              className="pointer-events-auto mt-6 flex justify-center gap-3"
              preset="slide"
            >
              <Button
                className="shadow-sm transition-shadow hover:shadow"
                variant="outline"
              >
                Get Started
              </Button>
              <Button className="group" variant="candy">
                Learn more{" "}
                <ExternalLink className="ml-2 h-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </AnimatedGroup>
          </AnimatedGroup>
        </section>
      </main>
    </div>
  );
}

export default HeroGrid;
