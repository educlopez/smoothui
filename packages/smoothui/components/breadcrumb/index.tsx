"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { ChevronRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { SPRING_DEFAULT } from "../../lib/animation";

/** A single breadcrumb item definition. */
export type BreadcrumbItemProps = {
  /** Display label for the breadcrumb item. */
  label: ReactNode;
  /** URL the breadcrumb links to. Omit for the current (last) page. */
  href?: string;
};

export type BreadcrumbProps = {
  /** Ordered list of breadcrumb items. The last item is treated as the current page. */
  items: BreadcrumbItemProps[];
  /** Custom separator element. Defaults to a chevron icon. */
  separator?: ReactNode;
  /** Additional CSS classes for the nav element. */
  className?: string;
};

const staggerDelay = 0.04;

export default function Breadcrumb({
  items,
  separator,
  className,
}: BreadcrumbProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <nav aria-label="Breadcrumb" className={cn("inline-flex", className)}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground sm:gap-2.5">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <motion.li
              key={
                typeof item.label === "string"
                  ? item.label
                  : `breadcrumb-${String(index)}`
              }
              className="inline-flex items-center gap-1.5"
              initial={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { opacity: 0, transform: "translateX(-4px)" }
              }
              animate={{ opacity: 1, transform: "translateX(0px)" }}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : {
                      ...SPRING_DEFAULT,
                      delay: index * staggerDelay,
                    }
              }
            >
              {index > 0 && (
                <span
                  role="presentation"
                  aria-hidden="true"
                  className="mr-1.5 [&>svg]:size-3.5"
                >
                  {separator ?? <ChevronRight className="size-3.5" />}
                </span>
              )}
              {isLast ? (
                <span
                  aria-current="page"
                  className="font-normal text-foreground"
                >
                  {item.label}
                </span>
              ) : (
                <a
                  href={item.href ?? "#"}
                  className="transition-colors hover:text-foreground"
                >
                  {item.label}
                </a>
              )}
            </motion.li>
          );
        })}
      </ol>
    </nav>
  );
}
