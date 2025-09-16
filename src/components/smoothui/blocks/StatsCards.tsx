"use client"

import React, { useRef } from "react"
import { DollarSign, Smartphone, Star, Users } from "lucide-react"
import { motion, useInView } from "motion/react"

interface StatsCardsProps {
  title?: string
  description?: string
  stats?: Array<{
    value: string
    label: string
    description?: string
    icon?: string
    trend?: {
      value: string
      direction: "up" | "down"
    }
  }>
}

const iconMap = {
  DollarSign: DollarSign,
  Users: Users,
  Star: Star,
  Smartphone: Smartphone,
}

export function StatsCards({
  title = "Key Metrics",
  description = "Track your success with these important numbers",
  stats = [
    {
      value: "2.5M",
      label: "Revenue",
      description: "Annual recurring revenue",
      icon: "DollarSign",
      trend: { value: "+12%", direction: "up" },
    },
    {
      value: "45K",
      label: "Customers",
      description: "Happy customers worldwide",
      icon: "Users",
      trend: { value: "+8%", direction: "up" },
    },
    {
      value: "98%",
      label: "Satisfaction",
      description: "Customer satisfaction rate",
      icon: "Star",
      trend: { value: "+2%", direction: "up" },
    },
    {
      value: "1.2M",
      label: "Downloads",
      description: "Total app downloads",
      icon: "Smartphone",
      trend: { value: "+15%", direction: "up" },
    },
  ],
}: StatsCardsProps) {
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
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={
                isInView
                  ? { opacity: 1, y: 0, scale: 1 }
                  : { opacity: 0, y: 30, scale: 0.9 }
              }
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                type: "spring",
                stiffness: 100,
              }}
              className="group border-border from-background to-background/50 hover:border-brand relative overflow-hidden rounded-2xl border bg-gradient-to-br p-6 transition-all hover:scale-105 hover:shadow-xl"
            >
              {/* Icon */}
              <motion.div
                className="mb-4 text-3xl"
                initial={{ rotate: -10, scale: 0.8 }}
                animate={
                  isInView
                    ? { rotate: 0, scale: 1 }
                    : { rotate: -10, scale: 0.8 }
                }
                transition={{
                  duration: 0.6,
                  delay: index * 0.1 + 0.2,
                  type: "spring",
                  stiffness: 200,
                }}
              >
                {React.createElement(
                  iconMap[stat.icon as keyof typeof iconMap] || DollarSign,
                  {
                    className: "h-8 w-8",
                  }
                )}
              </motion.div>

              {/* Value */}
              <motion.div
                className="text-foreground mb-1 text-2xl font-bold lg:text-3xl"
                initial={{ scale: 0.5 }}
                animate={isInView ? { scale: 1 } : { scale: 0.5 }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.1 + 0.3,
                  type: "spring",
                  stiffness: 200,
                }}
              >
                {stat.value}
              </motion.div>

              {/* Label */}
              <h3 className="text-foreground mb-2 text-sm font-semibold tracking-wide uppercase">
                {stat.label}
              </h3>

              {/* Description */}
              {stat.description && (
                <p className="text-foreground/70 mb-3 text-xs">
                  {stat.description}
                </p>
              )}

              {/* Trend */}
              {stat.trend && (
                <motion.div
                  className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    stat.trend.direction === "up"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                      : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                  }`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={
                    isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }
                  }
                  transition={{ duration: 0.4, delay: index * 0.1 + 0.5 }}
                >
                  <span className="mr-1">
                    {stat.trend.direction === "up" ? "↗" : "↘"}
                  </span>
                  {stat.trend.value}
                </motion.div>
              )}

              {/* Hover effect background */}
              <motion.div
                className="from-brand/10 absolute inset-0 bg-gradient-to-br via-transparent to-transparent opacity-0 group-hover:opacity-100"
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
