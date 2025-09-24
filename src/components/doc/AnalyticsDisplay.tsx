"use client"

import { motion } from "motion/react"

import { useAnalytics } from "@/hooks/useAnalytics"

interface AnalyticsDisplayProps {
  pageId: string
  componentId?: string
  showCopyCount?: boolean
  showViews?: boolean
  className?: string
}

export function AnalyticsDisplay({
  pageId,
  componentId,
  showCopyCount = true,
  showViews = true,
  className = "",
}: AnalyticsDisplayProps) {
  const { analytics, componentStats, loading } = useAnalytics(
    pageId,
    componentId
  )

  if (loading) {
    return (
      <div className={`text-muted-foreground flex gap-4 text-sm ${className}`}>
        <div className="bg-muted h-4 w-16 animate-pulse rounded" />
        <div className="bg-muted h-4 w-16 animate-pulse rounded" />
      </div>
    )
  }

  return (
    <div className={`text-muted-foreground flex gap-4 text-sm ${className}`}>
      {showViews && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-1"
        >
          <span>👁️</span>
          <span>{analytics.pageViews.toLocaleString()} views</span>
        </motion.div>
      )}
      {showCopyCount && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex items-center gap-1"
        >
          <span>📋</span>
          <span>{analytics.copyCount.toLocaleString()} copies</span>
        </motion.div>
      )}
      {componentId && componentStats.copies > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="flex items-center gap-1"
        >
          <span>⭐</span>
          <span>{componentStats.copies.toLocaleString()} component copies</span>
        </motion.div>
      )}
    </div>
  )
}
