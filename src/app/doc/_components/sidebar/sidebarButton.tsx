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
        "relative mt-1 rounded-lg px-2 py-1.5 text-sm font-normal select-none",
        isActive
          ? "bg-light-200 dark:bg-dark-300 z-0"
          : "text-light-900 hover:bg-light-200 dark:text-dark-900 dark:hover:bg-dark-300"
      )}
    >
      {isNew ? (
        <div className="relative z-1 flex items-center justify-start gap-2">
          <span className="relative z-1 block text-[13px]">{name}</span>
          <span className="rounded-md bg-amber-600/10 p-0.5 text-[10px] leading-4 font-semibold text-amber-600 dark:bg-amber-600/15">
            <PackagePlus size={12} />
          </span>
        </div>
      ) : isUpdated ? (
        <div className="relative z-1 flex items-center justify-start gap-2">
          <span className="relative z-1 block text-[13px]">{name}</span>
          <span className="rounded-md bg-pink-600/10 p-0.5 text-[10px] leading-4 font-semibold text-pink-600 dark:bg-pink-600/15">
            <CalendarClock size={12} />
          </span>
        </div>
      ) : (
        <span className="relative z-1 block text-[13px]">{name}</span>
      )}
    </Link>
  )
}
