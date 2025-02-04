"use client"

import { useEffect, useRef, useState } from "react"
import { Minus, Plus } from "lucide-react"

import { cn } from "@/app/utils/cn"

export default function NumberFlow() {
  const [value, setValue] = useState(0)
  const [prevValue, setPrevValue] = useState(0)
  const min = 0
  const max = 999

  const prevValueRef = useRef<HTMLElement>(null)
  const nextValueRef = useRef<HTMLElement>(null)
  const prevValueTens = useRef<HTMLElement>(null)
  const nextValueTens = useRef<HTMLElement>(null)
  const prevValueHunds = useRef<HTMLElement>(null)
  const nextValueHunds = useRef<HTMLElement>(null)

  const add = () => {
    if (value < max) {
      setPrevValue(value)
      setValue((prevValue) => prevValue + 1)
    }
  }

  const subtract = () => {
    if (value > min) {
      setPrevValue(value)
      setValue((prevValue) => prevValue - 1)
    }
  }

  useEffect(() => {
    const prev = prevValueRef.current
    const next = nextValueRef.current
    const prevTens = prevValueTens.current
    const nextTens = nextValueTens.current
    const prevHunds = prevValueTens.current
    const nextHunds = nextValueTens.current

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

      const handleAnimationEndTens = () => {
        prevHunds.classList.remove("slide-out-up", "slide-out-down")
        nextHunds.classList.remove("slide-in-up", "slide-in-down")
        prevHunds.removeEventListener("animationend", handleAnimationEndTens)
      }

      prevHunds.addEventListener("animationend", handleAnimationEndTens)
    }
  }, [value, prevValue])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8">
      <div className="bg-light-50 dark:bg-dark-50 flex items-center gap-2 rounded-xl p-4 shadow-xs">
        <div className={cn("flex items-center gap-1")}>
          <div
            className={cn(
              "bg-light-100 dark:bg-dark-100 relative h-16 w-12 overflow-hidden rounded-lg"
            )}
          >
            <span
              className="text-light-950 dark:text-dark-950 absolute inset-0 flex items-center justify-center text-2xl font-semibold"
              ref={prevValueHunds}
              style={{ transform: `translateY(-100%)` }}
            >
              {Math.floor(prevValue / 100)}
            </span>
            <span
              className="text-light-950 dark:text-dark-950 absolute inset-0 flex items-center justify-center text-2xl font-semibold"
              ref={nextValueHunds}
              style={{ transform: `translateY(0%)` }}
            >
              {Math.floor(value / 100)}
            </span>
          </div>
          <div
            className={cn(
              "bg-light-100 dark:bg-dark-100 relative h-16 w-12 overflow-hidden rounded-lg"
            )}
          >
            <span
              className="text-light-950 dark:text-dark-950 absolute inset-0 flex items-center justify-center text-2xl font-semibold"
              ref={prevValueTens}
              style={{ transform: `translateY(-100%)` }}
            >
              {Math.floor(prevValue / 10) % 10}
            </span>
            <span
              className="text-light-950 dark:text-dark-950 absolute inset-0 flex items-center justify-center text-2xl font-semibold"
              ref={nextValueTens}
              style={{ transform: `translateY(0%)` }}
            >
              {Math.floor(value / 10) % 10}
            </span>
          </div>
          <div className="bg-light-100 dark:bg-dark-100 relative h-16 w-12 overflow-hidden rounded-lg">
            <span
              className="text-light-950 dark:text-dark-950 absolute inset-0 flex items-center justify-center text-2xl font-semibold"
              ref={prevValueRef}
              style={{ transform: `translateY(-100%)` }}
            >
              {prevValue % 10}
            </span>
            <span
              className="text-light-950 dark:text-dark-950 absolute inset-0 flex items-center justify-center text-2xl font-semibold"
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
            className="border-light-200 bg-light-50 dark:border-dark-200 dark:bg-dark-50 relative w-auto cursor-pointer overflow-hidden rounded-md border p-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus className="h-3 w-3" />
          </button>
          <button
            onClick={subtract}
            disabled={value <= min}
            className="border-light-200 bg-light-50 dark:border-dark-200 dark:bg-dark-50 relative w-auto cursor-pointer overflow-hidden rounded-md border p-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Minus className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  )
}
