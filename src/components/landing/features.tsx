import { Package } from "lucide-react"

import Divider from "@/components/landing/divider"
import Rule from "@/components/landing/rule"
import { ReactLogo } from "@/components/resources/logos/ReactLogo"
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
]

export function Features() {
  return (
    <section className="bg-background transition relative px-8 py-24">
      <Divider />
      <h2 className="font-title text-foreground text-center text-3xl font-bold transition">
        Why Choose Smooth<span className="text-brand">UI</span>?
      </h2>
      <div className="mt-16 grid w-full gap-8 md:grid-cols-3">
        {features.map((feature) => (
          <div
            key={feature.title}
            className={cn(
              "hover:gradient-brand group bg-smooth-100 relative flex flex-col rounded-2xl p-6 backdrop-blur-lg transition-all",
              "shadow-custom"
            )}
          >
            <feature.icon className="text-brand mb-4 h-8 w-8 transition group-hover:text-white" />
            <h3 className="text-foreground mb-2 text-xl font-semibold transition group-hover:text-white">
              {feature.title}
            </h3>
            <p className="text-primary-foreground transition group-hover:text-white">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
