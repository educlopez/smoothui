"use client"

import { motion } from "motion/react"

import { cn } from "@/lib/utils"
import Divider from "@/components/landing/divider"

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

const faqs = [
  {
    question: "Is SmoothUI free to use?",
    answer: "Yes, SmoothUI is completely free",
  },
  {
    question: "What is SmoothUI?",
    answer:
      "SmoothUI is a collection of beautifully designed React components with smooth animations, built using React, Tailwind CSS, and Motion. It aims to provide reusable UI components that enhance user experience.",
  },
  {
    question: "What features does SmoothUI offer?",
    answer:
      "SmoothUI offers smooth animations, responsive design, easy-to-use APIs, customization with Tailwind CSS, and built-in dark mode support.",
  },
  {
    question: "How do I install SmoothUI?",
    answer:
      "Install the required dependencies using: pnpm install motion tailwindcss lucide-react clsx tailwind-merge.",
  },
  {
    question: "Can I customize the components?",
    answer:
      "Yes, you can easily customize SmoothUI components using Tailwind CSS utility classes.",
  },
  {
    question: "Does SmoothUI support dark mode?",
    answer:
      "Yes, all components support both light and dark themes out of the box.",
  },
  {
    question: "How can I contribute to SmoothUI?",
    answer:
      "You can contribute by forking the repository, creating a new branch, making your changes, and submitting a pull request on GitHub.",
  },
  // Add more FAQs...
]

export function FAQ() {
  return (
    <motion.section
      className="relative w-full px-4 py-24"
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
    >
      <Rule position="bottom-right" />
      <Rule position="bottom-left" />
      <Divider />
      <motion.h2
        variants={item}
        className="font-title text-foreground text-center text-3xl font-bold transition"
      >
        Frequently Asked Questions
      </motion.h2>
      <div className="mx-auto mt-16 max-w-3xl space-y-8">
        {faqs.map((faq) => (
          <motion.div
            key={faq.question}
            variants={item}
            className={cn(
              "hover:gradient-candy group bg-smooth-100 relative flex flex-col rounded-2xl p-6 backdrop-blur-lg transition-all",
              "shadow-custom"
            )}
          >
            <h3 className="text-foreground text-lg font-semibold transition">
              {faq.question}
            </h3>
            <p className="text-primary-foreground group-hover:text-smooth-1000 group-hover: mt-2 transition">
              {faq.answer}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}
