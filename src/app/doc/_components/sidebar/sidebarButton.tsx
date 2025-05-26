"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { CalendarClock, PackagePlus } from "lucide-react"

import { cn } from "@/app/utils/cn"

type SidebarButton = {
  slug: string
  name: string
  isNew?: boolean
  onClick?: () => void
  isUpdated?: boolean
}

export function SidebarButton({
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
        "group relative mt-1 rounded-lg px-2 py-1.5 text-sm font-normal select-none",
        isActive
          ? "bg-background text-candy z-0 border font-medium"
          : "text-foreground hover:bg-background"
      )}
    >
      {isNew ? (
        <div className="relative z-1 flex items-center justify-start gap-2">
          <span className="relative z-1 block text-[13px]">{name}</span>
          <span className="absolute right-0 z-2 flex flex-row items-center justify-center gap-1 rounded-md bg-amber-50 py-0.5 pl-1 text-[10px] leading-4 font-semibold text-amber-600 dark:bg-amber-950">
            <PackagePlus size={12} />
            <span className="w-0 overflow-hidden opacity-0 transition-all duration-200 group-hover:w-auto group-hover:pr-1 group-hover:opacity-100">
              New
            </span>
          </span>
        </div>
      ) : isUpdated ? (
        <div className="relative z-1 flex items-center justify-start gap-2">
          <span className="relative z-1 block text-[13px]">{name}</span>
          <span className="absolute right-0 z-2 flex flex-row items-center justify-center gap-1 rounded-md bg-pink-100 py-0.5 pl-1 text-[10px] leading-4 font-semibold text-pink-600 dark:bg-pink-950 dark:text-pink-400">
            <CalendarClock size={12} />
            <span className="w-0 overflow-hidden opacity-0 transition-all duration-200 group-hover:w-auto group-hover:pr-1 group-hover:opacity-100">
              Updated
            </span>
          </span>
        </div>
      ) : (
        <span className="relative z-1 block text-[13px]">{name}</span>
      )}
    </Link>
  )
}
