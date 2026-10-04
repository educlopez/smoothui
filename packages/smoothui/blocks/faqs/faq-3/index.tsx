"use client";

import {
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionRoot,
  AccordionTrigger,
} from "@repo/smoothui/components/accordion";
import { Search } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useMemo, useState } from "react";

export interface FaqSearchableProps {
  description?: string;
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
  noResultsText?: string;
  searchPlaceholder?: string;
  title?: string;
}

const defaultFaqs = [
  {
    answer:
      "Getting started is easy! Simply install the package via npm or pnpm, import the components you need, and start building. We provide comprehensive documentation and examples to help you get up and running quickly.",
    question: "How do I get started with SmoothUI?",
  },
  {
    answer:
      "Yes! SmoothUI is completely free and open source. You can use it in both personal and commercial projects without any restrictions. We believe in making beautiful UI components accessible to everyone.",
    question: "Is SmoothUI free to use?",
  },
  {
    answer:
      "SmoothUI requires React 18 or later and works with Next.js 13+. You'll also need Node.js 18+ and a modern browser that supports CSS animations and transforms.",
    question: "What are the system requirements?",
  },
  {
    answer:
      "Absolutely! All animations are fully customizable. You can modify timing, easing, and effects using Motion (Framer Motion) props. We also respect the prefers-reduced-motion setting for accessibility.",
    question: "Can I customize the animations?",
  },
  {
    answer:
      "You can report bugs by opening an issue on our GitHub repository. Please include a detailed description, steps to reproduce, and your environment details. We actively monitor and respond to issues.",
    question: "How do I report bugs or issues?",
  },
  {
    answer:
      "Yes, we offer enterprise support packages that include priority bug fixes, dedicated support channels, custom component development, and SLA guarantees. Contact us for more information.",
    question: "Is there enterprise support available?",
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

  const springTransition = shouldReduceMotion
    ? { duration: 0 }
    : { bounce: 0.05, duration: 0.25, type: "spring" as const };

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
          className="relative mb-8"
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          transition={{
            ...springTransition,
            delay: shouldReduceMotion ? 0 : 0.1,
          }}
        >
          <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-foreground/40" />
          <input
            aria-label="Search frequently asked questions"
            className="w-full rounded-xl border border-border bg-background py-4 pr-4 pl-12 text-foreground transition-colors placeholder:text-foreground/40 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            placeholder={searchPlaceholder}
            type="text"
            value={searchQuery}
          />
        </motion.div>

        {filteredFaqs.length === 0 ? (
          <div className="rounded-xl border border-border bg-background/50 py-12 text-center">
            <p className="text-foreground/60">{noResultsText}</p>
          </div>
        ) : (
          <AccordionRoot
            className="space-y-4 divide-y-0 rounded-none border-0"
            key={searchQuery}
          >
            {filteredFaqs.map((faq) => (
              <AccordionItem
                className="overflow-hidden rounded-xl border border-border bg-background transition-colors hover:border-brand"
                key={faq.question}
                value={faq.question}
              >
                <AccordionHeader>
                  <AccordionTrigger className="px-5 py-5 text-base hover:bg-background/50">
                    {faq.question}
                  </AccordionTrigger>
                </AccordionHeader>
                <AccordionPanel className="text-foreground/70">
                  {faq.answer}
                </AccordionPanel>
              </AccordionItem>
            ))}
          </AccordionRoot>
        )}
      </div>
    </section>
  );
}

export default FaqSearchable;
