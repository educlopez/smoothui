"use client"

import { Package } from "lucide-react"
import { motion } from "motion/react"

import Divider from "@/app/components/landing/divider"
import { ReactLogo } from "@/app/components/resources/logos/ReactLogo"
import { TailwindLogo } from "@/app/components/resources/logos/TailwindLogo"
import { cn } from "@/app/utils/cn"

import Rule from "./rule"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

const features = [
  {
    title: "Smooth Animations",
    description:
      "Built-in animations powered by Motion for delightful user experiences.",
    icon: Package,
  },
  {
    title: "React",
    description:
      "Built with modern React patterns including Server Components, TypeScript, and hooks for optimal performance.",
    icon: ReactLogo,
  },
  {
    title: "Tailwindcss",
    description:
      "Built with Tailwind CSS v4, featuring the latest utility-first CSS framework with enhanced dark mode and modern design patterns.",
    icon: TailwindLogo,
  },
]

export function Features() {
  return (
    <motion.section
      className="relative mx-auto max-w-7xl px-4 py-24"
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
    >
      <Rule position="bottom-right" />
      <Rule position="bottom-left" />
      <Divider />
      <motion.h2
        className="font-title text-light12 dark:text-dark12 text-center text-3xl font-bold transition"
        variants={item}
      >
        Why Choose Smooth<span className="text-pink-500">UI</span>?
      </motion.h2>
      <div className="mt-16 grid gap-8 px-4 md:grid-cols-3">
        {features.map((feature) => (
          <motion.div
            key={feature.title}
            variants={item}
            className={cn(
              "group border-light3 bg-light2 dark:border-dark3 dark:bg-dark2 relative flex flex-col rounded-2xl border p-6 backdrop-blur-lg transition-all hover:border-pink-200",
              "box-light dark:box-light"
            )}
          >
            <feature.icon className="group-hover:text-light1 mb-4 h-8 w-8 text-pink-500 transition" />
            <h3 className="text-light12 group-hover:text-light1 dark:text-dark12 mb-2 text-xl font-semibold transition">
              {feature.title}
            </h3>
            <p className="text-light11 group-hover:text-light1 dark:text-dark11 group-hover:dark:text-dark12 transition">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}
