"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import React, { type ReactNode } from "react";

export type PresetType =
  | "fade"
  | "slide"
  | "scale"
  | "blur"
  | "blur-slide"
  | "zoom"
  | "flip"
  | "bounce"
  | "rotate"
  | "swing";

export interface AnimatedGroupProps {
  as?: React.ElementType;
  asChild?: React.ElementType;
  children: ReactNode;
  className?: string;
  preset?: PresetType;
  variants?: {
    container?: Variants;
    item?: Variants;
  };
}

const defaultContainerVariants: Variants = {
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const defaultItemVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const presetVariants: Record<PresetType, Variants> = {
  blur: {
    hidden: { filter: "blur(4px)" },
    visible: { filter: "blur(0px)" },
  },
  "blur-slide": {
    hidden: { filter: "blur(4px)", y: 20 },
    visible: { filter: "blur(0px)", y: 0 },
  },
  bounce: {
    hidden: { y: -50 },
    visible: {
      transition: { damping: 10, stiffness: 400, type: "spring" as const },
      y: 0,
    },
  },
  fade: {},
  flip: {
    hidden: { rotateX: -90 },
    visible: {
      rotateX: 0,
      transition: { damping: 20, stiffness: 300, type: "spring" as const },
    },
  },
  rotate: {
    hidden: { rotate: -180 },
    visible: {
      rotate: 0,
      transition: { damping: 15, stiffness: 200, type: "spring" as const },
    },
  },
  scale: {
    hidden: { scale: 0.8 },
    visible: { scale: 1 },
  },
  slide: {
    hidden: { y: 20 },
    visible: { y: 0 },
  },
  swing: {
    hidden: { rotate: -10 },
    visible: {
      rotate: 0,
      transition: { damping: 8, stiffness: 300, type: "spring" as const },
    },
  },
  zoom: {
    hidden: { scale: 0.5 },
    visible: {
      scale: 1,
      transition: { damping: 20, stiffness: 300, type: "spring" as const },
    },
  },
};

const reducedContainerVariants: Variants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1, transition: { staggerChildren: 0 } },
};

const reducedItemVariants: Variants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1 },
};

const addDefaultVariants = (variants: Variants) => ({
  hidden: { ...defaultItemVariants.hidden, ...variants.hidden },
  visible: { ...defaultItemVariants.visible, ...variants.visible },
});

function AnimatedGroup({
  children,
  className,
  variants,
  preset,
  as = "div",
  asChild = "div",
}: AnimatedGroupProps) {
  const shouldReduceMotion = useReducedMotion();

  const selectedVariants = {
    container: addDefaultVariants(defaultContainerVariants),
    item: addDefaultVariants(preset ? presetVariants[preset] : {}),
  };
  const containerVariants = shouldReduceMotion
    ? reducedContainerVariants
    : (variants?.container ?? selectedVariants.container);
  const itemVariants = shouldReduceMotion
    ? reducedItemVariants
    : (variants?.item ?? selectedVariants.item);

  const MotionComponent = motion(as);

  const MotionChild = motion(asChild);

  return (
    <MotionComponent
      animate="visible"
      className={className}
      initial="hidden"
      variants={containerVariants}
    >
      {React.Children.map(children, (child, index) => (
        <MotionChild
          // biome-ignore lint/suspicious/noArrayIndexKey: React.Children order is stable
          key={index}
          variants={itemVariants}
        >
          {child}
        </MotionChild>
      ))}
    </MotionComponent>
  );
}

export { AnimatedGroup };
