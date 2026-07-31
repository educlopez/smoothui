"use client";

import { DollarSign, Smartphone, Star, Users } from "lucide-react";
import { motion, useInView, useReducedMotion } from "motion/react";
import React, { useRef } from "react";

const STAGGER_DELAY = 0.1;
const ICON_STAGGER_OFFSET = 0.2;
const VALUE_DELAY_OFFSET = 0.3;
const TREND_STAGGER_OFFSET = 0.5;

interface StatsCardsProps {
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
  title?: string;
}

const iconMap = {
  DollarSign,
  Smartphone,
  Star,
  Users,
};

export function StatsCards({
  title = "Key Metrics",
  description = "Track your success with these important numbers",
  stats = [
    {
      description: "Annual recurring revenue",
      icon: "DollarSign",
      label: "Revenue",
      trend: { direction: "up", value: "+12%" },
      value: "2.5M",
    },
    {
      description: "Happy customers worldwide",
      icon: "Users",
      label: "Customers",
      trend: { direction: "up", value: "+8%" },
      value: "45K",
    },
    {
      description: "Customer satisfaction rate",
      icon: "Star",
      label: "Satisfaction",
      trend: { direction: "up", value: "+2%" },
      value: "98%",
    },
    {
      description: "Total app downloads",
      icon: "Smartphone",
      label: "Downloads",
      trend: { direction: "up", value: "+15%" },
      value: "1.2M",
    },
  ],
}: StatsCardsProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          className="mb-16 text-center"
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.6 }}
          viewport={{ once: true }}
          whileInView={
            shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }
          }
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
              animate={(() => {
                if (shouldReduceMotion) {
                  return { opacity: 1 };
                }
                return isInView
                  ? { opacity: 1, scale: 1, y: 0 }
                  : { opacity: 0, scale: 0.9, y: 30 };
              })()}
              className="group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-background to-background/50 p-6 transition-all hover:scale-105 hover:border-brand hover:shadow-xl"
              initial={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { opacity: 0, scale: 0.9, y: 30 }
              }
              key={stat.label}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : {
                      delay: index * STAGGER_DELAY,
                      duration: 0.6,
                      stiffness: 100,
                      type: "spring" as const,
                    }
              }
            >
              {/* Icon */}
              <motion.div
                animate={(() => {
                  if (shouldReduceMotion) {
                    return { rotate: 0, scale: 1 };
                  }
                  return isInView
                    ? { rotate: 0, scale: 1 }
                    : { rotate: -10, scale: 0.8 };
                })()}
                className="mb-4 text-3xl"
                initial={
                  shouldReduceMotion
                    ? { rotate: 0, scale: 1 }
                    : { rotate: -10, scale: 0.8 }
                }
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : {
                        delay: index * STAGGER_DELAY + ICON_STAGGER_OFFSET,
                        duration: 0.6,
                        stiffness: 200,
                        type: "spring" as const,
                      }
                }
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
                animate={(() => {
                  if (shouldReduceMotion) {
                    return { scale: 1 };
                  }
                  return isInView ? { scale: 1 } : { scale: 0.5 };
                })()}
                className="mb-1 font-bold text-2xl text-foreground lg:text-3xl"
                initial={shouldReduceMotion ? { scale: 1 } : { scale: 0.5 }}
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : {
                        delay: index * STAGGER_DELAY + VALUE_DELAY_OFFSET,
                        duration: 0.8,
                        stiffness: 200,
                        type: "spring" as const,
                      }
                }
              >
                {stat.value}
              </motion.div>

              {/* Label */}
              <h3 className="mb-2 font-semibold text-foreground text-sm uppercase tracking-wide">
                {stat.label}
              </h3>

              {/* Description */}
              {stat.description ? (
                <p className="mb-3 text-foreground/70 text-xs">
                  {stat.description}
                </p>
              ) : null}

              {/* Trend */}
              {stat.trend ? (
                <motion.div
                  animate={(() => {
                    if (shouldReduceMotion) {
                      return { opacity: 1 };
                    }
                    return isInView
                      ? { opacity: 1, x: 0 }
                      : { opacity: 0, x: -10 };
                  })()}
                  className={`inline-flex items-center rounded-full px-2 py-1 font-medium text-xs ${
                    stat.trend.direction === "up"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                      : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                  }`}
                  initial={
                    shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: -10 }
                  }
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : {
                          delay: index * STAGGER_DELAY + TREND_STAGGER_OFFSET,
                          duration: 0.4,
                        }
                  }
                >
                  <span className="mr-1">
                    {stat.trend.direction === "up" ? "↗" : "↘"}
                  </span>
                  {stat.trend.value}
                </motion.div>
              ) : null}

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
