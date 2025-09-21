import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const bodyTextVariants = cva("text-foreground/70 leading-relaxed", {
  variants: {
    size: {
      sm: "text-sm",
      base: "text-base",
      lg: "text-lg",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
    },
  },
  defaultVariants: {
    size: "sm",
    weight: "normal",
  },
})

export interface BodyTextProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof bodyTextVariants> {
  /**
   * Render as a different HTML element
   */
  as?: "p" | "div" | "span"
}

const BodyText = React.forwardRef<HTMLParagraphElement, BodyTextProps>(
  ({ className, size, weight, as: Component = "p", ...props }, ref) => {
    return (
      <Component
        className={cn(bodyTextVariants({ size, weight, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
BodyText.displayName = "BodyText"

export { BodyText, bodyTextVariants }
