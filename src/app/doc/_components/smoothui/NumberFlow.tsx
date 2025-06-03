"use client"

import { useEffect, useRef, useState } from "react"
import { Minus, Plus } from "lucide-react"

import { cn } from "@/app/utils/cn"

export interface NumberFlowProps {
  value?: number
  onChange?: (value: number) => void
  min?: number
  max?: number
  className?: string
  digitClassName?: string
  buttonClassName?: string
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
  const [internalValue, setInternalValue] = useState(0)
  const [prevValue, setPrevValue] = useState(0)

  const value = controlledValue !== undefined ? controlledValue : internalValue

  const prevValueRef = useRef<HTMLElement>(null)
  const nextValueRef = useRef<HTMLElement>(null)
  const prevValueTens = useRef<HTMLElement>(null)
  const nextValueTens = useRef<HTMLElement>(null)
  const prevValueHunds = useRef<HTMLElement>(null)
  const nextValueHunds = useRef<HTMLElement>(null)

  const setValue = (val: number) => {
    if (onChange) onChange(val)
    else setInternalValue(val)
  }

  const add = () => {
    if (value < max) {
      setPrevValue(value)
      setValue(value + 1)
    }
  }

  const subtract = () => {
    if (value > min) {
      setPrevValue(value)
      setValue(value - 1)
    }
  }

  useEffect(() => {
    const prev = prevValueRef.current
    const next = nextValueRef.current
    const prevTens = prevValueTens.current
    const nextTens = nextValueTens.current
    const prevHunds = prevValueHunds.current
    const nextHunds = nextValueHunds.current

    if (prev && next) {
      if (value > prevValue) {
        prev.classList.add("slide-out-up")
        next.classList.add("slide-in-up")
      } else {
        prev.classList.add("slide-out-down")
        next.classList.add("slide-in-down")
      }

      const handleAnimationEnd = () => {
        prev.classList.remove("slide-out-up", "slide-out-down")
        next.classList.remove("slide-in-up", "slide-in-down")
        prev.removeEventListener("animationend", handleAnimationEnd)
      }

      prev.addEventListener("animationend", handleAnimationEnd)
    }

    if (
      prevTens &&
      nextTens &&
      Math.floor(value / 10) !== Math.floor(prevValue / 10)
    ) {
      if (Math.floor(value / 10) > Math.floor(prevValue / 10)) {
        prevTens.classList.add("slide-out-up")
        nextTens.classList.add("slide-in-up")
      } else if (Math.floor(value / 10) < Math.floor(prevValue / 10)) {
        prevTens.classList.add("slide-out-down")
        nextTens.classList.add("slide-in-down")
      }

      const handleAnimationEndTens = () => {
        prevTens.classList.remove("slide-out-up", "slide-out-down")
        nextTens.classList.remove("slide-in-up", "slide-in-down")
        prevTens.removeEventListener("animationend", handleAnimationEndTens)
      }

      prevTens.addEventListener("animationend", handleAnimationEndTens)
    }

    if (
      prevHunds &&
      nextHunds &&
      Math.floor(value / 100) !== Math.floor(prevValue / 100)
    ) {
      if (Math.floor(value / 100) > Math.floor(prevValue / 100)) {
        prevHunds.classList.add("slide-out-up")
        nextHunds.classList.add("slide-in-up")
      } else if (Math.floor(value / 100) < Math.floor(prevValue / 100)) {
        prevHunds.classList.add("slide-out-down")
        nextHunds.classList.add("slide-in-down")
      }

      const handleAnimationEndHunds = () => {
        prevHunds.classList.remove("slide-out-up", "slide-out-down")
        nextHunds.classList.remove("slide-in-up", "slide-in-down")
        prevHunds.removeEventListener("animationend", handleAnimationEndHunds)
      }

      prevHunds.addEventListener("animationend", handleAnimationEndHunds)
    }
  }, [value, prevValue])

  return (
    <div
      className={cn(
        "flex min-h-screen flex-col items-center justify-center gap-8",
        className
      )}
    >
      <div className="bg-background flex items-center gap-2 rounded-xl border p-4">
        <div className={cn("flex items-center gap-1", digitClassName)}>
          <div
            className={cn(
              "bg-primary relative h-16 w-12 overflow-hidden rounded-lg border"
            )}
          >
            <span
              className="text-foreground absolute inset-0 flex items-center justify-center text-2xl font-semibold"
              ref={prevValueHunds}
              style={{ transform: `translateY(-100%)` }}
            >
              {Math.floor(prevValue / 100)}
            </span>
            <span
              className="text-foreground absolute inset-0 flex items-center justify-center text-2xl font-semibold"
              ref={nextValueHunds}
              style={{ transform: `translateY(0%)` }}
            >
              {Math.floor(value / 100)}
            </span>
          </div>
          <div
            className={cn(
              "bg-primary relative h-16 w-12 overflow-hidden rounded-lg border"
            )}
          >
            <span
              className="text-foreground absolute inset-0 flex items-center justify-center text-2xl font-semibold"
              ref={prevValueTens}
              style={{ transform: `translateY(-100%)` }}
            >
              {Math.floor(prevValue / 10) % 10}
            </span>
            <span
              className="text-foreground absolute inset-0 flex items-center justify-center text-2xl font-semibold"
              ref={nextValueTens}
              style={{ transform: `translateY(0%)` }}
            >
              {Math.floor(value / 10) % 10}
            </span>
          </div>
          <div
            className={cn(
              "bg-primary relative h-16 w-12 overflow-hidden rounded-lg border"
            )}
          >
            <span
              className="text-foreground absolute inset-0 flex items-center justify-center text-2xl font-semibold"
              ref={prevValueRef}
              style={{ transform: `translateY(-100%)` }}
            >
              {prevValue % 10}
            </span>
            <span
              className="text-foreground absolute inset-0 flex items-center justify-center text-2xl font-semibold"
              ref={nextValueRef}
              style={{ transform: `translateY(0%)` }}
            >
              {value % 10}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <button
            onClick={add}
            disabled={value >= max}
            aria-label="Increase number"
            className={cn(
              "bg-background relative w-auto cursor-pointer overflow-hidden rounded-md border p-2 disabled:cursor-not-allowed disabled:opacity-50",
              buttonClassName
            )}
          >
            <Plus className="h-3 w-3" />
          </button>
          <button
            onClick={subtract}
            disabled={value <= min}
            aria-label="Decrease number"
            className={cn(
              "bg-background relative w-auto cursor-pointer overflow-hidden rounded-md border p-2 disabled:cursor-not-allowed disabled:opacity-50",
              buttonClassName
            )}
          >
            <Minus className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  )
}
