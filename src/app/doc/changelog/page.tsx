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
          <div key={index} className="relative m-0">
            <div className="flex flex-col gap-y-6 md:flex-row">
              <div className="flex-shrink-0 md:w-48">
                <div className="pb-10 md:sticky md:top-8">
                  <time className="text-muted-foreground mb-3 block text-sm font-medium">
                    {entry.date}
                  </time>
                  {entry.version && (
                    <div className="text-foreground border-border relative z-10 inline-flex items-center justify-center rounded-lg border px-2 py-1 text-sm font-bold">
                      {entry.version}
                    </div>
                  )}
                </div>
              </div>
              <div className="relative flex-1 pb-10 md:pl-8">
                <div className="bg-border absolute top-2 left-0 hidden h-full w-px md:block">
                  <div className="bg-primary absolute z-10 hidden size-3 -translate-x-1/2 rounded-full border md:block" />
                </div>
                <div className="space-y-6">
                  <div className="relative z-10 flex flex-col gap-2">
                    <h2 className="text-2xl font-semibold tracking-tight text-balance">
                      {entry.title || `Release ${entry.version}`}
                    </h2>
                    {entry.tags && (
                      <div className="flex flex-wrap gap-2">
                        {entry.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="bg-muted text-muted-foreground flex h-6 w-fit items-center justify-center rounded-full border px-2 text-xs font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="prose dark:prose-invert prose-headings:scroll-mt-8 prose-headings:font-semibold prose-a:no-underline prose-headings:tracking-tight prose-headings:text-balance prose-p:tracking-tight prose-p:text-balance max-w-none text-sm">
                    <ul>
                      {entry.changes.map((change, idx) => (
                        <li key={idx}>{change}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
