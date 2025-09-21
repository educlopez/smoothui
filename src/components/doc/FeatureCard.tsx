import type { ReactNode } from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { BgLines } from "@/components/landing/bg-lines"

import { Title } from "./Title"

const featureCardVariants = cva(
  "frame-box from-background via-background relative grid grid-cols-[4px_1fr] items-start gap-3 rounded-lg bg-linear-to-br p-4",
  {
    variants: {
      variant: {
        info: "to-brand/10",
        warning: "to-yellow-500/10",
        error: "to-red-500/10",
        success: "to-green-500/10",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  }
)

const featureCardBarVariants = cva("h-full w-1 rounded-full bg-linear-to-b", {
  variants: {
    variant: {
      info: "from-brand/0 via-brand to-brand/0",
      warning: "from-yellow-500/0 via-yellow-500 to-yellow-600/0",
      error: "from-red-500/0 via-red-500 to-red-600/0",
      success: "from-green-500/0 via-green-500 to-green-600/0",
    },
  },
  defaultVariants: {
    variant: "info",
  },
})

interface FeatureCardProps {
  title: string
  children: ReactNode
  className?: string
  variant?: VariantProps<typeof featureCardVariants>["variant"]
}

export function FeatureCard({
  title,
  children,
  className,
  variant,
}: FeatureCardProps) {
  return (
    <div className={cn(featureCardVariants({ variant }), className)}>
      <BgLines />
      <div
        role="presentation"
        className={featureCardBarVariants({ variant })}
      ></div>
      <div className="relative z-10">
        <Title level={3}>{title}</Title>
        <div className="text-foreground/70 text-sm leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  )
}
