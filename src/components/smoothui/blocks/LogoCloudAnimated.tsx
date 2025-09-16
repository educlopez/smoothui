"use client"

import type React from "react"
import { motion } from "motion/react"

import {
  Canpoy,
  Canva,
  Casetext,
  Clearbit,
  Descript,
  Duolingo,
  Faire,
  Strava,
} from "./logos"

interface LogoCloudAnimatedProps {
  title?: string
  description?: string
  logos?: Array<{
    name: string
    logo: React.ComponentType
    url?: string
  }>
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="text-foreground mb-4 text-2xl font-bold lg:text-3xl">
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
            className="flex min-w-full flex-shrink-0 items-center justify-around gap-8"
            animate={{
              x: [0, -33.333 * logos.length],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 25,
                ease: "linear",
              },
            }}
          >
            {/* First set */}
            {logos.map((logo, index) => (
              <motion.a
                key={`first-${logo.name}`}
                href={logo.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group flex flex-shrink-0 flex-col items-center justify-center p-6 transition-all hover:scale-105"
              >
                <motion.div
                  className="*:fill-foreground mb-2 text-4xl"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <logo.logo />
                </motion.div>
              </motion.a>
            ))}
            {/* Second set for seamless loop */}
            {logos.map((logo, index) => (
              <motion.a
                key={`second-${logo.name}`}
                href={logo.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group flex flex-shrink-0 flex-col items-center justify-center p-6 transition-all hover:scale-105"
              >
                <motion.div
                  className="*:fill-foreground mb-2 text-4xl"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <logo.logo />
                </motion.div>
              </motion.a>
            ))}
            {/* Third set for even smoother loop */}
            {logos.map((logo, index) => (
              <motion.a
                key={`third-${logo.name}`}
                href={logo.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group flex flex-shrink-0 flex-col items-center justify-center p-6 transition-all hover:scale-105"
              >
                <motion.div
                  className="*:fill-foreground mb-2 text-4xl"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <logo.logo />
                </motion.div>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
