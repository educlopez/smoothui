import { cn } from "@repo/shadcn-ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";

const featureCardVariants = cva(
  "not-prose relative flex gap-3 overflow-hidden rounded-xl border border-border bg-card px-4 py-3.5 shadow-sm",
  {
    defaultVariants: {
      variant: "info",
    },
    variants: {
      variant: {
        error: "bg-destructive/5",
        info: "bg-brand/5",
        success: "bg-green/5",
        warning: "bg-amber/5",
      },
    },
  }
);

const featureCardBarVariants = cva("w-1 shrink-0 self-stretch rounded-full", {
  defaultVariants: {
    variant: "info",
  },
  variants: {
    variant: {
      error: "bg-destructive",
      info: "bg-brand",
      success: "bg-green",
      warning: "bg-amber",
    },
  },
});

interface FeatureCardProps {
  children: ReactNode;
  className?: string;
  title: string;
  variant?: VariantProps<typeof featureCardVariants>["variant"];
}

export function FeatureCard({
  title,
  children,
  className,
  variant,
}: FeatureCardProps) {
  return (
    <div className={cn(featureCardVariants({ variant }), className)}>
      <div aria-hidden className={featureCardBarVariants({ variant })} />
      <div className="min-w-0 flex-1">
        <p className="m-0 mb-1.5 font-semibold text-foreground text-sm tracking-tight">
          {title}
        </p>
        <div className="text-muted-foreground text-sm leading-relaxed [&_a]:font-medium [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4 [&_li]:my-0.5 [&_ol]:my-1.5 [&_ol]:list-decimal [&_ol]:pl-4 [&_p]:m-0 [&_ul]:my-1.5 [&_ul]:list-disc [&_ul]:pl-4">
          {children}
        </div>
      </div>
    </div>
  );
}
