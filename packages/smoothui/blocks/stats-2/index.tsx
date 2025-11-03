"use client";

import { DollarSign, Smartphone, Star, Users } from "lucide-react";
import { motion, useInView } from "motion/react";
import React, { useRef } from "react";

const STAGGER_DELAY = 0.1;
const ICON_STAGGER_OFFSET = 0.2;
const VALUE_DELAY_OFFSET = 0.3;
const TREND_STAGGER_OFFSET = 0.5;

type StatsCardsProps = {
  title?: string;
  description?: string;
  stats?: Array<{
    value: string;
    label: string;
    description?: string;
    icon?: string;
    trend?: {
      value: string;
      direction: "up" | "down";
    };
  }>;
};

const iconMap = {
  DollarSign,
  Users,
  Star,
  Smartphone,
};

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
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <h2 className="mb-4 font-bold text-3xl text-foreground lg:text-4xl">
            {title}
          </h2>
          <p className="mx-auto max-w-2xl text-foreground/70 text-lg">
            {description}
          </p>
        </motion.div>

        <div
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
          ref={ref}
        >
          {stats.map((stat, index) => (
            <motion.div
              animate={
                isInView
                  ? { opacity: 1, y: 0, scale: 1 }
                  : { opacity: 0, y: 30, scale: 0.9 }
              }
              className="group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-background to-background/50 p-6 transition-all hover:scale-105 hover:border-brand hover:shadow-xl"
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              key={stat.label}
              transition={{
                duration: 0.6,
                delay: index * STAGGER_DELAY,
                type: "spring",
                stiffness: 100,
              }}
            >
              {/* Icon */}
              <motion.div
                animate={
                  isInView
                    ? { rotate: 0, scale: 1 }
                    : { rotate: -10, scale: 0.8 }
                }
                className="mb-4 text-3xl"
                initial={{ rotate: -10, scale: 0.8 }}
                transition={{
                  duration: 0.6,
                  delay: index * STAGGER_DELAY + ICON_STAGGER_OFFSET,
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
                animate={isInView ? { scale: 1 } : { scale: 0.5 }}
                className="mb-1 font-bold text-2xl text-foreground lg:text-3xl"
                initial={{ scale: 0.5 }}
                transition={{
                  duration: 0.8,
                  delay: index * STAGGER_DELAY + VALUE_DELAY_OFFSET,
                  type: "spring",
                  stiffness: 200,
                }}
              >
                {stat.value}
              </motion.div>

              {/* Label */}
              <h3 className="mb-2 font-semibold text-foreground text-sm uppercase tracking-wide">
                {stat.label}
              </h3>

              {/* Description */}
              {stat.description && (
                <p className="mb-3 text-foreground/70 text-xs">
                  {stat.description}
                </p>
              )}

              {/* Trend */}
              {stat.trend && (
                <motion.div
                  animate={
                    isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }
                  }
                  className={`inline-flex items-center rounded-full px-2 py-1 font-medium text-xs ${
                    stat.trend.direction === "up"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                      : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                  }`}
                  initial={{ opacity: 0, x: -10 }}
                  transition={{
                    duration: 0.4,
                    delay: index * STAGGER_DELAY + TREND_STAGGER_OFFSET,
                  }}
                >
                  <span className="mr-1">
                    {stat.trend.direction === "up" ? "↗" : "↘"}
                  </span>
                  {stat.trend.value}
                </motion.div>
              )}

              {/* Hover effect background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-brand/10 via-transparent to-transparent opacity-0 group-hover:opacity-100"
                initial={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ opacity: 1 }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default StatsCards;
