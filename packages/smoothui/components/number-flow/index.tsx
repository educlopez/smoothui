"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { Minus, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const TENS_PLACE = 10;
const HUNDREDS_PLACE = 100;

const animateDigit = (
  prevElement: HTMLElement | null,
  nextElement: HTMLElement | null,
  isIncreasing: boolean
) => {
  if (!prevElement) {
    return;
  }
  if (!nextElement) {
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

const getTensValue = (num: number) => Math.floor(num / TENS_PLACE);
const getHundredsValue = (num: number) => Math.floor(num / HUNDREDS_PLACE);

export interface NumberFlowProps {
  value?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
  digitClassName?: string;
  buttonClassName?: string;
}

export default function NumberFlow({
  value: controlledValue,
  onChange,
  min = 0,
  max = 999,
  className = "",
  digitClassName = "",
  buttonClassName = "",
}: NumberFlowProps) {
  const [internalValue, setInternalValue] = useState(0);
  const [prevValue, setPrevValue] = useState(0);

  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const prevValueRef = useRef<HTMLElement>(null);
  const nextValueRef = useRef<HTMLElement>(null);
  const prevValueTens = useRef<HTMLElement>(null);
  const nextValueTens = useRef<HTMLElement>(null);
  const prevValueHunds = useRef<HTMLElement>(null);
  const nextValueHunds = useRef<HTMLElement>(null);

  const setValue = (val: number) => {
    if (onChange) {
      onChange(val);
    } else {
      setInternalValue(val);
    }
  };

  const add = () => {
    if (value < max) {
      setPrevValue(value);
      setValue(value + 1);
    }
  };

  const subtract = () => {
    if (value > min) {
      setPrevValue(value);
      setValue(value - 1);
    }
  };

  useEffect(() => {
    if (prevValueRef.current && nextValueRef.current) {
      animateDigit(
        prevValueRef.current,
        nextValueRef.current,
        value > prevValue
      );
    }

    const currentTens = getTensValue(value);
    const prevTens = getTensValue(prevValue);

    if (
      prevValueTens.current &&
      nextValueTens.current &&
      currentTens !== prevTens
    ) {
      animateDigit(
        prevValueTens.current,
        nextValueTens.current,
        currentTens > prevTens
      );
    }

    const currentHundreds = getHundredsValue(value);
    const prevHundreds = getHundredsValue(prevValue);

    if (
      prevValueHunds.current &&
      nextValueHunds.current &&
      currentHundreds !== prevHundreds
    ) {
      animateDigit(
        prevValueHunds.current,
        nextValueHunds.current,
        currentHundreds > prevHundreds
      );
    }
  }, [value, prevValue]);

  return (
    <div
      className={cn(
        "flex min-h-screen flex-col items-center justify-center gap-8",
        className
      )}
    >
      <div className="flex items-center gap-2 rounded-xl border bg-background p-4">
        <div className={cn("flex items-center gap-1", digitClassName)}>
          <div
            className={cn(
              "relative h-16 w-12 overflow-hidden rounded-lg border bg-primary"
            )}
          >
            <span
              className="absolute inset-0 flex items-center justify-center font-semibold text-2xl text-foreground"
              ref={prevValueHunds}
              style={{ transform: "translateY(-100%)" }}
            >
              {Math.floor(prevValue / HUNDREDS_PLACE)}
            </span>
            <span
              className="absolute inset-0 flex items-center justify-center font-semibold text-2xl text-foreground"
              ref={nextValueHunds}
              style={{ transform: "translateY(0%)" }}
            >
              {Math.floor(value / HUNDREDS_PLACE)}
            </span>
          </div>
          <div
            className={cn(
              "relative h-16 w-12 overflow-hidden rounded-lg border bg-primary"
            )}
          >
            <span
              className="absolute inset-0 flex items-center justify-center font-semibold text-2xl text-foreground"
              ref={prevValueTens}
              style={{ transform: "translateY(-100%)" }}
            >
              {Math.floor(prevValue / TENS_PLACE) % TENS_PLACE}
            </span>
            <span
              className="absolute inset-0 flex items-center justify-center font-semibold text-2xl text-foreground"
              ref={nextValueTens}
              style={{ transform: "translateY(0%)" }}
            >
              {Math.floor(value / TENS_PLACE) % TENS_PLACE}
            </span>
          </div>
          <div
            className={cn(
              "relative h-16 w-12 overflow-hidden rounded-lg border bg-primary"
            )}
          >
            <span
              className="absolute inset-0 flex items-center justify-center font-semibold text-2xl text-foreground"
              ref={prevValueRef}
              style={{ transform: "translateY(-100%)" }}
            >
              {prevValue % TENS_PLACE}
            </span>
            <span
              className="absolute inset-0 flex items-center justify-center font-semibold text-2xl text-foreground"
              ref={nextValueRef}
              style={{ transform: "translateY(0%)" }}
            >
              {value % TENS_PLACE}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <button
            aria-label="Increase number"
            className={cn(
              "relative w-auto cursor-pointer overflow-hidden rounded-md border bg-background p-2 disabled:cursor-not-allowed disabled:opacity-50",
              buttonClassName
            )}
            disabled={value >= max}
            onClick={add}
            type="button"
          >
            <Plus className="h-3 w-3" />
          </button>
          <button
            aria-label="Decrease number"
            className={cn(
              "relative w-auto cursor-pointer overflow-hidden rounded-md border bg-background p-2 disabled:cursor-not-allowed disabled:opacity-50",
              buttonClassName
            )}
            disabled={value <= min}
            onClick={subtract}
            type="button"
          >
            <Minus className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
