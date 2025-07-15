"use client"

import { motion } from "motion/react"

export function PricingModern() {
  return (
    <section className="relative flex flex-col items-center py-12">
      <div className="flex w-full flex-col items-center justify-center gap-8 md:flex-row">
        {/* Basic Plan */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-primary/80 border-brand-secondary relative z-10 flex w-72 flex-col items-center rounded-xl border p-8 shadow-lg backdrop-blur-md transition-transform hover:scale-105"
        >
          <div className="text-brand mb-2 text-lg font-semibold">Basic</div>
          <div className="text-foreground mb-4 text-4xl font-bold">$12/mo</div>
          <ul className="text-foreground/70 mb-6 space-y-1 text-sm">
            <li>✔️ 1 Project</li>
            <li>✔️ Email Support</li>
            <li>✔️ All Core Features</li>
          </ul>
          <button className="bg-brand text-background hover:bg-brand-secondary hover:text-background w-full rounded py-2 font-semibold transition">
            Choose Basic
          </button>
        </motion.div>
        {/* Pro Plan (Featured) */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="gradient-brand text-background border-background relative z-20 flex w-80 scale-110 flex-col items-center rounded-xl border-4 p-10 shadow-2xl transition-transform hover:scale-115"
        >
          <div className="bg-brand-secondary text-background absolute -top-4 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-bold shadow-md">
            Most Popular
          </div>
          <div className="mb-2 text-lg font-semibold">Pro</div>
          <div className="mb-4 text-5xl font-extrabold">$29/mo</div>
          <ul className="mb-6 space-y-1 text-sm">
            <li>✔️ Unlimited Projects</li>
            <li>✔️ Priority Support</li>
            <li>✔️ Team Collaboration</li>
            <li>✔️ Advanced Analytics</li>
          </ul>
          <button className="bg-background/90 text-brand hover:bg-background w-full rounded py-2 font-semibold transition">
            Choose Pro
          </button>
        </motion.div>
        {/* Enterprise Plan */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", duration: 0.7 }}
          className="bg-primary/80 border-brand-secondary relative z-10 flex w-72 flex-col items-center rounded-xl border p-8 shadow-lg backdrop-blur-md transition-transform hover:scale-105"
        >
          <div className="text-brand-secondary mb-2 text-lg font-semibold">
            Enterprise
          </div>
          <div className="text-foreground mb-4 text-4xl font-bold">Custom</div>
          <ul className="text-foreground/70 mb-6 space-y-1 text-sm">
            <li>✔️ Dedicated Manager</li>
            <li>✔️ Custom Integrations</li>
            <li>✔️ SLA & Support</li>
          </ul>
          <button className="bg-brand-secondary text-background hover:bg-brand w-full rounded py-2 font-semibold transition">
            Contact Sales
          </button>
        </motion.div>
      </div>
    </section>
  )
}
