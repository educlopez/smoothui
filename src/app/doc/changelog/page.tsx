import React from "react"

import { Breadcrumbs } from "@/app/doc/_components/breadcrumbs"

const changelogEntries = [
  {
    date: "Feb 04, 2025",
    changes: [
      "Updated all cursor-pointers on components",
      "Created a Changelog page",
      "Refactor the code",
      "Make public the code of the website",
    ],
  },
  {
    date: "Jan 31, 2025",
    changes: ["Added new component: Expandable Cards."],
  },
  {
    date: "Jan 23, 2025",
    changes: ["Redesign of all the website", "Add documentation"],
  },
]

export default function ChangelogPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Breadcrumbs groupName="Documentation" currentPage="Changelog" />
        <div className="space-y-3.5">
          <h1
            data-table-content="Changelog"
            data-level="1"
            className="text-light-950 dark:text-dark-950 text-3xl font-bold -tracking-wide"
          >
            Changelog
          </h1>
        </div>
      </div>
      <div className="space-y-4">
        {changelogEntries.map((entry, index) => (
          <div
            key={index}
            className="border-light-200 dark:border-dark-200 relative flex flex-row gap-8 space-y-3 border-b pb-4"
          >
            <time
              data-table-content={entry.date}
              data-level="2"
              className="flex gap-7"
            >
              <span className="text-light-950 dark:text-dark-950 text-sm font-normal">
                {entry.date}
              </span>
            </time>
            <ul className="text-light-900 dark:text-dark-900 list-disc space-y-2 pl-6 text-sm">
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
