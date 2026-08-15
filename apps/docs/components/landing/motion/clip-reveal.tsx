"use client";

import { useGSAP } from "@gsap/react";
import { cn } from "@repo/shadcn-ui/lib/utils";
import gsap from "gsap";
import { type ReactNode, useRef } from "react";
import {
  GSAP_DURATION,
  GSAP_EASE_OUT,
  prefersReducedMotion,
} from "./constants";
import { registerLandingGsap } from "./register";

registerLandingGsap();

interface ClipRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function ClipReveal({
  children,
  className,
  delay = 0,
}: ClipRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const element = ref.current;
      if (!element || prefersReducedMotion()) {
        return;
      }

      gsap.fromTo(
        element,
        { clipPath: "inset(100% 0 0 0)", opacity: 0 },
        {
          clipPath: "inset(0% 0 0 0)",
          delay,
          duration: GSAP_DURATION.complex,
          ease: GSAP_EASE_OUT,
          opacity: 1,
          scrollTrigger: {
            once: true,
            start: "top 88%",
            trigger: element,
          },
        }
      );
    },
    { scope: ref }
  );

  return (
    <div className={cn(className)} ref={ref}>
      {children}
    </div>
  );
}

interface ClipRevealGroupProps {
  children: ReactNode;
  className?: string;
  selector?: string;
  stagger?: number;
}

export function ClipRevealGroup({
  children,
  className,
  selector = "[data-reveal]",
  stagger = 0.08,
}: ClipRevealGroupProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root || prefersReducedMotion()) {
        return;
      }

      const items = gsap.utils.toArray<HTMLElement>(selector, root);
      if (items.length === 0) {
        return;
      }

      gsap.fromTo(
        items,
        { clipPath: "inset(110% 0 0 0)", opacity: 0 },
        {
          clipPath: "inset(0% 0 0 0)",
          duration: GSAP_DURATION.complex,
          ease: GSAP_EASE_OUT,
          opacity: 1,
          scrollTrigger: {
            once: true,
            start: "top 85%",
            trigger: root,
          },
          stagger,
        }
      );
    },
    { scope: ref }
  );

  return (
    <div className={className} ref={ref}>
      {children}
    </div>
  );
}
