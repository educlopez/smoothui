"use client";

import {
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionRoot,
  AccordionTrigger,
} from "@repo/smoothui/components/accordion";
import { motion, useReducedMotion } from "motion/react";

const ANIMATION_DURATION = 0.6;
const STAGGER_DELAY = 0.1;
const INITIAL_Y_OFFSET = 20;
const HOVER_SCALE = 1.01;
const TAP_SCALE = 0.99;

interface FaqsAccordionProps {
  description?: string;
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
  title?: string;
}

export function FaqsAccordion({
  title = "Frequently Asked Questions",
  description = "Find answers to common questions about our product and services",
  faqs = [
    {
      answer:
        "Smoothui is a modern UI component library that provides beautiful, animated components for building stunning user interfaces. It includes pre-built components with smooth animations and customizable themes.",
      question: "What is Smoothui?",
    },
    {
      answer:
        "Getting started is easy! Simply install the package via npm or yarn, import the components you need, and start building. We provide comprehensive documentation and examples to help you get up and running quickly.",
      question: "How do I get started?",
    },
    {
      answer:
        "Yes! Smoothui is completely free and open source. You can use it in both personal and commercial projects without any restrictions. We believe in making beautiful UI components accessible to everyone.",
      question: "Is it free to use?",
    },
    {
      answer:
        "Absolutely! All components are fully customizable. You can modify colors, spacing, animations, and more using CSS variables or by extending the component classes. We also provide a theming system for easy customization.",
      question: "Can I customize the components?",
    },
    {
      answer:
        "Currently, Smoothui supports React and Next.js. We're working on expanding support to other popular frameworks like Vue, Svelte, and Angular in the coming months.",
      question: "What frameworks are supported?",
    },
    {
      answer:
        "We release updates regularly, typically every 2-3 weeks. This includes new components, bug fixes, performance improvements, and new features. You can follow our changelog to stay updated on the latest releases.",
      question: "How often do you release updates?",
    },
  ],
}: FaqsAccordionProps) {
  const shouldReduceMotion = useReducedMotion();
  const firstQuestion = faqs[0]?.question;

  return (
    <section className="py-20">
      <div className="mx-auto max-w-4xl px-6">
        <motion.div
          animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          className="mb-16 text-center"
          initial={
            shouldReduceMotion
              ? { opacity: 1 }
              : { opacity: 0, y: INITIAL_Y_OFFSET }
          }
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { duration: ANIMATION_DURATION }
          }
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

        <AccordionRoot
          className="space-y-4 divide-y-0 overflow-visible rounded-none border-0"
          defaultValue={firstQuestion ? [firstQuestion] : undefined}
        >
          {faqs.map((faq, index) => (
            <motion.div
              animate={
                shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }
              }
              initial={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { opacity: 0, y: INITIAL_Y_OFFSET }
              }
              key={faq.question}
              tabIndex={-1}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : {
                      delay: index * STAGGER_DELAY,
                      duration: ANIMATION_DURATION,
                    }
              }
              viewport={{ once: true }}
              whileHover={shouldReduceMotion ? {} : { scale: HOVER_SCALE }}
              whileInView={
                shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }
              }
              whileTap={shouldReduceMotion ? {} : { scale: TAP_SCALE }}
            >
              <AccordionItem
                className="overflow-hidden rounded-2xl border border-border bg-background transition-all hover:border-brand hover:shadow-lg"
                value={faq.question}
              >
                <AccordionHeader>
                  <AccordionTrigger className="p-6 text-left font-semibold text-foreground text-lg hover:bg-background/50">
                    {faq.question}
                  </AccordionTrigger>
                </AccordionHeader>
                <AccordionPanel className="text-base text-foreground/70">
                  <p className="-mx-4 -mb-4 px-6 pb-6 text-base leading-relaxed">
                    {faq.answer}
                  </p>
                </AccordionPanel>
              </AccordionItem>
            </motion.div>
          ))}
        </AccordionRoot>
      </div>
    </section>
  );
}

export default FaqsAccordion;
