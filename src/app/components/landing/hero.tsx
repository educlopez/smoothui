"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { motion } from "motion/react"

import Divider from "@/app/components/landing/divider"
import { ReactLogo } from "@/app/components/resources/logos/ReactLogo"
import { TailwindLogo } from "@/app/components/resources/logos/TailwindLogo"

import Rule from "./rule"

export function Hero() {
  return (
    <motion.section
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", duration: 0.8 }}
      className="relative flex min-h-[80vh] flex-col items-center justify-center px-4"
    >
      <Rule position="bottom-right" />
      <Rule position="bottom-left" />
      <Divider />

      <Image
        src="/images/icon.png"
        alt="SmoothUI Logo"
        width={120}
        height={120}
        className="mb-8"
      />

      <h1 className="text-center font-title text-5xl font-bold tracking-tight text-light12 transition dark:text-dark12 md:text-6xl">
        Smooth<span className="text-pink-500">UI</span>
      </h1>

      <p className="mt-6 max-w-2xl text-center text-xl text-light11 transition dark:text-dark11">
        A collection of <span className="line-through">awesome</span> test
        components
        <br /> with smooth animations
      </p>
      <div className="mt-10 flex gap-4">
        <Link
          href="/doc"
          className="candy-btn group relative isolate inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium"
        >
          Get Started
          <ArrowRight className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="mt-14 hidden cursor-default items-center justify-start gap-3 text-xs font-medium uppercase tracking-widest text-light11 transition dark:text-dark11 sm:flex sm:justify-center">
        <span>Built for</span>
        <span className="group flex items-center gap-1.5">
          <ReactLogo className="h-6 text-light9 transition group-hover:text-pink-500 dark:text-dark9 dark:group-hover:text-pink-500" />
          <span className="group-hover:text-pink-500 dark:group-hover:text-pink-500">
            React
          </span>
        </span>
        <span className="group flex items-center gap-1.5">
          <TailwindLogo className="h-5 text-light9 transition group-hover:text-pink-500 dark:text-dark9 dark:group-hover:text-pink-500" />
          <span className="group-hover:text-pink-500 dark:group-hover:text-pink-500">
            Tailwind CSS
          </span>
        </span>
      </div>
    </motion.section>
  )
}
