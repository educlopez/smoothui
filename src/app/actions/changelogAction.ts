"use server"

import { changelogEntries } from "@/app/doc/data/changelog"

export const testAction = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  const firstChangelog = changelogEntries[0]
  return {
    changelog: firstChangelog,
  }
}
