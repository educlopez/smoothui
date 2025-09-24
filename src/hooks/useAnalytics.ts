"use client"

import { useCallback, useEffect, useState } from "react"

interface AnalyticsData {
  pageViews: number
  copyCount: number
}

interface ComponentStats {
  views: number
  copies: number
  likes: number
}

export function useAnalytics(pageId: string, componentId?: string) {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    pageViews: 0,
    copyCount: 0,
  })
  const [componentStats, setComponentStats] = useState<ComponentStats>({
    views: 0,
    copies: 0,
    likes: 0,
  })
  const [loading, setLoading] = useState(true)

  // Track page view on mount
  useEffect(() => {
    const trackPageView = async () => {
      try {
        await fetch("/api/analytics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "pageView", pageId, componentId }),
        })

        // Also track component view if componentId is provided
        if (componentId) {
          await fetch("/api/analytics", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: "componentView",
              pageId,
              componentId,
            }),
          })
        }
      } catch (error) {
        console.error("Failed to track page view:", error)
      }
    }

    trackPageView()
  }, [pageId, componentId])

  // Load analytics data
  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true)

        // Load page analytics
        const [pageViewsRes, copyCountRes] = await Promise.all([
          fetch(`/api/analytics?type=pageViews&pageId=${pageId}`),
          fetch(`/api/analytics?type=copyCount&pageId=${pageId}`),
        ])

        const [pageViewsData, copyCountData] = await Promise.all([
          pageViewsRes.json(),
          copyCountRes.json(),
        ])

        setAnalytics({
          pageViews: pageViewsData.data || 0,
          copyCount: copyCountData.data || 0,
        })

        // Load component stats if componentId is provided
        if (componentId) {
          const componentStatsRes = await fetch(
            `/api/analytics?type=componentStats&componentId=${componentId}`
          )
          const componentStatsData = await componentStatsRes.json()
          setComponentStats(
            componentStatsData.data || { views: 0, copies: 0, likes: 0 }
          )
        }
      } catch (error) {
        console.error("Failed to load analytics:", error)
      } finally {
        setLoading(false)
      }
    }

    loadAnalytics()
  }, [pageId, componentId])

  const trackCopy = useCallback(async () => {
    try {
      const response = await fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "copy", pageId, componentId }),
      })

      if (response.ok) {
        const data = await response.json()
        setAnalytics((prev) => ({ ...prev, copyCount: data.data }))

        if (componentId) {
          setComponentStats((prev) => ({ ...prev, copies: prev.copies + 1 }))
        }
      }
    } catch (error) {
      console.error("Failed to track copy:", error)
    }
  }, [pageId, componentId])

  return {
    analytics,
    componentStats,
    loading,
    trackCopy,
  }
}

export function useGlobalStats() {
  const [stats, setStats] = useState<{
    totalViews: number
    totalCopies: number
    totalComponents: number
  }>({ totalViews: 0, totalCopies: 0, totalComponents: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/analytics?type=globalStats")
        const data = await response.json()
        setStats(
          data.data || { totalViews: 0, totalCopies: 0, totalComponents: 0 }
        )
      } catch (error) {
        console.error("Failed to load global stats:", error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  return { stats, loading }
}
