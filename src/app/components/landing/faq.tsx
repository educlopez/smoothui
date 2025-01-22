"use client"

import { motion } from "motion/react"

import Divider from "@/app/components/landing/divider"

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
        className="text-center font-title text-3xl font-bold text-light12 transition dark:text-dark12"
      >
        Frequently Asked Questions
      </motion.h2>
      <div className="mx-auto mt-16 max-w-3xl space-y-8">
        {faqs.map((faq) => (
          <motion.div
            key={faq.question}
            variants={item}
            className="box-light group relative flex flex-col rounded-lg border border-light3 bg-light2 p-6 backdrop-blur-lg transition-all hover:shadow-pink-500/5 dark:border-dark3 dark:bg-dark2"
          >
            <h3 className="text-lg font-semibold text-light12 transition group-hover:text-light1 dark:text-dark12">
              {faq.question}
            </h3>
            <p className="mt-2 text-light11 transition group-hover:text-light1 dark:text-dark11">
              {faq.answer}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}
