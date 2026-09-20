"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { Minus, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const TENS_PLACE = 10;
const HUNDREDS_PLACE = 100;

const animateDigit = (
  previous: HTMLElement | null,
  next: HTMLElement | null,
  increasing: boolean
): Animation[] => {
  if (!(previous?.animate && next?.animate)) {
    return [];
  }
  const options = { duration: 300, easing: "cubic-bezier(0.22, 1, 0.36, 1)" };
  return [
    previous.animate(
      [
        { opacity: 1, transform: "translateY(0%)" },
        { opacity: 0, transform: `translateY(${increasing ? -100 : 100}%)` },
      ],
      options
    ),
    next.animate(
      [
        { opacity: 0, transform: `translateY(${increasing ? 100 : -100}%)` },
        { opacity: 1, transform: "translateY(0%)" },
      ],
      options
    ),
  ];
};

export interface NumberFlowProps {
  buttonClassName?: string;
  className?: string;
  digitClassName?: string;
  max?: number;
  min?: number;
  onChange?: (value: number) => void;
  value?: number;
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
  const [prevValue, setPrevValue] = useState(controlledValue ?? 0);
  const [reduced, setReduced] = useState(false);

  const value = controlledValue === undefined ? internalValue : controlledValue;
  const lastAnimatedValue = useRef(value);
  // Optimistic cursor for rapid clicks. Only follow the prop when the parent
  // (or internal state) actually catches up — never reset mid-click from a
  // re-render that still sees the previous controlled value.
  const committedValue = useRef(value);

  useEffect(() => {
    committedValue.current = value;
  }, [value]);

  const prevValueRef = useRef<HTMLElement>(null);
  const nextValueRef = useRef<HTMLElement>(null);
  const prevValueTens = useRef<HTMLElement>(null);
  const nextValueTens = useRef<HTMLElement>(null);
  const prevValueHunds = useRef<HTMLElement>(null);
  const nextValueHunds = useRef<HTMLElement>(null);

  const setValue = (val: number) => {
    committedValue.current = val;
    if (onChange) {
      onChange(val);
    }
    if (controlledValue === undefined) {
      setInternalValue(val);
    }
  };

  const add = () => {
    const { current } = committedValue;
    if (current < max) {
      setPrevValue(current);
      setValue(current + 1);
    }
  };

  const subtract = () => {
    const { current } = committedValue;
    if (current > min) {
      setPrevValue(current);
      setValue(current - 1);
    }
  };

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const changed = lastAnimatedValue.current !== value;
    lastAnimatedValue.current = value;
    if (
      !changed ||
      reduced ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      value === prevValue
    ) {
      return;
    }
    const animations: Animation[] = [];
    const digits = [
      { next: nextValueRef.current, place: 1, previous: prevValueRef.current },
      {
        next: nextValueTens.current,
        place: TENS_PLACE,
        previous: prevValueTens.current,
      },
      {
        next: nextValueHunds.current,
        place: HUNDREDS_PLACE,
        previous: prevValueHunds.current,
      },
    ];
    for (const digit of digits) {
      if (
        Math.floor(value / digit.place) % TENS_PLACE !==
        Math.floor(prevValue / digit.place) % TENS_PLACE
      ) {
        animations.push(
          ...animateDigit(digit.previous, digit.next, value > prevValue)
        );
      }
    }
    return () => {
      for (const animation of animations) {
        animation.cancel();
      }
    };
  }, [value, prevValue, reduced]);

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-8",
        className
      )}
    >
      <div className="flex items-center gap-2 rounded-xl border bg-background p-4">
        <output aria-label="Current value" className="sr-only">
          {value}
        </output>
        <div
          aria-hidden="true"
          className={cn("flex items-center gap-1", digitClassName)}
        >
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
              "relative flex w-auto cursor-pointer items-center justify-center overflow-hidden rounded-md border bg-background p-2 disabled:cursor-not-allowed disabled:opacity-50",
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
              "relative flex w-auto cursor-pointer items-center justify-center overflow-hidden rounded-md border bg-background p-2 disabled:cursor-not-allowed disabled:opacity-50",
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
