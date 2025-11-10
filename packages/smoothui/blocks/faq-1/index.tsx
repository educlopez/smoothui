"use client";

import {
  Activity,
  Clock,
  DollarSign,
  Download,
  Globe,
  HelpCircle,
  Lock,
  MessageCircle,
  Scale,
  Settings,
  ShoppingBag,
  Undo2,
  Users,
  WalletCards,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const ANIMATION_DURATION = 0.3;
const SPRING_STIFFNESS = 500;
const SPRING_DAMPING = 30;
const HOVER_SCALE = 1.02;
const TAP_SCALE = 0.98;
const FAQ_STAGGER_DELAY = 0.1;
const INITIAL_Y_OFFSET = 20;
const EXIT_Y_OFFSET = -20;

const iconMap = {
  Clock,
  WalletCards,
  ShoppingBag,
  Globe,
  Scale,
  Activity,
  DollarSign,
  Lock,
  Undo2,
  Download,
  Settings,
  HelpCircle,
  MessageCircle,
  Users,
  Zap,
};

type FaqsGridProps = {
  title?: string;
  description?: string;
  categories?: Array<{
    name: string;
    id: string;
    faqs: Array<{
      question: string;
      answer: string;
      icon: string;
    }>;
  }>;
};

export function FaqsGrid({
  title = "FAQs",
  description = "Discover quick and comprehensive answers to common questions about our platform, services, and features.",
  categories = [
    {
      name: "General",
      id: "general",
      faqs: [
        {
          question: "How do I install Smoothui?",
          answer:
            "You can install Smoothui using npm or yarn. Run `npm install smoothui` or `yarn add smoothui` in your project directory. It's completely free and open source.",
          icon: "Download",
        },
        {
          question: "What are the system requirements?",
          answer:
            "Smoothui works with React 16.8+ and supports all modern browsers. No additional dependencies are required beyond React and Tailwind CSS.",
          icon: "Settings",
        },
        {
          question: "Is Smoothui free to use?",
          answer:
            "Yes! Smoothui is completely free and open source. You can start using it immediately without any trial limitations or hidden costs.",
          icon: "Zap",
        },
      ],
    },
    {
      name: "Components",
      id: "components",
      faqs: [
        {
          question: "How many components are included?",
          answer:
            "Smoothui includes over 50+ pre-built components including buttons, forms, navigation, modals, animations, and more. New components are added regularly.",
          icon: "HelpCircle",
        },
        {
          question: "Can I customize the styling?",
          answer:
            "Absolutely! All components are fully customizable using CSS variables, Tailwind classes, or custom CSS. You have complete control over the appearance.",
          icon: "Settings",
        },
        {
          question: "Are the components accessible?",
          answer:
            "Yes, all components follow WCAG guidelines and include proper ARIA attributes for screen readers and keyboard navigation. Accessibility is a top priority.",
          icon: "Users",
        },
      ],
    },
    {
      name: "Support",
      id: "support",
      faqs: [
        {
          question: "How can I get help?",
          answer:
            "You can reach out to our community on Discord, GitHub discussions, or email our support team directly. We're here to help you succeed.",
          icon: "MessageCircle",
        },
        {
          question: "Do you offer custom development?",
          answer:
            "Yes, we offer custom component development and consulting services for enterprise clients. Contact us to discuss your specific needs.",
          icon: "Users",
        },
        {
          question: "What's your response time?",
          answer:
            "We typically respond to support requests within 24 hours during business days. For urgent issues, please mark them as high priority.",
          icon: "Clock",
        },
      ],
    },
  ],
}: FaqsGridProps) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="bg-muted py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="max-w-lg">
          <h2 className="font-semibold text-4xl text-foreground">{title}</h2>
          <p className="mt-4 text-balance text-lg text-muted-foreground">
            {description}
          </p>
        </div>

        {/* Tabs Navigation */}
        <div className="mt-8 md:mt-12">
          <div className="flex flex-wrap gap-2 border-border border-b">
            {categories.map((category, index) => (
              <motion.button
                className={`relative rounded-t-lg px-4 py-2 font-medium text-sm transition-all duration-200 ${
                  activeTab === index
                    ? "bg-background text-brand"
                    : "border-transparent text-muted-foreground hover:border-border/50 hover:text-foreground"
                }`}
                key={category.id}
                onClick={() => setActiveTab(index)}
                type="button"
                whileHover={{ scale: HOVER_SCALE }}
                whileTap={{ scale: TAP_SCALE }}
              >
                {category.name}
                {activeTab === index && (
                  <motion.div
                    className="absolute right-0 bottom-0 left-0 h-0.5 rounded-t-full bg-brand"
                    initial={false}
                    layoutId="activeTab"
                    transition={{
                      type: "spring",
                      stiffness: SPRING_STIFFNESS,
                      damping: SPRING_DAMPING,
                    }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-8 md:mt-8">
          <AnimatePresence mode="wait">
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: EXIT_Y_OFFSET }}
              initial={{ opacity: 0, y: INITIAL_Y_OFFSET }}
              key={activeTab}
              transition={{ duration: ANIMATION_DURATION, ease: "easeInOut" }}
            >
              <div className="space-y-6">
                <dl className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
                  {categories[activeTab].faqs.map((faq, faqIndex) => {
                    const IconComponent =
                      iconMap[faq.icon as keyof typeof iconMap] || HelpCircle;

                    return (
                      <motion.div
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3"
                        initial={{ opacity: 0, y: INITIAL_Y_OFFSET }}
                        key={`${categories[activeTab].id}-${faqIndex}`}
                        transition={{
                          duration: 0.4,
                          delay: faqIndex * FAQ_STAGGER_DELAY,
                        }}
                      >
                        <div className="flex size-8 items-center justify-center rounded-md border bg-card *:m-auto *:size-4">
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <dt className="font-semibold text-foreground">
                          {faq.question}
                        </dt>
                        <dd className="text-muted-foreground">{faq.answer}</dd>
                      </motion.div>
                    );
                  })}
                </dl>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

export default FaqsGrid;
