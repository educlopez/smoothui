"use client"

import { motion } from "motion/react"

export function PricingCard() {
  return (
    <section className="relative flex flex-col items-center py-12">
      <h2 className="text-brand mb-8 text-center text-2xl font-bold">
        Flexible Pricing
      </h2>
      <div className="flex w-full flex-col items-center justify-center gap-8 md:flex-row">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="bg-primary text-foreground flex w-80 flex-col items-center rounded-2xl border p-8 shadow-xl transition-transform hover:scale-105"
        >
          <div className="text-brand-secondary mb-2 text-xs font-bold uppercase">
            Best Value
          </div>
          <div className="mb-2 text-3xl font-extrabold">$49/mo</div>
          <div className="text-foreground/70 mb-4 text-sm">
            For growing teams and businesses
          </div>
          <ul className="text-foreground/70 mb-6 w-full space-y-1 text-left text-xs">
            <li>✔️ Unlimited Users</li>
            <li>✔️ Advanced Analytics</li>
            <li>✔️ Priority Support</li>
          </ul>
          <button className="bg-background text-foreground hover:bg-primary-foreground hover:text-background w-full rounded border px-4 py-2 font-semibold transition">
            Start Free Trial
          </button>
        </motion.div>
      </div>
    </section>
  )
}
