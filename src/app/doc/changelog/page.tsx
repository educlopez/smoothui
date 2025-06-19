import React from "react"
import { Metadata } from "next"

import { Breadcrumbs } from "@/components/doc/breadcrumbs"
import { changelogEntries } from "@/app/doc/data/changelog"

export const metadata: Metadata = {
  title: "Changelog",
  description:
    "View the release notes and updates for SmoothUI. Stay up to date with the latest changes in React components, TailwindCSS styles, and animations.",
  alternates: {
    canonical: "/doc/changelog",
  },
  openGraph: {
    title: "SmoothUI Changelog",
    description:
      "Stay up to date with the latest component updates, bug fixes, and improvements to SmoothUI.",
    url: "https://smoothui.dev/doc/changelog",
    siteName: "SmoothUI",
  },
}

export default function ChangelogPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Breadcrumbs groupName="Get Started" currentPage="Changelog" />
        <div className="space-y-3.5">
          <h1
            data-table-content="Changelog"
            data-level="1"
            className="text-foreground text-3xl font-bold -tracking-wide"
          >
            Changelog
          </h1>
        </div>
      </div>
      <div className="space-y-4">
        {changelogEntries.map((entry, index) => (
          <div
            key={index}
            className="relative flex flex-row gap-8 space-y-3 border-b pb-4"
          >
            <time
              data-table-content={entry.date}
              data-level="2"
              className="flex gap-7"
            >
              <span className="text-foreground text-sm font-normal">
                {entry.date}
              </span>
            </time>
            <ul className="text-primary-foreground list-disc space-y-2 pl-6 text-sm">
              {entry.changes.map((change, idx) => (
                <li key={idx}>{change}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
