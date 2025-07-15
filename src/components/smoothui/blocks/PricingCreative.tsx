"use client"

import { motion } from "motion/react"

export function PricingCreative() {
  return (
    <section className="relative flex flex-col items-center py-12">
      <div className="flex flex-col items-center justify-center gap-8 md:flex-row">
        {/* Starter Card */}
        <motion.div
          initial={{ opacity: 0, y: 40, rotate: -6 }}
          animate={{ opacity: 1, y: 0, rotate: -6 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-background border-brand-secondary relative z-10 flex w-72 flex-col items-center rounded-2xl border-2 px-8 py-10 shadow-2xl transition-transform hover:scale-105"
        >
          <div className="text-brand mb-2 text-lg font-bold">Starter</div>
          <div className="text-foreground mb-4 text-3xl font-extrabold">
            $5/mo
          </div>
          <ul className="text-foreground/70 mb-6 space-y-1 text-sm">
            <li>✔️ 1 Project</li>
            <li>✔️ Email Support</li>
          </ul>
          <button className="bg-brand text-background hover:bg-brand-secondary hover:text-background w-full rounded py-2 font-semibold transition">
            Start Now
          </button>
        </motion.div>
        {/* Creative Pro Card (Floating) */}
        <motion.div
          initial={{ opacity: 0, y: 60, rotate: 0 }}
          animate={{ opacity: 1, y: -20, rotate: 0 }}
          transition={{ type: "spring", duration: 0.7 }}
          className="gradient-brand text-background border-background relative z-20 flex w-80 scale-110 flex-col items-center rounded-3xl border-4 px-10 py-14 shadow-2xl transition-transform hover:scale-115"
        >
          <motion.div
            animate={{ y: [10, 6, 10] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="bg-background text-brand border-brand-secondary absolute -top-6 left-1/2 -translate-x-1/2 rounded-full border-2 px-5 py-1 text-xs font-extrabold shadow-md"
          >
            Best Deal
          </motion.div>
          <div className="mb-2 text-lg font-bold">Creative Pro</div>
          <div className="mb-4 text-5xl font-black">$19/mo</div>
          <ul className="mb-6 space-y-1 text-base">
            <li>✔️ Unlimited Projects</li>
            <li>✔️ Priority Support</li>
            <li>✔️ Team Collaboration</li>
            <li>✔️ Early Access</li>
          </ul>
          <button className="bg-background/90 text-brand hover:bg-background w-full rounded py-2 font-bold transition">
            Go Pro
          </button>
        </motion.div>
        {/* Enterprise Card */}
        <motion.div
          initial={{ opacity: 0, y: 40, rotate: 6 }}
          animate={{ opacity: 1, y: 0, rotate: 6 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="bg-background border-brand-secondary relative z-10 flex w-72 flex-col items-center rounded-2xl border-2 px-8 py-10 shadow-2xl transition-transform hover:scale-105"
        >
          <div className="text-brand-secondary mb-2 text-lg font-bold">
            Enterprise
          </div>
          <div className="text-foreground mb-4 text-3xl font-extrabold">
            Custom
          </div>
          <ul className="text-foreground/70 mb-6 space-y-1 text-sm">
            <li>✔️ Dedicated Manager</li>
            <li>✔️ Custom Integrations</li>
            <li>✔️ SLA & Support</li>
          </ul>
          <button className="bg-brand-secondary text-background hover:bg-brand w-full rounded py-2 font-semibold transition">
            Contact Us
          </button>
        </motion.div>
      </div>
    </section>
  )
}
