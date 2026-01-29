"use client";

import { Button } from "@repo/shadcn-ui/components/ui/button";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

export interface DotMorphButtonProps {
  label: string;
  className?: string;
  onClick?: () => void;
}

export function DotMorphButton({
  label,
  className = "",
  onClick,
}: DotMorphButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const [isHoverDevice, setIsHoverDevice] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    setIsHoverDevice(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsHoverDevice(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <Button
      className={`flex items-center gap-3 rounded-full border bg-background ${className}`}
      onClick={onClick}
      onMouseEnter={() => {
        if (isHoverDevice) {
          setIsHovered(true);
        }
      }}
      onMouseLeave={() => setIsHovered(false)}
      type="button"
    >
      <motion.span
        animate={
          shouldReduceMotion || !isHoverDevice || !isHovered
            ? {
                width: 16,
                height: 16,
                borderRadius: 999,
              }
            : {
                width: 12,
                height: 28,
                borderRadius: 999,
              }
        }
        className="flex items-center justify-center"
        initial={false}
        style={{
          background: "var(--color-brand)",
          display: "inline-block",
        }}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : {
                type: "spring",
                stiffness: 600,
                damping: 22,
                duration: 0.25,
              }
        }
      />
      <span className="select-none font-medium text-2xl text-foreground">
        {label}
      </span>
    </Button>
  );
}

export default DotMorphButton;
