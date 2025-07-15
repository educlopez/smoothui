"use client"

import { motion } from "motion/react"

export function PricingSimple() {
  return (
    <section className="relative flex flex-col items-center py-12">
      <div className="flex w-full flex-col items-center justify-center gap-8 md:flex-row">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-primary text-foreground flex w-80 flex-col items-center rounded-lg border px-8 py-6 text-center transition-transform hover:scale-105"
        >
          <div className="mb-2 text-4xl font-extrabold">$19/mo</div>
          <div className="text-foreground/70 mb-4 text-sm">
            Perfect for individuals
          </div>
          <ul className="text-foreground/70 mb-6 space-y-1 text-left text-xs">
            <li>✔️ Unlimited Projects</li>
            <li>✔️ Email Support</li>
            <li>✔️ All Features</li>
          </ul>
          <button className="bg-background text-foreground hover:bg-primary-foreground hover:text-background w-full rounded border px-4 py-2 font-semibold transition">
            Get Started
          </button>
        </motion.div>
      </div>
    </section>
  )
}
