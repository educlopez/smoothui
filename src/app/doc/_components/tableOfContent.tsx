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
    // Get all elements with data-table-content attribute
    const contentElements = document.querySelectorAll("[data-table-content]")
    if (!contentElements.length) return

    // Convert NodeList to array of TableOfContentItems
    const headingItems: TableOfContentItem[] = Array.from(contentElements).map(
      (element) => {
        // Get heading level from data attribute or default to 2
        const level = parseInt(element.getAttribute("data-level") || "2")
        const id =
          element.id || element.getAttribute("data-table-content") || ""

        // If no ID exists, create one from the text content
        if (!element.id) {
          element.id = id.toLowerCase().replace(/\s+/g, "-")
        }

        return {
          id: element.id,
          text:
            element.getAttribute("data-table-content") ||
            element.textContent ||
            "",
          level: level,
        }
      }
    )

    setHeadings(headingItems)
  }, [pathname])

  const getMarginClass = (level: number) => {
    switch (level) {
      case 1:
        return "ml-1"
      case 2:
        return "ml-2"
      case 3:
        return "ml-4"
      case 4:
        return "ml-6"
      case 5:
        return "ml-8"
      case 6:
        return "ml-10"
      default:
        return "ml-2"
    }
  }

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
                className={`${getMarginClass(heading.level)} inline-block h-5 truncate text-[13px] text-light11 no-underline transition-all hover:text-light12 dark:text-dark11 dark:hover:text-dark12`}
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
