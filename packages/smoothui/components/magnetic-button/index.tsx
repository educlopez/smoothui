"use client";

import { Slot } from "@radix-ui/react-slot";
import { cn } from "@repo/shadcn-ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, useReducedMotion, useSpring } from "motion/react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

const magneticButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export type MagneticButtonProps = {
  children: ReactNode;
  strength?: number;
  radius?: number;
  springConfig?: { duration?: number; bounce?: number };
  disabled?: boolean;
  asChild?: boolean;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof magneticButtonVariants>;

const MagneticButton = ({
  children,
  strength = 0.3,
  radius = 150,
  springConfig = { duration: 0.4, bounce: 0.1 },
  disabled = false,
  asChild = false,
  variant,
  size,
  className,
  ...props
}: MagneticButtonProps) => {
  const shouldReduceMotion = useReducedMotion();
  const [isHoverDevice, setIsHoverDevice] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const x = useSpring(0, {
    duration: springConfig.duration ?? 0.4,
    bounce: springConfig.bounce ?? 0.1,
  });
  const y = useSpring(0, {
    duration: springConfig.duration ?? 0.4,
    bounce: springConfig.bounce ?? 0.1,
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    setIsHoverDevice(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsHoverDevice(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const isEffectDisabled = disabled || shouldReduceMotion || !isHoverDevice;

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (isEffectDisabled || !buttonRef.current) {
        return;
      }

      const rect = buttonRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distanceX = event.clientX - centerX;
      const distanceY = event.clientY - centerY;
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

      if (distance < radius) {
        const factor = 1 - distance / radius;
        const moveX = distanceX * strength * factor;
        const moveY = distanceY * strength * factor;
        x.set(moveX);
        y.set(moveY);
      } else {
        x.set(0);
        y.set(0);
      }
    },
    [isEffectDisabled, radius, strength, x, y]
  );

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  const Comp = asChild ? Slot : "button";

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: Mouse events are for visual effect, not interaction
    <div
      className="inline-block"
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      ref={wrapperRef}
      role="presentation"
      style={{
        padding: `${radius / 2}px`,
        margin: `-${radius / 2}px`,
      }}
    >
      <motion.div style={{ x, y }}>
        <Comp
          className={cn(magneticButtonVariants({ variant, size, className }))}
          disabled={disabled}
          ref={buttonRef}
          type="button"
          {...props}
        >
          {children}
        </Comp>
      </motion.div>
    </div>
  );
};

export default MagneticButton;
