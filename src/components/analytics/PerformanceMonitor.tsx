"use client"

import { useEffect, useRef } from "react"

interface PerformanceMetrics {
  fcp: number | null
  lcp: number | null
  fid: number | null
  cls: number | null
  ttfb: number | null
}

// Extend PerformanceEntry for resource timing
interface PerformanceResourceTiming extends PerformanceEntry {
  transferSize?: number
  encodedBodySize?: number
  decodedBodySize?: number
}

export function PerformanceMonitor() {
  const metricsRef = useRef<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
  })

  useEffect(() => {
    if (typeof window === "undefined") return

    // First Contentful Paint
    const fcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const fcpEntry = entries.find(
        (entry) => entry.name === "first-contentful-paint"
      )
      if (fcpEntry) {
        metricsRef.current.fcp = fcpEntry.startTime
        console.log("FCP:", fcpEntry.startTime)
      }
    })

    // Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lcpEntry = entries[entries.length - 1]
      if (lcpEntry) {
        metricsRef.current.lcp = lcpEntry.startTime
        console.log("LCP:", lcpEntry.startTime)
      }
    })

    // First Input Delay
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry) => {
        // Use the correct Performance API properties for FID
        if ("processingStart" in entry && "startTime" in entry) {
          const processingStart = (entry as any).processingStart
          const startTime = entry.startTime
          if (processingStart && startTime) {
            metricsRef.current.fid = processingStart - startTime
            console.log("FID:", processingStart - startTime)
          }
        }
      })
    })

    // Cumulative Layout Shift
    const clsObserver = new PerformanceObserver((list) => {
      let clsValue = 0
      list.getEntries().forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value
        }
      })
      metricsRef.current.cls = clsValue
      console.log("CLS:", clsValue)
    })

    // Time to First Byte
    const navigationEntry = performance.getEntriesByType(
      "navigation"
    )[0] as PerformanceNavigationTiming
    if (navigationEntry) {
      metricsRef.current.ttfb =
        navigationEntry.responseStart - navigationEntry.requestStart
      console.log(
        "TTFB:",
        navigationEntry.responseStart - navigationEntry.requestStart
      )
    }

    try {
      fcpObserver.observe({ entryTypes: ["paint"] })
      lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] })
      fidObserver.observe({ entryTypes: ["first-input"] })
      clsObserver.observe({ entryTypes: ["layout-shift"] })
    } catch (error) {
      console.warn("Performance Observer not supported:", error)
    }

    // Report metrics to analytics if available
    const reportMetrics = () => {
      const metrics = metricsRef.current
      if (window.gtag) {
        window.gtag("event", "performance_metrics", {
          event_category: "performance",
          fcp: metrics.fcp,
          lcp: metrics.lcp,
          fid: metrics.fid,
          cls: metrics.cls,
          ttfb: metrics.ttfb,
        })
      }
    }

    // Report after a delay to ensure all metrics are collected
    const reportTimeout = setTimeout(reportMetrics, 5000)

    return () => {
      fcpObserver.disconnect()
      lcpObserver.disconnect()
      fidObserver.disconnect()
      clsObserver.disconnect()
      clearTimeout(reportTimeout)
    }
  }, [])

  // Monitor resource usage
  useEffect(() => {
    if (typeof window === "undefined") return

    const monitorResources = () => {
      // Monitor memory usage
      if ((performance as any).memory) {
        const memory = (performance as any).memory
        console.log("Memory Usage:", {
          used: Math.round(memory.usedJSHeapSize / 1048576) + " MB",
          total: Math.round(memory.totalJSHeapSize / 1048576) + " MB",
          limit: Math.round(memory.jsHeapSizeLimit / 1048576) + " MB",
        })
      }

      // Monitor network requests
      const resources = performance.getEntriesByType(
        "resource"
      ) as PerformanceResourceTiming[]
      const totalSize = resources.reduce((acc, resource) => {
        return acc + (resource.transferSize || 0)
      }, 0)

      console.log("Total Resource Size:", Math.round(totalSize / 1024) + " KB")
      console.log("Number of Resources:", resources.length)
    }

    // Monitor after page load
    if (document.readyState === "complete") {
      monitorResources()
    } else {
      window.addEventListener("load", monitorResources)
    }

    return () => {
      window.removeEventListener("load", monitorResources)
    }
  }, [])

  return null // This component doesn't render anything
}

// Add to global types
declare global {
  interface Window {
    gtag?: (...args: any[]) => void
  }
}
