import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const titleVariants = cva("text-foreground font-semibold tracking-tight", {
  variants: {
    level: {
      1: "text-3xl font-bold -tracking-wide",
      2: "text-lg font-semibold",
      3: "text-base font-semibold",
      4: "text-sm font-semibold",
      5: "text-xs font-semibold",
      6: "text-xs font-medium",
    },
  },
  defaultVariants: {
    level: 2,
  },
})

export interface TitleProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof titleVariants> {
  /**
   * The content for the table of contents
   */
  tableContent?: string
  /**
   * The heading level (1-6)
   */
  level?: 1 | 2 | 3 | 4 | 5 | 6
}

const Title = React.forwardRef<HTMLHeadingElement, TitleProps>(
  ({ className, level = 2, tableContent, children, ...props }, ref) => {
    const commonProps = {
      className: cn(titleVariants({ level, className })),
      "data-table-content": tableContent,
      "data-level": level,
      ref,
      ...props,
    }

    switch (level) {
      case 1:
        return <h1 {...commonProps}>{children}</h1>
      case 2:
        return <h2 {...commonProps}>{children}</h2>
      case 3:
        return <h3 {...commonProps}>{children}</h3>
      case 4:
        return <h4 {...commonProps}>{children}</h4>
      case 5:
        return <h5 {...commonProps}>{children}</h5>
      case 6:
        return <h6 {...commonProps}>{children}</h6>
      default:
        return <h2 {...commonProps}>{children}</h2>
    }
  }
)
Title.displayName = "Title"

export { Title, titleVariants }
