"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight, CirclePlay } from "lucide-react";
import { motion } from "motion/react";



import { Button } from "@/components/ui/button";





const logos = [
  {
    src: "/logos/column.svg",
    alt: "Column Logo",
    height: 16,
  },
  {
    src: "/logos/nvidia.svg",
    alt: "Nvidia Logo",
    height: 20,
  },
  {
    src: "/logos/github.svg",
    alt: "GitHub Logo",
    height: 16,
  },
]

export function HeroShowcase() {
  return (
    <section className="from-background to-muted relative overflow-hidden bg-gradient-to-b">
      <div className="relative py-36">
        <div className="relative z-10 mx-auto w-full max-w-5xl px-6">
          <div className="md:w-1/2">
            <motion.h1
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", duration: 0.7 }}
              className="text-brand max-w-md text-5xl font-black text-balance md:text-6xl"
            >
              Build beautiful UIs, effortlessly.
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15, type: "spring", duration: 0.6 }}
              className="text-muted-foreground my-8 max-w-2xl text-xl text-balance"
            >
              Smoothui gives you the building blocks to create stunning,
              animated interfaces in minutes.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: "spring", duration: 0.5 }}
              className="flex items-center gap-3"
            >
              <Button asChild size="lg" className="pr-4.5">
                <Link href="#link">
                  <span className="text-nowrap">Get Started</span>
                  <ChevronRight className="opacity-50" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="pl-5">
                <Link href="#link">
                  <CirclePlay className="fill-primary/25 stroke-primary" />
                  <span className="text-nowrap">Watch demo</span>
                </Link>
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, type: "spring", duration: 0.5 }}
              className="mt-10"
            >
              <p className="text-muted-foreground">Trusted by modern teams:</p>
              <div className="mt-6 grid max-w-sm grid-cols-3 gap-6">
                {logos.map((logo, i) => (
                  <motion.div
                    key={logo.alt}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + i * 0.15, duration: 0.4 }}
                    className="flex"
                  >
                    <Image
                      className="h-4 w-fit"
                      src={logo.src}
                      alt={logo.alt}
                      height={logo.height}
                      width={80}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.6, type: "spring", duration: 0.7 }}
          className="mt-24 perspective-near md:absolute md:top-40 md:-right-6 md:bottom-16 md:left-1/2 md:mt-0 md:translate-x-0"
        >
          <div className="before:border-foreground/5 before:bg-foreground/5 relative h-full before:absolute before:-inset-x-4 before:top-0 before:bottom-7 before:skew-x-6 before:rounded-[calc(var(--radius)+1rem)] before:border">
            <div className="bg-background shadow-foreground/10 ring-foreground/5 relative h-full -translate-y-12 skew-x-6 overflow-hidden rounded-[--radius] rounded-md border border-transparent ring-1 shadow-md">
              <Image
                src="/readme.png"
                alt="app screen"
                width={2880}
                height={1842}
                className="object-top-left size-full object-cover"
                priority
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}