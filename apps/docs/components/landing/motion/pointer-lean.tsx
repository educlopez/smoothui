"use client";

import { useGSAP } from "@gsap/react";
import { cn } from "@repo/shadcn-ui/lib/utils";
import gsap from "gsap";
import { type ReactNode, useRef } from "react";
import {
  GSAP_DURATION,
  isFinePointer,
  prefersReducedMotion,
} from "./constants";
import { registerLandingGsap } from "./register";

registerLandingGsap();

interface PointerLeanProps {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
}

export function PointerLean({
  children,
  className,
  maxTilt = 5,
}: PointerLeanProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const stage = stageRef.current;
      const card = cardRef.current;
      if (!(stage && card) || prefersReducedMotion() || !isFinePointer()) {
        return;
      }

      const rotateX = gsap.quickTo(card, "rotateX", {
        duration: GSAP_DURATION.default,
        ease: "cubic-bezier(0.23, 1, 0.32, 1)",
      });
      const rotateY = gsap.quickTo(card, "rotateY", {
        duration: GSAP_DURATION.default,
        ease: "cubic-bezier(0.23, 1, 0.32, 1)",
      });

      const onMove = (event: PointerEvent) => {
        const bounds = stage.getBoundingClientRect();
        const px = (event.clientX - bounds.left) / bounds.width - 0.5;
        const py = (event.clientY - bounds.top) / bounds.height - 0.5;
        rotateY(px * maxTilt);
        rotateX(-py * maxTilt);
      };

      const onLeave = () => {
        rotateX(0);
        rotateY(0);
      };

      stage.addEventListener("pointermove", onMove);
      stage.addEventListener("pointerleave", onLeave);

      return () => {
        stage.removeEventListener("pointermove", onMove);
        stage.removeEventListener("pointerleave", onLeave);
      };
    },
    { dependencies: [maxTilt], scope: stageRef }
  );

  return (
    <div className={cn("[perspective:1200px]", className)} ref={stageRef}>
      <div
        className="h-full will-change-transform [transform-style:preserve-3d]"
        ref={cardRef}
      >
        {children}
      </div>
    </div>
  );
}
