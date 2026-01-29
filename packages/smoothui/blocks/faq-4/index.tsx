"use client";

import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";

export type FaqCategorizedProps = {
  title?: string;
  description?: string;
  categories?: Array<{
    name: string;
    faqs: Array<{
      question: string;
      answer: string;
    }>;
  }>;
};

const defaultCategories = [
  {
    name: "Getting Started",
    faqs: [
      {
        question: "How do I set up SmoothUI in my project?",
        answer:
          "Setting up SmoothUI is straightforward. Install the package using npm or pnpm, then import the components you need. Our CLI tool can also help scaffold components directly into your project with the right dependencies.",
      },
      {
        question: "What are the minimum requirements?",
        answer:
          "SmoothUI requires React 18 or later, Next.js 13+, and Node.js 18+. You'll also need Tailwind CSS configured in your project. All modern browsers are supported.",
      },
      {
        question: "How do I add my first component?",
        answer:
          "Use our CLI command `npx shadcn@latest add @smoothui/component-name` to add any component. This will install the component with all its dependencies and place it in your components directory.",
      },
    ],
  },
  {
    name: "Billing",
    faqs: [
      {
        question: "Is SmoothUI free to use?",
        answer:
          "Yes, SmoothUI is completely free and open source under the MIT license. You can use it in personal and commercial projects without any cost or attribution requirements.",
      },
      {
        question: "Do you offer refunds?",
        answer:
          "Since SmoothUI is free, there are no purchases to refund. For any premium services or support packages we may offer in the future, our refund policy will be clearly stated.",
      },
      {
        question: "What payment methods do you accept?",
        answer:
          "Currently, all components are free. If we introduce premium features, we'll support major credit cards, PayPal, and other popular payment methods through our secure payment processor.",
      },
    ],
  },
  {
    name: "Technical",
    faqs: [
      {
        question: "Which browsers are supported?",
        answer:
          "SmoothUI supports all modern browsers including Chrome, Firefox, Safari, and Edge. We test across the latest versions and one version back for each browser to ensure compatibility.",
      },
      {
        question: "How does SmoothUI affect performance?",
        answer:
          "Components are optimized for performance with tree-shaking support, minimal bundle size, and hardware-accelerated animations. We only animate transform and opacity properties to ensure 60fps animations.",
      },
      {
        question: "Is TypeScript supported?",
        answer:
          "Absolutely! SmoothUI is built with TypeScript and provides full type definitions for all components. You get autocomplete, type checking, and inline documentation in supported editors.",
      },
      {
        question: "Can I customize component styles?",
        answer:
          "Yes, all components use Tailwind CSS and CSS variables for styling. You can override styles using className props, customize the design tokens, or modify the component source directly.",
      },
    ],
  },
];

export function FaqCategorized({
  title = "Frequently Asked Questions",
  description = "Find answers organized by topic",
  categories = defaultCategories,
}: FaqCategorizedProps) {
  const [activeCategory, setActiveCategory] = useState(0);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const springTransition = shouldReduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, duration: 0.25, bounce: 0.05 };

  const contentTransition = shouldReduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, duration: 0.25, bounce: 0 };

  const handleCategoryChange = (index: number) => {
    setActiveCategory(index);
    setOpenIndex(null);
  };

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20">
      <div className="mx-auto max-w-4xl px-6">
        <motion.div
          animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          className="mb-12 text-center"
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          transition={springTransition}
        >
          <h2 className="mb-4 font-bold text-3xl text-foreground lg:text-4xl">
            {title}
          </h2>
          <p className="mx-auto max-w-2xl text-foreground/70 text-lg">
            {description}
          </p>
        </motion.div>

        <motion.div
          animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          className="mb-8"
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          transition={{
            ...springTransition,
            delay: shouldReduceMotion ? 0 : 0.1,
          }}
        >
          <div
            className="flex flex-wrap justify-center gap-2 border-border border-b"
            role="tablist"
          >
            {categories.map((category, index) => (
              <button
                aria-selected={activeCategory === index}
                className={`relative px-4 py-3 font-medium text-sm transition-colors ${
                  activeCategory === index
                    ? "text-brand"
                    : "text-foreground/60 hover:text-foreground"
                }`}
                key={category.name}
                onClick={() => handleCategoryChange(index)}
                role="tab"
                type="button"
              >
                {category.name}
                {activeCategory === index && (
                  <motion.div
                    className="absolute right-0 bottom-0 left-0 h-0.5 bg-brand"
                    layoutId="categoryIndicator"
                    transition={springTransition}
                  />
                )}
              </button>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={
              shouldReduceMotion
                ? { opacity: 0, transition: { duration: 0 } }
                : { opacity: 0, y: -10 }
            }
            initial={
              shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }
            }
            key={activeCategory}
            transition={springTransition}
          >
            <div className="space-y-4">
              {categories[activeCategory].faqs.map((faq, index) => {
                const isOpen = openIndex === index;

                return (
                  <motion.div
                    animate={
                      shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }
                    }
                    className="overflow-hidden rounded-xl border border-border bg-background transition-colors hover:border-brand"
                    initial={
                      shouldReduceMotion
                        ? { opacity: 1 }
                        : { opacity: 0, y: 20 }
                    }
                    key={faq.question}
                    transition={{
                      ...springTransition,
                      delay: shouldReduceMotion ? 0 : index * 0.05,
                    }}
                  >
                    <button
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-background/50"
                      onClick={() => toggleAccordion(index)}
                      type="button"
                    >
                      <h3 className="pr-4 font-medium text-foreground">
                        {faq.question}
                      </h3>
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        className="flex-shrink-0"
                        transition={springTransition}
                      >
                        <ChevronDown
                          aria-hidden="true"
                          className="h-5 w-5 text-foreground/60"
                        />
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          animate={
                            shouldReduceMotion
                              ? { height: "auto", opacity: 1 }
                              : { height: "auto", opacity: 1 }
                          }
                          className="overflow-hidden"
                          exit={
                            shouldReduceMotion
                              ? {
                                  height: 0,
                                  opacity: 0,
                                  transition: { duration: 0 },
                                }
                              : { height: 0, opacity: 0 }
                          }
                          initial={
                            shouldReduceMotion
                              ? { height: "auto", opacity: 1 }
                              : { height: 0, opacity: 0 }
                          }
                          transition={contentTransition}
                        >
                          <div className="px-5 pb-5">
                            <p className="text-foreground/70 leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

export default FaqCategorized;
