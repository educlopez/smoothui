"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";

const STAGGER_DELAY = 0.1;
const VALUE_DELAY_OFFSET = 0.2;

interface StatsGridProps {
  title?: string;
  description?: string;
  stats?: Array<{
    value: string;
    label: string;
    description?: string;
  }>;
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
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4"
          ref={ref}
        >
          {stats.map((stat, index) => (
            <motion.div
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-background p-8 text-center transition-all hover:border-brand hover:shadow-lg"
              initial={{ opacity: 0, y: 30 }}
              key={stat.label}
              transition={{ duration: 0.6, delay: index * STAGGER_DELAY }}
            >
              <motion.div
                animate={isInView ? { scale: 1 } : { scale: 0.5 }}
                className="mb-2 font-bold text-4xl text-brand lg:text-5xl"
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
              <h3 className="mb-2 font-semibold text-foreground text-lg">
                {stat.label}
              </h3>
              {stat.description && (
                <p className="text-foreground/70 text-sm">{stat.description}</p>
              )}
              {/* Hover effect background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-brand/5 to-transparent opacity-0 group-hover:opacity-100"
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

export default StatsGrid;
