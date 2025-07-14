"use client"

import { motion } from "motion/react"

export function PricingMulti() {
  const plans = [
    {
      title: "Starter",
      price: "$9",
      features: ["Basic Support", "1 Project"],
      highlight: false,
    },
    {
      title: "Pro",
      price: "$29",
      features: ["Priority Support", "Unlimited Projects", "Team Access"],
      highlight: true,
    },
    {
      title: "Enterprise",
      price: "Contact Us",
      features: ["Dedicated Manager", "Custom Integrations"],
      highlight: false,
    },
  ]
  return (
    <section className="relative flex flex-col items-center py-12">
      <h2 className="text-brand mb-8 text-center text-2xl font-bold">
        Choose Your Plan
      </h2>
      <div className="flex w-full flex-col items-center justify-center gap-8 md:flex-row">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.title}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.1, type: "spring", duration: 0.5 }}
            className={`flex w-72 flex-col items-center rounded-lg p-6 text-center shadow-md transition-all hover:scale-105 ${plan.highlight ? "gradient-brand text-background border-brand-secondary scale-110 shadow-xl outline-2" : "bg-background text-foreground border-brand-secondary border"}`}
          >
            {plan.highlight && (
              <div className="text-brand-secondary mb-2 text-xs font-bold uppercase">
                Most Popular
              </div>
            )}
            <div className="mb-2 text-xl font-bold">{plan.title}</div>
            <div className="mb-4 text-3xl font-extrabold">
              {plan.price}
              {plan.price !== "Contact Us" && (
                <span className="text-base font-normal">/mo</span>
              )}
            </div>
            <ul className="text-foreground/70 mb-6 inline-block space-y-1 text-left text-xs">
              {plan.features.map((f) => (
                <li key={f}>✔️ {f}</li>
              ))}
            </ul>
            <button
              className={`${plan.highlight ? "bg-background text-foreground" : "bg-brand text-background"} hover:bg-brand-secondary hover:text-background w-full rounded border px-4 py-2 font-semibold transition`}
            >
              Select
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
