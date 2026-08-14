"use client";

import Divider from "@docs/components/landing/divider";
import { BLOCK_COUNT, COMPONENT_COUNT } from "@docs/lib/generated/counts";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/shadcn-ui/components/ui/accordion";
import { cn } from "@repo/shadcn-ui/lib/utils";

const faqs = [
  {
    answer: `Yes, SmoothUI is completely free and open source under the MIT license. You can use all ${COMPONENT_COUNT} animated React components in personal and commercial projects without any cost. There are no premium tiers or hidden fees - every component, block, and animation is available to everyone.`,
    question: "Is SmoothUI free to use?",
  },
  {
    answer:
      "SmoothUI is a modern React component library featuring beautifully designed UI components with smooth animations. Built with React, Tailwind CSS v4, Motion (Framer Motion), and GSAP, it provides production-ready animated components that are fully compatible with shadcn/ui. Think of it as an animated extension to shadcn/ui - you get the same copy-paste workflow with added motion and interactivity.",
    question: "What is SmoothUI?",
  },
  {
    answer:
      "While shadcn/ui provides excellent static components, SmoothUI focuses on animated and interactive components. SmoothUI is designed to work alongside shadcn/ui - they share the same Tailwind CSS foundation and copy-paste philosophy. Use shadcn/ui for forms, dialogs, and basic UI, then add SmoothUI for animated cards, smooth transitions, interactive buttons, and motion effects that bring your interface to life.",
    question: "How is SmoothUI different from shadcn/ui?",
  },
  {
    answer: `SmoothUI offers ${COMPONENT_COUNT} components and ${BLOCK_COUNT} blocks including smooth animations powered by Motion (Framer Motion) and GSAP, responsive design that works on all devices, TypeScript support with full type definitions, easy customization with Tailwind CSS utility classes, built-in dark mode support, and accessibility features including reduced motion support. Components range from animated buttons and cards to complex interactive elements like Dynamic Island and expandable cards.`,
    question: "What features does SmoothUI offer?",
  },
  {
    answer:
      "Installing SmoothUI is simple with the shadcn CLI. Run 'npx shadcn@latest add https://smoothui.dev/r/component-name.json' to add any component directly to your project. You can also manually copy components from the documentation. Required dependencies include React, Tailwind CSS, Motion (framer-motion), and clsx/tailwind-merge for class utilities. Some components also use GSAP for advanced animations.",
    question: "How do I install SmoothUI components?",
  },
  {
    answer:
      "Absolutely! SmoothUI components are designed for customization. Since you own the code (it's copied into your project, not imported from node_modules), you have full control. Customize styles using Tailwind CSS utility classes, modify animations by adjusting Motion parameters, or completely restructure components to fit your needs. The code is clean, well-documented, and follows React best practices.",
    question: "Can I customize the components?",
  },
  {
    answer:
      "Yes, all SmoothUI components include full dark mode support out of the box. Components use Tailwind CSS dark mode classes and CSS variables, so they automatically adapt to your site's theme. Whether you use class-based or media-query dark mode detection, SmoothUI components will seamlessly switch between light and dark themes.",
    question: "Does SmoothUI support dark mode?",
  },
  {
    answer:
      "We welcome contributions from the community! You can contribute by forking the GitHub repository, creating a feature branch, making your changes, and submitting a pull request. Whether it's new components, bug fixes, documentation improvements, or animation enhancements, all contributions help make SmoothUI better for everyone. Check our contribution guidelines on GitHub for more details.",
    question: "How can I contribute to SmoothUI?",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
    name: faq.question,
  })),
};

export function FAQ() {
  return (
    <section className="relative w-full bg-background py-24">
      {/* Plain <script> rather than next/script: `beforeInteractive` is only
          honoured inside the root layout, and Next's own guidance for JSON-LD
          is to render the tag directly. */}
      <script
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Schema.org JSON-LD structured data requires innerHTML
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
        id="faq-schema"
        type="application/ld+json"
      />
      <Divider />
      <div className="mx-auto w-full max-w-7xl px-8">
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
      </div>
    </section>
  );
}
