"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type React from "react";
import { useEffect, useState } from "react";
import {
  Canpoy,
  Canva,
  Casetext,
  Clearbit,
  Descript,
  Duolingo,
  Faire,
  Strava,
} from "../shared";

export type LogoGridProps = {
  title?: string;
  description?: string;
  logos?: Array<{
    name: string;
    logo: React.ReactNode;
    href?: string;
  }>;
  columns?: 3 | 4 | 5 | 6;
};

const DEFAULT_LOGOS = [
  { name: "Canpoy", logo: <Canpoy /> },
  { name: "Canva", logo: <Canva /> },
  { name: "Casetext", logo: <Casetext /> },
  { name: "Strava", logo: <Strava /> },
  { name: "Descript", logo: <Descript /> },
  { name: "Duolingo", logo: <Duolingo /> },
  { name: "Faire", logo: <Faire /> },
  { name: "Clearbit", logo: <Clearbit /> },
];

const COLUMN_CLASSES = {
  3: "grid-cols-2 sm:grid-cols-3",
  4: "grid-cols-2 sm:grid-cols-4",
  5: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
  6: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6",
};

// Animation constants
const HOVER_LIFT_OFFSET = -4;
const INACTIVE_OPACITY = 0.6;

type LogoItemProps = {
  logo: {
    name: string;
    logo: React.ReactNode;
    href?: string;
  };
  isHoverDevice: boolean;
  shouldReduceMotion: boolean | null;
};

function LogoItem({ logo, isHoverDevice, shouldReduceMotion }: LogoItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  const content = (
    <motion.div
      animate={
        shouldReduceMotion
          ? {}
          : {
              y: isHovered ? HOVER_LIFT_OFFSET : 0,
            }
      }
      className="group relative flex items-center justify-center p-6"
      onMouseEnter={() => isHoverDevice && setIsHovered(true)}
      onMouseLeave={() => isHoverDevice && setIsHovered(false)}
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : {
              type: "spring",
              duration: 0.25,
              bounce: 0.05,
            }
      }
    >
      {/* Logo with grayscale effect */}
      <div
        className="transition-all duration-200 *:fill-foreground"
        style={{
          filter: isHovered ? "grayscale(0)" : "grayscale(1)",
          opacity: isHovered ? 1 : INACTIVE_OPACITY,
        }}
      >
        {logo.logo}
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            animate={{ opacity: 1, x: "-50%", y: 0, scale: 1 }}
            className="pointer-events-none absolute -top-2 left-1/2 z-10 whitespace-nowrap rounded-md bg-foreground px-3 py-1.5 font-medium text-background text-sm shadow-lg"
            exit={
              shouldReduceMotion
                ? { opacity: 0, transition: { duration: 0 } }
                : { opacity: 0, y: 4, scale: 0.95 }
            }
            initial={
              shouldReduceMotion
                ? { opacity: 1, x: "-50%", y: 0 }
                : { opacity: 0, x: "-50%", y: 4, scale: 0.95 }
            }
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : {
                    type: "spring",
                    duration: 0.25,
                    bounce: 0.05,
                  }
            }
          >
            {logo.name}
            {/* Tooltip arrow */}
            <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-foreground" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  if (logo.href) {
    return (
      <a
        className="focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        href={logo.href}
        rel="noopener noreferrer"
        target="_blank"
      >
        {content}
      </a>
    );
  }

  return content;
}

export function LogoGrid({
  title = "Trusted by innovative companies",
  description = "Leading organizations rely on our platform to power their success",
  logos = DEFAULT_LOGOS,
  columns = 4,
}: LogoGridProps) {
  const shouldReduceMotion = useReducedMotion();
  const [isHoverDevice, setIsHoverDevice] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    setIsHoverDevice(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsHoverDevice(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <section className="bg-background py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 text-center">
          <h2 className="mb-4 font-bold text-2xl text-foreground lg:text-3xl">
            {title}
          </h2>
          <p className="text-foreground/70 text-lg">{description}</p>
        </div>

        <div
          className={`grid ${COLUMN_CLASSES[columns]} gap-4 rounded-xl border border-border/50 bg-muted/30 p-4`}
        >
          {logos.map((logo, index) => (
            <LogoItem
              isHoverDevice={isHoverDevice}
              key={`${logo.name}-${index}`}
              logo={logo}
              shouldReduceMotion={shouldReduceMotion}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default LogoGrid;
