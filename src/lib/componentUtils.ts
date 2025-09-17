import type { ComponentsProps } from "@/app/doc/data/typeComponent"

/**
 * Check if a component is considered "new" (created within the last 2 weeks)
 * @param component - The component to check
 * @returns boolean indicating if the component is new
 */
export function isComponentNew(component: ComponentsProps): boolean {
  // If createdAt is not provided, fall back to the manual isNew flag
  if (!component.createdAt) {
    return component.isNew ?? false
  }

  const createdAt = new Date(component.createdAt)
  const now = new Date()
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000) // 14 days in milliseconds

  return createdAt >= twoWeeksAgo
}

/**
 * Generate a random date between two dates
 * @param startDate - Start date
 * @param endDate - End date
 * @returns ISO date string
 */
export function getRandomDate(startDate: Date, endDate: Date): string {
  const start = startDate.getTime()
  const end = endDate.getTime()
  const randomTime = start + Math.random() * (end - start)
  return new Date(randomTime).toISOString()
}

/**
 * Get a date that's exactly N days ago
 * @param daysAgo - Number of days ago
 * @returns ISO date string
 */
export function getDateDaysAgo(daysAgo: number): string {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  return date.toISOString()
}
