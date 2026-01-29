"use client";

import { ChevronDown, Search } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useMemo, useState } from "react";

export type FaqSearchableProps = {
  title?: string;
  description?: string;
  searchPlaceholder?: string;
  noResultsText?: string;
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
};

const defaultFaqs = [
  {
    question: "How do I get started with SmoothUI?",
    answer:
      "Getting started is easy! Simply install the package via npm or pnpm, import the components you need, and start building. We provide comprehensive documentation and examples to help you get up and running quickly.",
  },
  {
    question: "Is SmoothUI free to use?",
    answer:
      "Yes! SmoothUI is completely free and open source. You can use it in both personal and commercial projects without any restrictions. We believe in making beautiful UI components accessible to everyone.",
  },
  {
    question: "What are the system requirements?",
    answer:
      "SmoothUI requires React 18 or later and works with Next.js 13+. You'll also need Node.js 18+ and a modern browser that supports CSS animations and transforms.",
  },
  {
    question: "Can I customize the animations?",
    answer:
      "Absolutely! All animations are fully customizable. You can modify timing, easing, and effects using Motion (Framer Motion) props. We also respect the prefers-reduced-motion setting for accessibility.",
  },
  {
    question: "How do I report bugs or issues?",
    answer:
      "You can report bugs by opening an issue on our GitHub repository. Please include a detailed description, steps to reproduce, and your environment details. We actively monitor and respond to issues.",
  },
  {
    question: "Is there enterprise support available?",
    answer:
      "Yes, we offer enterprise support packages that include priority bug fixes, dedicated support channels, custom component development, and SLA guarantees. Contact us for more information.",
  },
];

export function FaqSearchable({
  title = "Frequently Asked Questions",
  description = "Search through our FAQ to find answers to your questions",
  searchPlaceholder = "Search questions...",
  noResultsText = "No matching questions found. Try a different search term.",
  faqs = defaultFaqs,
}: FaqSearchableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const filteredFaqs = useMemo(() => {
    if (!searchQuery.trim()) {
      return faqs;
    }
    const query = searchQuery.toLowerCase();
    return faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query)
    );
  }, [faqs, searchQuery]);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const springTransition = shouldReduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, duration: 0.25, bounce: 0.05 };

  const contentTransition = shouldReduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, duration: 0.25, bounce: 0 };

  return (
    <section className="py-20">
      <div className="mx-auto max-w-4xl px-6">
        <motion.div
          animate={
            shouldReduceMotion
              ? { opacity: 1 }
              : { opacity: 1, y: 0 }
          }
          className="mb-12 text-center"
          initial={
            shouldReduceMotion
              ? { opacity: 1 }
              : { opacity: 0, y: 20 }
          }
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
          animate={
            shouldReduceMotion
              ? { opacity: 1 }
              : { opacity: 1, y: 0 }
          }
          className="relative mb-8"
          initial={
            shouldReduceMotion
              ? { opacity: 1 }
              : { opacity: 0, y: 20 }
          }
          transition={{
            ...springTransition,
            delay: shouldReduceMotion ? 0 : 0.1,
          }}
        >
          <Search className="-translate-y-1/2 absolute top-1/2 left-4 h-5 w-5 text-foreground/40" />
          <input
            aria-label="Search frequently asked questions"
            className="w-full rounded-xl border border-border bg-background py-4 pr-4 pl-12 text-foreground placeholder:text-foreground/40 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition-colors"
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setOpenIndex(null);
            }}
            placeholder={searchPlaceholder}
            type="text"
            value={searchQuery}
          />
        </motion.div>

        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredFaqs.length === 0 ? (
              <motion.div
                animate={
                  shouldReduceMotion
                    ? { opacity: 1 }
                    : { opacity: 1, scale: 1 }
                }
                className="rounded-xl border border-border bg-background/50 py-12 text-center"
                exit={
                  shouldReduceMotion
                    ? { opacity: 0, transition: { duration: 0 } }
                    : { opacity: 0, scale: 0.95 }
                }
                initial={
                  shouldReduceMotion
                    ? { opacity: 1 }
                    : { opacity: 0, scale: 0.95 }
                }
                key="no-results"
                transition={springTransition}
              >
                <p className="text-foreground/60">{noResultsText}</p>
              </motion.div>
            ) : (
              filteredFaqs.map((faq, index) => {
                const originalIndex = faqs.indexOf(faq);
                const isOpen = openIndex === originalIndex;

                return (
                  <motion.div
                    animate={
                      shouldReduceMotion
                        ? { opacity: 1 }
                        : { opacity: 1, y: 0, scale: 1 }
                    }
                    className="group overflow-hidden rounded-xl border border-border bg-background transition-colors hover:border-brand"
                    exit={
                      shouldReduceMotion
                        ? { opacity: 0, transition: { duration: 0 } }
                        : { opacity: 0, scale: 0.95, y: -10 }
                    }
                    initial={
                      shouldReduceMotion
                        ? { opacity: 1 }
                        : { opacity: 0, y: 20, scale: 0.95 }
                    }
                    key={faq.question}
                    layout={!shouldReduceMotion}
                    transition={{
                      ...springTransition,
                      delay: shouldReduceMotion ? 0 : index * 0.05,
                    }}
                  >
                    <button
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-background/50"
                      onClick={() => toggleAccordion(originalIndex)}
                      type="button"
                    >
                      <h3 className="pr-4 font-medium text-foreground">
                        {faq.question}
                      </h3>
                      <motion.div
                        animate={{
                          rotate: isOpen ? 180 : 0,
                        }}
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
                              ? { height: 0, opacity: 0, transition: { duration: 0 } }
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
              })
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

export default FaqSearchable;
