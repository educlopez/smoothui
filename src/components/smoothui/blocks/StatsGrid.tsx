"use client"

import { useRef } from "react"
import { motion, useInView } from "motion/react"

interface StatsGridProps {
  title?: string
  description?: string
  stats?: Array<{
    value: string
    label: string
    description?: string
  }>
}

export function StatsGrid({
  title = "Our Impact in Numbers",
  description = "See how we're making a difference across the globe",
  stats = [
    {
      value: "10M+",
      label: "Active Users",
      description: "Growing every day",
    },
    {
      value: "99.9%",
      label: "Uptime",
      description: "Reliable service",
    },
    {
      value: "150+",
      label: "Countries",
      description: "Worldwide reach",
    },
    {
      value: "24/7",
      label: "Support",
      description: "Always here to help",
    },
  ],
}: StatsGridProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="text-foreground mb-4 text-3xl font-bold lg:text-4xl">
            {title}
          </h2>
          <p className="text-foreground/70 mx-auto max-w-2xl text-lg">
            {description}
          </p>
        </motion.div>

        <div
          ref={ref}
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group border-border bg-background hover:border-brand relative overflow-hidden rounded-2xl border p-8 text-center transition-all hover:shadow-lg"
            >
              <motion.div
                className="text-brand mb-2 text-4xl font-bold lg:text-5xl"
                initial={{ scale: 0.5 }}
                animate={isInView ? { scale: 1 } : { scale: 0.5 }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.1 + 0.2,
                  type: "spring",
                  stiffness: 200,
                }}
              >
                {stat.value}
              </motion.div>
              <h3 className="text-foreground mb-2 text-lg font-semibold">
                {stat.label}
              </h3>
              {stat.description && (
                <p className="text-foreground/70 text-sm">{stat.description}</p>
              )}

              {/* Hover effect background */}
              <motion.div
                className="from-brand/5 absolute inset-0 bg-gradient-to-br to-transparent opacity-0 group-hover:opacity-100"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}


