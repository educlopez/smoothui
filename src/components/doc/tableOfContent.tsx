"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { ListTree } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

interface TableOfContentItem {
  id: string
  text: string
  level: number
}

export default function TableOfContent() {
  const [headings, setHeadings] = useState<TableOfContentItem[]>([])
  const pathname = usePathname()
  const [activeId, setActiveId] = useState<string>("")

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

  useEffect(() => {
    const handleScroll = () => {
      const headingElements = headings
        .map(({ id }) => document.getElementById(id))
        .filter((el): el is HTMLElement => el !== null)

      const headingPositions = headingElements.map((el) => ({
        id: el.id,
        top: el.getBoundingClientRect().top,
      }))

      const activeHeading =
        headingPositions.find((heading) => heading.top > 0) ||
        headingPositions[headingPositions.length - 1]

      if (activeHeading) {
        setActiveId(activeHeading.id)
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Call once to set initial state

    return () => window.removeEventListener("scroll", handleScroll)
  }, [headings])

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
    <aside className="sticky top-20 z-30 hidden h-fit -translate-x-2 p-6 2xl:block">
      <span className="text-foreground flex items-center gap-2 text-[13px]">
        <ListTree size={16} />
        Table of content
      </span>
      <div className="relative">
        <ul className="mt-4 space-y-2 border-l pl-2">
          {headings.map((heading, index) => (
            <li key={index} className="relative flex h-fit">
              <AnimatePresence mode="wait">
                {heading.id === activeId && (
                  <motion.div
                    aria-hidden="true"
                    className="bg-brand absolute left-0 h-5 w-[3px] -translate-x-[10px] rounded-full"
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                    layoutId="indicator"
                  />
                )}
              </AnimatePresence>
              <a
                href={`#${heading.id}`}
                className={`${getMarginClass(heading.level)} ${
                  heading.id === activeId
                    ? "text-foreground"
                    : "text-primary-foreground hover:text-foreground"
                } inline-block h-5 truncate text-[13px] no-underline transition-all`}
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
