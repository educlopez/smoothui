import { useCallback, useRef, useState } from "react"

export function useScrollOpacity(
  divisor: number = 15,
  min: number = 0,
  max: number = 1
) {
  const [opacity, setOpacity] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const scrollTop = e.currentTarget.scrollTop
      const clamped = Math.max(min, Math.min(max, scrollTop / divisor))
      setOpacity(clamped)
    },
    [divisor, min, max]
  )

  return { ref, opacity, handleScroll }
}
