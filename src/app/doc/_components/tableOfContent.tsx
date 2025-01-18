"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

interface TableOfContentItem {
  id: string
  text: string
  level: number
}

export default function TableOfContent() {
  const [headings, setHeadings] = useState<TableOfContentItem[]>([])
  const pathname = usePathname()

  useEffect(() => {
    // Get all heading elements h1-h6
    const headingElements = document.querySelectorAll("h1, h2, h3, h4, h5, h6")

    // Convert NodeList to array of TableOfContentItems
    const headingItems: TableOfContentItem[] = Array.from(headingElements).map(
      (heading) => {
        // Get heading level from tag name (h1 = 1, h2 = 2, etc)
        const level = parseInt(heading.tagName[1])

        // Generate id if not present
        if (!heading.id) {
          heading.id =
            heading.textContent?.toLowerCase().replace(/\s+/g, "-") || ""
        }

        return {
          id: heading.id,
          text: heading.textContent || "",
          level: level,
        }
      }
    )

    setHeadings(headingItems)
  }, [pathname]) // Add pathname as dependency

  return (
    <aside className="sticky top-0 hidden h-fit -translate-x-2 p-6 2xl:block">
      <span className="flex items-center gap-2 text-[13px] text-light12 dark:text-dark12">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M2.75 12H21.25M2.75 5.75H21.25M2.75 18.25H11.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Table of content
      </span>
      <div className="relative">
        <div
          aria-hidden="true"
          className="bg-gray-1200 absolute left-0 h-5 w-[3px] -translate-x-[1px] rounded-full"
        />
        <ul className="mt-4 space-y-2 border-l border-l-dark10 pl-2">
          {headings.map((heading, index) => (
            <li key={index} className="flex h-fit">
              <a
                href={`#${heading.id}`}
                className={`ml-${heading.level} inline-block h-5 truncate text-[13px] text-light11 no-underline transition-all hover:text-light12 dark:text-dark11 dark:hover:text-dark12`}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}
