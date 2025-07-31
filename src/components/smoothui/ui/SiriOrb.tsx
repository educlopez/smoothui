"use client"

import React from "react"

import { cn } from "../utils/cn"

interface SiriOrbProps {
  size?: string
  className?: string
  colors?: {
    bg?: string
    c1?: string
    c2?: string
    c3?: string
  }
  animationDuration?: number
}

const SiriOrb: React.FC<SiriOrbProps> = ({
  size = "192px",
  className,
  colors,
  animationDuration = 20,
}) => {
  const defaultColors = {
    bg: "oklch(12.9% 0.042 264.695)",
    c1: "oklch(0.72 0.2 352.53)", // SmoothUI brand pink
    c2: "oklch(0.66 0.21 354.31)", // SmoothUI brand secondary
    c3: "oklch(0.58 0.18 350)", // Lighter pink variant
  }

  const finalColors = { ...defaultColors, ...colors }

  // Extract numeric value from size for calculations
  const sizeValue = parseInt(size.replace("px", ""), 10)

  // Responsive calculations based on size
  const blurAmount = Math.max(sizeValue * 0.015, 4) // Smaller blur for small sizes
  const contrastAmount = Math.max(sizeValue * 0.008, 1.5) // Adjusted contrast
  const dotSize = Math.max(sizeValue * 0.008, 0.8) // Smaller dots for small sizes
  const shadowSpread = Math.max(sizeValue * 0.008, 2) // Responsive shadow

  return (
    <div
      className={cn("siri-orb", className)}
      style={
        {
          width: size,
          height: size,
          "--bg": finalColors.bg,
          "--c1": finalColors.c1,
          "--c2": finalColors.c2,
          "--c3": finalColors.c3,
          "--animation-duration": `${animationDuration}s`,
          "--blur-amount": `${blurAmount}px`,
          "--contrast-amount": contrastAmount,
          "--dot-size": `${dotSize}px`,
          "--shadow-spread": `${shadowSpread}px`,
        } as React.CSSProperties
      }
    >
      <style jsx>{`
        @property --angle {
          syntax: "<angle>";
          inherits: false;
          initial-value: 0deg;
        }

        .siri-orb {
          display: grid;
          grid-template-areas: "stack";
          overflow: hidden;
          border-radius: 50%;
          position: relative;
        }

        .siri-orb::before,
        .siri-orb::after {
          content: "";
          display: block;
          grid-area: stack;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          transform: translateZ(0);
        }

        .siri-orb::before {
          background:
            conic-gradient(
              from calc(var(--angle) * 2) at 25% 70%,
              var(--c3),
              transparent 20% 80%,
              var(--c3)
            ),
            conic-gradient(
              from calc(var(--angle) * 2) at 45% 75%,
              var(--c2),
              transparent 30% 60%,
              var(--c2)
            ),
            conic-gradient(
              from calc(var(--angle) * -3) at 80% 20%,
              var(--c1),
              transparent 40% 60%,
              var(--c1)
            ),
            conic-gradient(
              from calc(var(--angle) * 2) at 15% 5%,
              var(--c2),
              transparent 10% 90%,
              var(--c2)
            ),
            conic-gradient(
              from calc(var(--angle) * 1) at 20% 80%,
              var(--c1),
              transparent 10% 90%,
              var(--c1)
            ),
            conic-gradient(
              from calc(var(--angle) * -2) at 85% 10%,
              var(--c3),
              transparent 20% 80%,
              var(--c3)
            );
          box-shadow: inset var(--bg) 0 0 var(--shadow-spread)
            calc(var(--shadow-spread) * 0.2);
          filter: blur(var(--blur-amount)) contrast(var(--contrast-amount));
          animation: rotate var(--animation-duration) linear infinite;
        }

        .siri-orb::after {
          background-image: radial-gradient(
            circle at center,
            var(--bg) var(--dot-size),
            transparent var(--dot-size)
          );
          background-size: calc(var(--dot-size) * 2) calc(var(--dot-size) * 2);
          mask-image: radial-gradient(black 25%, transparent 75%);
          backdrop-filter: blur(calc(var(--blur-amount) * 2))
            contrast(calc(var(--contrast-amount) * 2));
          mix-blend-mode: overlay;
        }

        @keyframes rotate {
          to {
            --angle: 360deg;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .siri-orb::before {
            animation: none;
          }
        }
      `}</style>
    </div>
  )
}

export default SiriOrb
