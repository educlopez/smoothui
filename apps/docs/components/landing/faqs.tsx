"use client";

import { faqs } from "@docs/components/landing/faqs-data";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/shadcn-ui/components/ui/accordion";
import { cn } from "@repo/shadcn-ui/lib/utils";

export function FAQ() {
  return (
    <section className="relative w-full bg-background px-8 py-24">
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
