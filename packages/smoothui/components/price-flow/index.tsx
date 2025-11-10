"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { useEffect, useRef, useState } from "react";

const STAGGER_DELAY = 50;

export type PriceFlowProps = {
  value: number;
  className?: string;
};

const animateDigit = (
  prevElement: HTMLElement | null,
  nextElement: HTMLElement | null,
  isIncreasing: boolean
) => {
  if (prevElement === null || nextElement === null) {
    return;
  }

  if (isIncreasing) {
    prevElement.classList.add("slide-out-up");
    nextElement.classList.add("slide-in-up");
  } else {
    prevElement.classList.add("slide-out-down");
    nextElement.classList.add("slide-in-down");
  }

  const handleAnimationEnd = () => {
    prevElement.classList.remove("slide-out-up", "slide-out-down");
    nextElement.classList.remove("slide-in-up", "slide-in-down");
    prevElement.removeEventListener("animationend", handleAnimationEnd);
  };

  prevElement.addEventListener("animationend", handleAnimationEnd);
};

export default function PriceFlow({ value, className = "" }: PriceFlowProps) {
  const [prevValue, setPrevValue] = useState(value);

  // Create refs for each digit position (tens and ones)
  const prevTensRef = useRef<HTMLElement>(null);
  const nextTensRef = useRef<HTMLElement>(null);
  const prevOnesRef = useRef<HTMLElement>(null);
  const nextOnesRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (value === prevValue) {
      return;
    }

    const prevTens = prevTensRef.current;
    const nextTens = nextTensRef.current;
    const prevOnes = prevOnesRef.current;
    const nextOnes = nextOnesRef.current;

    const prevTensValue = Math.floor(prevValue / 10);
    const currentTensValue = Math.floor(value / 10);
    const tensChanged = currentTensValue !== prevTensValue;

    if (tensChanged && prevTens && nextTens) {
      const isTensIncreasing = currentTensValue > prevTensValue;
      animateDigit(prevTens, nextTens, isTensIncreasing);
    }

    const prevOnesValue = prevValue % 10;
    const currentOnesValue = value % 10;
    const onesChanged = currentOnesValue !== prevOnesValue;

    if (onesChanged && prevOnes && nextOnes) {
      const isOnesIncreasing = currentOnesValue > prevOnesValue;
      setTimeout(() => {
        animateDigit(prevOnes, nextOnes, isOnesIncreasing);
      }, STAGGER_DELAY);
    }

    setPrevValue(value);
  }, [value, prevValue]);

  const formatValue = (val: number) => val.toString().padStart(2, "0");

  const prevFormatted = formatValue(prevValue);
  const currentFormatted = formatValue(value);

  return (
    <span className={cn("relative inline-flex items-center", className)}>
      <span className="relative inline-block overflow-hidden">
        {/* Tens digit */}
        <span
          className="absolute inset-0 flex items-center justify-center"
          ref={prevTensRef}
          style={{ transform: "translateY(-100%)" }}
        >
          {prevFormatted[0]}
        </span>
        <span
          className="flex items-center justify-center"
          ref={nextTensRef}
          style={{ transform: "translateY(0%)" }}
        >
          {currentFormatted[0]}
        </span>
      </span>

      <span className="relative inline-block overflow-hidden">
        {/* Ones digit */}
        <span
          className="absolute inset-0 flex items-center justify-center"
          ref={prevOnesRef}
          style={{ transform: "translateY(-100%)" }}
        >
          {prevFormatted[1]}
        </span>
        <span
          className="flex items-center justify-center"
          ref={nextOnesRef}
          style={{ transform: "translateY(0%)" }}
        >
          {currentFormatted[1]}
        </span>
      </span>
    </span>
  );
}
