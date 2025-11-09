import { cn } from "@repo/shadcn-ui/lib/utils";
import { Package } from "lucide-react";
import Divider from "@docs/components/landing/divider";
import { ReactLogo } from "@docs/components/landing/logos/react-logo";
import { ShadcnLogo } from "@docs/components/landing/logos/shadcn-logo";
import { TailwindLogo } from "@docs/components/landing/logos/tailwind-logo";

const features = [
  {
    title: "Smooth Animations",
    description:
      "Built-in animations powered by Motion for delightful user experiences.",
    icon: Package,
  },
  {
    title: "React",
    description:
      "Built with modern React patterns including Server Components, TypeScript, and hooks for optimal performance.",
    icon: ReactLogo,
  },
  {
    title: "Tailwindcss",
    description:
      "Built with Tailwind CSS v4, featuring the latest utility-first CSS framework with enhanced dark mode and modern design patterns.",
    icon: TailwindLogo,
  },
  {
    title: "shadcn/ui Compatible",
    description:
      "Fully compatible with shadcn/ui ecosystem. Easy to integrate with existing shadcn/ui projects and follows the same patterns.",
    icon: ShadcnLogo,
  },
];

export function Features() {
  return (
    <section className="relative bg-background px-8 py-24 transition">
      <Divider />
      <h2 className="text-balance text-center font-semibold font-title text-3xl text-foreground transition">
        Why Choose Smooth<span className="text-brand">UI</span>?
      </h2>
      <div className="mt-16 grid w-full gap-8 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <div
            className={cn(
              "group relative inset-ring-2 inset-ring-background flex flex-col rounded-2xl bg-linear-to-b bg-transparent from-65% from-primary/30 to-transparent p-6 backdrop-blur-lg transition-all hover:from-primary",
              "border shadow-blue-800/10 shadow-sm hover:shadow-none"
            )}
            key={feature.title}
          >
            <div className="inset-ring inset-ring-background mb-4 flex h-8 w-8 items-center justify-center rounded-full border-[0.5px] border-brand bg-primary p-2">
              <feature.icon className="text-brand transition" />
            </div>
            <h3 className="mb-2 font-semibold text-foreground text-xl transition">
              {feature.title}
            </h3>
            <p className="text-primary-foreground transition">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
