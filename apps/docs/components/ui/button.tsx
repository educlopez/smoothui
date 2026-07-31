import { cva, type VariantProps } from "class-variance-authority";

const variants = {
  ghost: "hover:bg-fd-accent hover:text-fd-accent-foreground",
  outline: "border hover:bg-fd-accent hover:text-fd-accent-foreground",
  primary: "bg-fd-primary text-fd-primary-foreground hover:bg-fd-primary/80",
  secondary:
    "border bg-fd-secondary text-fd-secondary-foreground hover:bg-fd-accent hover:text-fd-accent-foreground",
} as const;

export const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md p-2 font-medium text-sm transition-colors duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      // fumadocs use `color` instead of `variant`
      color: variants,
      size: {
        icon: "p-1.5 [&_svg]:size-5",
        "icon-sm": "p-1.5 [&_svg]:size-4.5",
        "icon-xs": "p-1 [&_svg]:size-4",
        sm: "gap-1 px-2 py-1.5 text-xs",
      },
      variant: variants,
    },
  }
);

export type ButtonProps = VariantProps<typeof buttonVariants>;
