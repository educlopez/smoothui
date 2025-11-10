import { cn } from "@repo/shadcn-ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes, Ref } from "react";

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
      className={cn(bodyTextVariants({ size, weight, className }))}
      ref={ref}
      {...(props as HTMLAttributes<HTMLParagraphElement>)}
    />
  );
}

export { bodyTextVariants };
