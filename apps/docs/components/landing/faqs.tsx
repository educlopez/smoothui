"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/shadcn-ui/components/ui/accordion";
import { cn } from "@repo/shadcn-ui/lib/utils";
import Divider from "@docs/components/landing/divider";

const faqs = [
  {
    question: "Is SmoothUI free to use?",
    answer: "Yes, SmoothUI is completely free",
  },
  {
    question: "What is SmoothUI?",
    answer:
      "SmoothUI is a collection of beautifully designed React components with smooth animations, built using React, Tailwind CSS, and  It aims to provide reusable UI components that enhance user experience.",
  },
  {
    question: "What features does SmoothUI offer?",
    answer:
      "SmoothUI offers smooth animations, responsive design, easy-to-use APIs, customization with Tailwind CSS, and built-in dark mode support.",
  },
  {
    question: "How do I install SmoothUI?",
    answer:
      "Install the required dependencies using: pnpm install motion tailwindcss lucide-react clsx tailwind-merge.",
  },
  {
    question: "Can I customize the components?",
    answer:
      "Yes, you can easily customize SmoothUI components using Tailwind CSS utility classes.",
  },
  {
    question: "Does SmoothUI support dark mode?",
    answer:
      "Yes, all components support both light and dark themes out of the box.",
  },
  {
    question: "How can I contribute to SmoothUI?",
    answer:
      "You can contribute by forking the repository, creating a new branch, making your changes, and submitting a pull request on GitHub.",
  },
  // Add more FAQs...
];

export function FAQ() {
  return (
    <section className="relative w-full bg-background px-8 py-24">
      <Divider />
      <h2 className="text-balance text-center font-semibold font-title text-3xl text-foreground transition">
        Frequently Asked Questions
      </h2>
      <div className="mx-auto mt-16 max-w-3xl space-y-4">
        <Accordion
          className="-space-y-1"
          collapsible
          data-orientation="vertical"
          type="single"
        >
          {faqs.map((faq, index) => (
            <AccordionItem
              className={cn(
                "peer rounded-xl border-b border-none px-6 py-1 last:border-b-0 data-[state=open]:border-none data-[state=open]:bg-card data-[state=open]:shadow-sm data-[state=open]:ring-1 data-[state=open]:ring-foreground/5"
              )}
              key={faq.question}
              value={`item-${index}`}
            >
              <AccordionTrigger
                className={cn(
                  "flex flex-1 cursor-pointer items-start justify-between gap-4 rounded-none border-b py-4 text-left font-medium text-base outline-none transition-none hover:no-underline focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 data-[state=open]:border-transparent [&[data-state=open]>svg]:rotate-180"
                )}
              >
                {faq.question}
              </AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
