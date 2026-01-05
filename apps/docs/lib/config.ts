/**
 * Site-wide configuration
 */
export const siteConfig = {
  /**
   * Number of days to consider a component "recently modified"
   * Components modified within this threshold will show the indicator
   */
  recentModifiedThreshold: 7,

  /**
   * Enable or disable recent modification indicators in the sidebar
   */
  showRecentModifications: true,
} as const;
