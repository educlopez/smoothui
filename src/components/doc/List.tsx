import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const listVariants = cva(
  "text-foreground/70 space-y-2 text-sm leading-relaxed [&_strong]:text-foreground",
  {
    variants: {
      type: {
        unordered: "list-disc pl-6",
        ordered: "list-decimal pl-6",
        none: "list-none pl-0",
      },
      spacing: {
        tight: "space-y-1",
        normal: "space-y-2",
        loose: "space-y-3",
      },
    },
    defaultVariants: {
      type: "unordered",
      spacing: "normal",
    },
  }
)

export interface ListProps
  extends React.HTMLAttributes<HTMLUListElement>,
    VariantProps<typeof listVariants> {
  /**
   * Render as a different HTML element
   */
  as?: "ul" | "ol"
}

const List = React.forwardRef<HTMLUListElement, ListProps>(
  ({ className, type, spacing, as, children, ...props }, ref) => {
    const Component = as || (type === "ordered" ? "ol" : "ul")

    if (Component === "ol") {
      return (
        <ol
          className={cn(listVariants({ type, spacing, className }))}
          ref={ref as React.Ref<HTMLOListElement>}
          {...props}
        >
          {children}
        </ol>
      )
    }

    return (
      <ul
        className={cn(listVariants({ type, spacing, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </ul>
    )
  }
)
List.displayName = "List"

export { List, listVariants }
