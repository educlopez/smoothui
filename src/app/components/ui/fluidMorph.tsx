"use client"

import { useEffect, useRef, useState } from "react"
import { animate } from "framer-motion"

const numbers = [
  "M128 40L230 215.766H26L128 40Z",
  "M212 132L132 212M196 44L44 196",
  "M45.125 134.46C45.125 148.06 54.6705 159.909 68.1345 161.89C77.374 163.25 86.707 164.295 96.125 165.026V204.5L130.771 169.854C133.121 167.519 136.274 166.172 139.585 166.089C155.747 165.641 171.869 164.239 187.865 161.89C201.329 159.909 210.875 148.069 210.875 134.452V83.2985C210.875 69.6815 201.329 57.841 187.865 55.8605C168.043 52.9511 148.035 51.4937 128 51.5C107.668 51.5 87.676 52.9875 68.1345 55.8605C54.6705 57.841 45.125 69.69 45.125 83.2985V134.452V134.46Z",
]

type CircleRef = SVGCircleElement | null
type PathRef = SVGPathElement | null

export default function FluidMorph() {
  const [index, setIndex] = useState(0)
  const circles = useRef<CircleRef[]>([])
  const paths = useRef<PathRef[]>([])

  const nbOfCircles = 60
  const radius = 10

  useEffect(() => {
    const currentPath = paths.current[index]
    if (currentPath) {
      const length = currentPath.getTotalLength()
      const step = length / nbOfCircles

      circles.current.forEach((circle, i) => {
        if (circle && currentPath) {
          const { x, y } = currentPath.getPointAtLength(i * step)
          animate(
            circle,
            { cx: x, cy: y },
            { delay: i * 0.015, ease: "easeOut", type: "spring" }
          )
        }
      })
    }
  }, [index])

  return (
    <main className="flex flex-col items-center justify-center">
      <svg
        viewBox="0 0 256 256"
        className="w-[500px]"
        style={{ filter: "url(#filter)" }}
      >
        <defs>
          <filter id="filter">
            <feGaussianBlur stdDeviation="12" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 25 -15"
              result="filter"
            />
          </filter>
        </defs>
        <g>
          {numbers.map((path, i) => (
            <path
              className="hidden"
              key={`p_${i}`}
              ref={(ref) => {
                if (ref) paths.current[i] = ref
              }}
              d={path}
            />
          ))}
        </g>

        <g>
          {[...Array(nbOfCircles)].map((_, i) => (
            <circle
              className="fill-light12 dark:fill-dark12"
              key={`c_${i}`}
              ref={(ref) => {
                if (ref) circles.current[i] = ref
              }}
              cx="128"
              cy="128"
              r={radius}
            />
          ))}
        </g>
      </svg>
      <div className="flex cursor-pointer flex-row gap-4 text-3xl">
        {numbers.map((_, i) => (
          <span
            key={i}
            className={`flex h-12 w-12 items-center justify-center rounded-full border border-light3 bg-light1 text-sm transition disabled:opacity-50 dark:border-dark3 dark:bg-dark1 ${
              i === index
                ? "cursor-not-allowed text-amber-500"
                : "cursor-pointer text-light12 dark:text-dark12"
            }`}
            onClick={() => setIndex(i)}
          >
            {i + 1}
          </span>
        ))}
      </div>
    </main>
  )
}
