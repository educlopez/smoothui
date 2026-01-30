"use client";

import { motion } from "motion/react";
import type React from "react";
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

const ANIMATION_DURATION = 25;
const STAGGER_DELAY = 0.1;
const HOVER_SCALE = 1.2;
const HOVER_ROTATE = 5;
const SPRING_STIFFNESS = 300;
const SCROLL_DISTANCE_FACTOR = 33.333;

interface LogoCloudAnimatedProps {
  title?: string;
  description?: string;
  logos?: Array<{
    name: string;
    logo: React.ComponentType;
    url?: string;
  }>;
}

export function LogoCloudAnimated({
  title = "Trusted by the world's most innovative teams",
  description = "Join thousands of developers and designers who are already building with Smoothui",
  logos = [
    { name: "Canpoy", logo: Canpoy, url: "https://canpoy.com" },
    { name: "Canva", logo: Canva, url: "https://canva.com" },
    { name: "Casetext", logo: Casetext, url: "https://casetext.com" },
    { name: "Strava", logo: Strava, url: "https://strava.com" },
    { name: "Descript", logo: Descript, url: "https://descript.com" },
    { name: "Duolingo", logo: Duolingo, url: "https://duolingo.com" },
    { name: "Faire", logo: Faire, url: "https://faire.com" },
    { name: "Clearbit", logo: Clearbit, url: "https://clearbit.com" },
  ],
}: LogoCloudAnimatedProps) {
  return (
    <section className="overflow-hidden py-20">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-4 font-bold text-2xl text-foreground lg:text-3xl">
            {title}
          </h2>
          <p className="text-foreground/70 text-lg">{description}</p>
        </motion.div>
        {/* Infinite scrolling logos */}
        <div
          className="relative overflow-hidden"
          style={{
            maskImage:
              "linear-gradient(to right, hsl(0 0% 0% / 0), hsl(0 0% 0% / 1) 20%, hsl(0 0% 0% / 1) 80%, hsl(0 0% 0% / 0))",
            WebkitMaskImage:
              "linear-gradient(to right, hsl(0 0% 0% / 0), hsl(0 0% 0% / 1) 20%, hsl(0 0% 0% / 1) 80%, hsl(0 0% 0% / 0))",
          }}
        >
          <motion.div
            animate={{
              x: [0, -SCROLL_DISTANCE_FACTOR * logos.length],
            }}
            className="flex min-w-full shrink-0 items-center justify-around gap-8"
            transition={{
              x: {
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
                duration: ANIMATION_DURATION,
                ease: "linear",
              },
            }}
          >
            {/* First set */}
            {logos.map((logo, index) => (
              <motion.a
                animate={{ opacity: 1, scale: 1 }}
                className="group flex shrink-0 flex-col items-center justify-center p-6 transition-all hover:scale-105"
                href={logo.url}
                initial={{ opacity: 0, scale: 0.8 }}
                key={`first-${logo.name}`}
                rel="noopener noreferrer"
                target="_blank"
                transition={{
                  duration: 0.4,
                  delay: index * STAGGER_DELAY,
                }}
              >
                <motion.div
                  className="mb-2 text-4xl *:fill-foreground"
                  transition={{ type: "spring", stiffness: SPRING_STIFFNESS }}
                  whileHover={{ scale: HOVER_SCALE, rotate: HOVER_ROTATE }}
                >
                  <logo.logo />
                </motion.div>
              </motion.a>
            ))}
            {/* Second set for seamless loop */}
            {logos.map((logo, index) => (
              <motion.a
                animate={{ opacity: 1, scale: 1 }}
                className="group flex shrink-0 flex-col items-center justify-center p-6 transition-all hover:scale-105"
                href={logo.url}
                initial={{ opacity: 0, scale: 0.8 }}
                key={`second-${logo.name}`}
                rel="noopener noreferrer"
                target="_blank"
                transition={{
                  duration: 0.4,
                  delay: index * STAGGER_DELAY,
                }}
              >
                <motion.div
                  className="mb-2 text-4xl *:fill-foreground"
                  transition={{ type: "spring", stiffness: SPRING_STIFFNESS }}
                  whileHover={{ scale: HOVER_SCALE, rotate: HOVER_ROTATE }}
                >
                  <logo.logo />
                </motion.div>
              </motion.a>
            ))}
            {/* Third set for even smoother loop */}
            {logos.map((logo, index) => (
              <motion.a
                animate={{ opacity: 1, scale: 1 }}
                className="group flex shrink-0 flex-col items-center justify-center p-6 transition-all hover:scale-105"
                href={logo.url}
                initial={{ opacity: 0, scale: 0.8 }}
                key={`third-${logo.name}`}
                rel="noopener noreferrer"
                target="_blank"
                transition={{
                  duration: 0.4,
                  delay: index * STAGGER_DELAY,
                }}
              >
                <motion.div
                  className="mb-2 text-4xl *:fill-foreground"
                  transition={{ type: "spring", stiffness: SPRING_STIFFNESS }}
                  whileHover={{ scale: HOVER_SCALE, rotate: HOVER_ROTATE }}
                >
                  <logo.logo />
                </motion.div>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default LogoCloudAnimated;
