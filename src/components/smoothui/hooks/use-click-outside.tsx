"use client"

import { useEffect, type RefObject } from "react"

type EventType =
  | "mousedown"
  | "mouseup"
  | "touchstart"
  | "touchend"
  | "focusin"
  | "focusout"

export function useClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null> | RefObject<T | null>[],
  handler: (event: Event) => void,
  eventType: EventType = "mousedown"
): void {
  useEffect(() => {
    function callback(event: Event) {
      const target = event.target as Node

      // Do nothing if the target is not connected element with document
      if (!target || !target.isConnected) {
        return
      }

      const isOutside = Array.isArray(ref)
        ? ref
            .filter((r) => Boolean(r.current))
            .every((r) => r.current && !r.current.contains(target))
        : ref.current && !ref.current.contains(target)

      if (isOutside) {
        handler(event)
      }
    }

    window.addEventListener(eventType, callback)

    return () => {
      window.removeEventListener(eventType, callback)
    }
  }, [])
}
