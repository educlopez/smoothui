"use client"

import { motion, AnimatePresence } from "motion/react"
import { useState } from "react"

interface FaqsAccordionProps {
  title?: string
  description?: string
  faqs?: Array<{
    question: string
    answer: string
  }>
}

export function FaqsAccordion({
  title = "Frequently Asked Questions",
  description = "Find answers to common questions about our product and services",
  faqs = [
    {
      question: "What is Smoothui?",
      answer: "Smoothui is a modern UI component library that provides beautiful, animated components for building stunning user interfaces. It includes pre-built components with smooth animations and customizable themes.",
    },
    {
      question: "How do I get started?",
      answer: "Getting started is easy! Simply install the package via npm or yarn, import the components you need, and start building. We provide comprehensive documentation and examples to help you get up and running quickly.",
    },
    {
      question: "Is it free to use?",
      answer: "Yes! Smoothui is completely free and open source. You can use it in both personal and commercial projects without any restrictions. We believe in making beautiful UI components accessible to everyone.",
    },
    {
      question: "Can I customize the components?",
      answer: "Absolutely! All components are fully customizable. You can modify colors, spacing, animations, and more using CSS variables or by extending the component classes. We also provide a theming system for easy customization.",
    },
    {
      question: "What frameworks are supported?",
      answer: "Currently, Smoothui supports React and Next.js. We're working on expanding support to other popular frameworks like Vue, Svelte, and Angular in the coming months.",
    },
    {
      question: "How often do you release updates?",
      answer: "We release updates regularly, typically every 2-3 weeks. This includes new components, bug fixes, performance improvements, and new features. You can follow our changelog to stay updated on the latest releases.",
    },
  ],
}: FaqsAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-20">
      <div className="mx-auto max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-foreground mb-4 text-3xl font-bold lg:text-4xl">
            {title}
          </h2>
          <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
            {description}
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group overflow-hidden rounded-2xl border border-border bg-background transition-all hover:border-brand hover:shadow-lg"
            >
              <motion.button
                onClick={() => toggleAccordion(index)}
                className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-background/50"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <h3 className="text-foreground text-lg font-semibold pr-4">
                  {faq.question}
                </h3>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="flex-shrink-0"
                >
                  <svg
                    className="h-5 w-5 text-foreground/60"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <motion.div
                      initial={{ y: -10 }}
                      animate={{ y: 0 }}
                      exit={{ y: -10 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                      className="px-6 pb-6"
                    >
                      <p className="text-foreground/70 leading-relaxed">
                        {faq.answer}
                      </p>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}


