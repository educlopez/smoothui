import { Redis } from "@upstash/redis"

// Initialize Upstash Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export interface AnalyticsData {
  pageViews: number
  copyCount: number
  lastUpdated: string
}

export interface ComponentStats {
  views: number
  copies: number
  likes: number
}

// KV Storage utilities for dynamic data
export class KVStorage {
  // Analytics data
  static async getPageViews(pageId: string): Promise<number> {
    try {
      const data = await redis.get<AnalyticsData>(`analytics:${pageId}`)
      return data?.pageViews || 0
    } catch (error) {
      console.error("Failed to get page views:", error)
      return 0
    }
  }

  static async incrementPageViews(pageId: string): Promise<number> {
    try {
      const key = `analytics:${pageId}`
      const current = await redis.get<AnalyticsData>(key)
      const newViews = (current?.pageViews || 0) + 1

      await redis.set(key, {
        pageViews: newViews,
        copyCount: current?.copyCount || 0,
        lastUpdated: new Date().toISOString(),
      })

      return newViews
    } catch (error) {
      console.error("Failed to increment page views:", error)
      return 0
    }
  }

  static async getCopyCount(pageId: string): Promise<number> {
    try {
      const data = await redis.get<AnalyticsData>(`analytics:${pageId}`)
      return data?.copyCount || 0
    } catch (error) {
      console.error("Failed to get copy count:", error)
      return 0
    }
  }

  static async incrementCopyCount(pageId: string): Promise<number> {
    try {
      const key = `analytics:${pageId}`
      const current = await redis.get<AnalyticsData>(key)
      const newCopies = (current?.copyCount || 0) + 1

      await redis.set(key, {
        pageViews: current?.pageViews || 0,
        copyCount: newCopies,
        lastUpdated: new Date().toISOString(),
      })

      return newCopies
    } catch (error) {
      console.error("Failed to increment copy count:", error)
      return 0
    }
  }

  // Component-specific stats
  static async getComponentStats(componentId: string): Promise<ComponentStats> {
    try {
      const data = await redis.get<ComponentStats>(`component:${componentId}`)
      return data || { views: 0, copies: 0, likes: 0 }
    } catch (error) {
      console.error("Failed to get component stats:", error)
      return { views: 0, copies: 0, likes: 0 }
    }
  }

  static async incrementComponentViews(
    componentId: string
  ): Promise<ComponentStats> {
    try {
      const key = `component:${componentId}`
      const current = await redis.get<ComponentStats>(key)
      const newStats = {
        views: (current?.views || 0) + 1,
        copies: current?.copies || 0,
        likes: current?.likes || 0,
      }

      await redis.set(key, newStats)
      return newStats
    } catch (error) {
      console.error("Failed to increment component views:", error)
      return { views: 0, copies: 0, likes: 0 }
    }
  }

  static async incrementComponentCopies(
    componentId: string
  ): Promise<ComponentStats> {
    try {
      const key = `component:${componentId}`
      const current = await redis.get<ComponentStats>(key)
      const newStats = {
        views: current?.views || 0,
        copies: (current?.copies || 0) + 1,
        likes: current?.likes || 0,
      }

      await redis.set(key, newStats)
      return newStats
    } catch (error) {
      console.error("Failed to increment component copies:", error)
      return { views: 0, copies: 0, likes: 0 }
    }
  }

  // Global stats
  static async getGlobalStats(): Promise<{
    totalViews: number
    totalCopies: number
    totalComponents: number
  }> {
    try {
      const data = await redis.get<{
        totalViews: number
        totalCopies: number
        totalComponents: number
      }>("global:stats")

      return data || { totalViews: 0, totalCopies: 0, totalComponents: 0 }
    } catch (error) {
      console.error("Failed to get global stats:", error)
      return { totalViews: 0, totalCopies: 0, totalComponents: 0 }
    }
  }
}
