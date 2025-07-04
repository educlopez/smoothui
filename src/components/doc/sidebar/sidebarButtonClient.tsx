"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { CalendarClock, PackagePlus } from "lucide-react"

import { cn } from "@/components/smoothui/utils/cn"

type SidebarButton = {
  slug: string
  name: string
  isNew?: boolean
  onClick?: () => void
  isUpdated?: boolean
}

export function SidebarButtonClient({
  name,
  slug,
  isNew = false,
  isUpdated = false,
  onClick,
}: SidebarButton) {
  const pathname = usePathname()

  const isActive = pathname === slug

  return (
    <Link
      href={slug}
      onClick={onClick}
      data-active={isActive}
      className={cn(
        "text-foreground group/link hover:bg-primary relative z-0 flex w-full cursor-pointer items-center justify-between gap-[6px] rounded-md p-2 text-xs ease-in-out",
        isActive
          ? "bg-brand-secondary/20 text-brand hover:bg-brand-secondary/30 z-0 font-medium"
          : "text-foreground hover:bg-background"
      )}
    >
      {isNew ? (
        <>
          <div className="flex items-center gap-2">
            <span className="truncate">{name}</span>
          </div>
          <span className="absolute right-1 z-2 flex flex-row items-center justify-center gap-1 rounded-md bg-amber-50 py-0.5 pl-1 text-[10px] leading-4 font-semibold text-amber-600 dark:bg-amber-950">
            <PackagePlus size={12} />
            <span className="w-0 overflow-hidden opacity-0 transition-all duration-200 group-hover/link:w-auto group-hover/link:pr-1 group-hover/link:opacity-100">
              New
            </span>
          </span>
        </>
      ) : isUpdated ? (
        <>
          <div className="flex items-center gap-2">
            <span className="truncate">{name}</span>
          </div>
          <span className="absolute right-1 z-2 flex flex-row items-center justify-center gap-1 rounded-md bg-pink-100 py-0.5 pl-1 text-[10px] leading-4 font-semibold text-pink-600 dark:bg-pink-950 dark:text-pink-400">
            <CalendarClock size={12} />
            <span className="w-0 overflow-hidden opacity-0 transition-all duration-200 group-hover/link:w-auto group-hover/link:pr-1 group-hover/link:opacity-100">
              Updated
            </span>
          </span>
        </>
      ) : (
        <div className="flex items-center gap-2">
          {" "}
          <span className="truncate">{name}</span>
        </div>
      )}
    </Link>
  )
}
