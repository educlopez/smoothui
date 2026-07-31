import { cn } from "@repo/shadcn-ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes, Ref } from "react";

const bodyTextVariants = cva("text-foreground/70 leading-relaxed", {
  defaultVariants: {
    size: "sm",
    weight: "normal",
  },
  variants: {
    size: {
      base: "text-base",
      lg: "text-lg",
      sm: "text-sm",
    },
    weight: {
      medium: "font-medium",
      normal: "font-normal",
      semibold: "font-semibold",
    },
  },
});

export interface BodyTextProps
  extends HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof bodyTextVariants> {
  /**
   * Render as a different HTML element
   */
  as?: "p" | "div" | "span";
  ref?: Ref<HTMLParagraphElement>;
}

export function BodyText({
  className,
  size,
  weight,
  as: Component = "p",
  ref,
  ...props
}: BodyTextProps) {
  // TypeScript needs explicit typing for polymorphic components
  const Element = Component as "p" | "div" | "span";
  return (
    <Element
      className={cn(bodyTextVariants({ className, size, weight }))}
      ref={ref}
      {...(props as HTMLAttributes<HTMLParagraphElement>)}
    />
  );
}

export { bodyTextVariants };
