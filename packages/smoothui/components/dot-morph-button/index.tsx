"use client";

import { Button } from "@repo/shadcn-ui/components/ui/button";
import { motion } from "motion/react";
import { useState } from "react";

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

  return (
    <Button
      className={`flex items-center gap-3 rounded-full border bg-background ${className}`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      type="button"
    >
      <motion.span
        animate={
          isHovered
            ? {
                width: 12,
                height: 28,
                borderRadius: 999,
              }
            : {
                width: 16,
                height: 16,
                borderRadius: 999,
              }
        }
        className="flex items-center justify-center"
        initial={false}
        style={{
          background: "var(--color-brand)",
          display: "inline-block",
        }}
        transition={{
          type: "spring",
          stiffness: 600,
          damping: 22,
        }}
      />
      <span className="select-none font-medium text-2xl text-foreground">
        {label}
      </span>
    </Button>
  );
}

export default DotMorphButton;
