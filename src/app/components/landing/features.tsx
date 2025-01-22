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
      "Fully customizable components using Tailwind CSS with dark mode support and consistent design tokens.",
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
        className="text-center font-title text-3xl font-bold text-light12 transition dark:text-dark12"
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
              "group relative flex flex-col rounded-2xl border border-light3 bg-light2 p-6 backdrop-blur-lg transition-all hover:border-pink-200 dark:border-dark3 dark:bg-dark2",
              "box-light dark:box-light"
            )}
          >
            <feature.icon className="mb-4 h-8 w-8 text-pink-500 transition group-hover:text-light1" />
            <h3 className="mb-2 text-xl font-semibold text-light12 transition group-hover:text-light1 dark:text-dark12">
              {feature.title}
            </h3>
            <p className="text-light11 transition group-hover:text-light1 dark:text-dark11">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}
