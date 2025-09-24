"use client"

import { useState } from "react"
import { motion } from "motion/react"

import PriceFlow from "@/components/smoothui/ui/PriceFlow"

export function PricingSimple() {
  const [isAnnual, setIsAnnual] = useState(true)

  return (
    <section>
      <div className="bg-muted/50 relative py-16 md:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-balance md:text-4xl lg:text-5xl lg:tracking-tight">
              Simple pricing for everyone
            </h2>
            <p className="text-foreground/70 mx-auto mt-4 max-w-xl text-lg text-balance">
              One plan, all features. No hidden fees, no complicated tiers.
            </p>
            <div className="my-12">
              <div
                data-period={isAnnual ? "annually" : "monthly"}
                className="bg-background *:text-foreground relative mx-auto grid w-fit grid-cols-2 rounded-full border p-1 *:block *:h-8 *:w-24 *:rounded-full *:text-sm *:hover:opacity-75"
              >
                <div
                  aria-hidden="true"
                  className={`bg-brand ring-foreground/5 pointer-events-none absolute inset-1 w-1/2 rounded-full border border-transparent shadow ring-1 transition-transform duration-500 ease-in-out ${
                    isAnnual ? "translate-x-full" : "translate-x-0"
                  }`}
                ></div>
                <button
                  type="button"
                  onClick={() => setIsAnnual(false)}
                  data-active={!isAnnual}
                  className="relative duration-500 data-[active=true]:font-medium data-[active=true]:text-white"
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setIsAnnual(true)}
                  data-active={isAnnual}
                  className="relative duration-500 data-[active=true]:font-medium data-[active=true]:text-white"
                >
                  Annually
                </button>
              </div>
              <div className="mt-3 text-center text-xs">
                <span className="text-brand font-medium">Save 20%</span> On
                Annual Billing
              </div>
            </div>
          </div>
          <div className="container">
            <div className="mx-auto max-w-md">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="group bg-background relative flex h-[650px] cursor-pointer flex-col overflow-hidden rounded-2xl border p-8"
                data-animate-card
              >
                {/* Gradient Accent */}
                <div className="gradient-accent absolute top-0 right-0 h-4 w-32 rounded-bl-2xl bg-gradient-to-r from-green-400 via-blue-400 to-purple-400" />

                <div className="card-content relative z-10 flex h-full flex-col">
                  {/* Title */}
                  <h3 className="text-foreground mb-4 text-2xl font-bold">
                    Pro
                  </h3>

                  {/* Price & Duration */}
                  <div className="mb-6">
                    <span className="text-foreground text-3xl font-semibold">
                      <PriceFlow value={isAnnual ? 15 : 19} />€
                    </span>
                    <span className="text-foreground/70 mx-2">•</span>
                    <span className="text-foreground/70">
                      Perfect for individuals
                    </span>
                  </div>

                  {/* CTA Button */}
                  <button
                    type="button"
                    className="bg-foreground text-background hover:bg-foreground/90 focus-visible:ring-ring mb-6 inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                  >
                    Get Started
                  </button>

                  {/* Description */}
                  <p className="text-foreground/70 mb-6 flex-grow text-sm leading-relaxed">
                    Everything you need to build and deploy amazing
                    applications. Simple, powerful, and affordable.
                  </p>

                  {/* What's Included */}
                  <div className="space-y-4">
                    <h4 className="text-foreground/70 text-xs font-medium tracking-wider uppercase">
                      What&apos;s included:
                    </h4>
                    <ul className="space-y-3">
                      {[
                        "Unlimited Projects",
                        "Email Support",
                        "All Features",
                        "Advanced Analytics",
                        "Team Collaboration",
                        "Custom Domains",
                        "Priority Updates",
                        "API Access",
                      ].map((item) => (
                        <li
                          className="text-foreground flex items-center gap-3 text-sm"
                          key={item}
                        >
                          <div className="bg-foreground flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full">
                            <svg
                              className="text-background h-2 w-2"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              aria-hidden="true"
                            >
                              <path
                                clipRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                fillRule="evenodd"
                              />
                            </svg>
                          </div>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
