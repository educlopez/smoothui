import { cn } from "@repo/shadcn-ui/lib/utils";
import Divider from "../../components/landing/divider";

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
      <div className="mx-auto mt-16 max-w-3xl space-y-8">
        {faqs.map((faq) => (
          <div
            className={cn(
              "hover:gradient-brand group relative flex flex-col rounded-2xl bg-smooth-100 p-6 backdrop-blur-lg transition-all",
              "shadow-custom"
            )}
            key={faq.question}
          >
            <h3 className="font-semibold text-foreground text-lg transition group-hover:text-white">
              {faq.question}
            </h3>
            <p className="group-hover: mt-2 text-primary-foreground transition group-hover:text-white">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
