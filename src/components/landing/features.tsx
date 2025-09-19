import { Package } from "lucide-react"

import Divider from "@/components/landing/divider"
import { ReactLogo } from "@/components/resources/logos/ReactLogo"
import { ShadcnLogo } from "@/components/resources/logos/ShadcnLogo"
import { TailwindLogo } from "@/components/resources/logos/TailwindLogo"
import { cn } from "@/components/smoothui/utils/cn"

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
]

export function Features() {
  return (
    <section className="bg-background relative px-8 py-24 transition">
      <Divider />
      <h2 className="font-title text-foreground text-center text-3xl font-semibold text-balance transition">
        Why Choose Smooth<span className="text-brand">UI</span>?
      </h2>
      <div className="mt-16 grid w-full gap-8 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <div
            key={feature.title}
            className={cn(
              "group from-primary/30 hover:from-primary inset-ring-background relative flex flex-col rounded-2xl bg-transparent bg-linear-to-b from-65% to-transparent p-6 inset-ring-2 backdrop-blur-lg transition-all",
              "border shadow-sm shadow-blue-800/10 hover:shadow-none"
            )}
          >
            <div className="border-brand inset-ring-background bg-primary mb-4 flex h-8 w-8 items-center justify-center rounded-full border-[0.5px] p-2 inset-ring">
              <feature.icon className="text-brand transition" />
            </div>
            <h3 className="text-foreground mb-2 text-xl font-semibold transition">
              {feature.title}
            </h3>
            <p className="text-primary-foreground transition">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
