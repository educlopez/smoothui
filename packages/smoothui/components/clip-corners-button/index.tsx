"use client";

import { Button } from "@repo/shadcn-ui/components/ui/button";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

export interface ClipCornersButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function ClipCornersButton({
  children,
  className = "",
  onClick,
}: ClipCornersButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const [isHoverDevice, setIsHoverDevice] = useState(false);

  // Distance triangles move on hover
  const move = -4;

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
      className={`relative overflow-hidden rounded-none border-none bg-foreground px-8 py-4 font-mono text-2xl text-background hover:bg-foreground/90 ${className}`}
      onClick={onClick}
      onMouseEnter={() => {
        if (isHoverDevice) {
          setIsHovered(true);
        }
      }}
      onMouseLeave={() => setIsHovered(false)}
      style={{ borderRadius: 8 }}
      type="button"
    >
      {/* Top-left triangle */}
      <motion.div
        animate={
          shouldReduceMotion || !isHoverDevice
            ? {}
            : {
                x: isHovered ? -move : 0,
                y: isHovered ? -move : 0,
              }
        }
        className="absolute top-1.5 left-1.5"
        initial={false}
        style={{ width: 8, height: 8 }}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { type: "spring", stiffness: 400, damping: 24, duration: 0.2 }
        }
      >
        <svg
          aria-label="Top-left triangle"
          className="fill-background"
          height="8"
          width="8"
        >
          <title>Top-left triangle</title>
          <polygon fill="currentColor" points="0,0 8,0 0,8" />
        </svg>
      </motion.div>
      {/* Top-right triangle */}
      <motion.div
        animate={
          shouldReduceMotion || !isHoverDevice
            ? {}
            : {
                x: isHovered ? move : 0,
                y: isHovered ? -move : 0,
              }
        }
        className="absolute top-1.5 right-1.5"
        initial={false}
        style={{ width: 8, height: 8 }}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { type: "spring", stiffness: 400, damping: 24, duration: 0.2 }
        }
      >
        <svg
          aria-label="Top-right triangle"
          className="fill-background"
          height="8"
          width="8"
        >
          <title>Top-right triangle</title>
          <polygon fill="currentColor" points="8,0 8,8 0,0" />
        </svg>
      </motion.div>
      {/* Bottom-left triangle */}
      <motion.div
        animate={
          shouldReduceMotion || !isHoverDevice
            ? {}
            : {
                x: isHovered ? -move : 0,
                y: isHovered ? move : 0,
              }
        }
        className="absolute bottom-1.5 left-1.5"
        initial={false}
        style={{ width: 8, height: 8 }}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { type: "spring", stiffness: 400, damping: 24, duration: 0.2 }
        }
      >
        <svg
          aria-label="Bottom-left triangle"
          className="fill-background"
          height="8"
          width="8"
        >
          <title>Bottom-left triangle</title>
          <polygon fill="currentColor" points="0,8 8,8 0,0" />
        </svg>
      </motion.div>
      {/* Bottom-right triangle */}
      <motion.div
        animate={
          shouldReduceMotion || !isHoverDevice
            ? {}
            : {
                x: isHovered ? move : 0,
                y: isHovered ? move : 0,
              }
        }
        className="absolute right-1.5 bottom-1.5"
        initial={false}
        style={{ width: 8, height: 8 }}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { type: "spring", stiffness: 400, damping: 24, duration: 0.2 }
        }
      >
        <svg
          aria-label="Bottom-right triangle"
          className="fill-background"
          height="8"
          width="8"
        >
          <title>Bottom-right triangle</title>
          <polygon fill="currentColor" points="8,8 0,8 8,0" />
        </svg>
      </motion.div>
      <span className="relative z-10 flex w-full select-none items-center justify-center">
        {children}
      </span>
    </Button>
  );
}

export default ClipCornersButton;
