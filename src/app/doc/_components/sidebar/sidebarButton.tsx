"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

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
        "relative -mx-2.5 mt-1 select-none rounded-lg px-2 py-1.5 text-sm font-normal",
        isActive
          ? "z-0 bg-light3 dark:bg-dark4"
          : "text-light11 hover:bg-light3 dark:text-dark11 dark:hover:bg-dark4"
      )}
    >
      {isNew ? (
        <div className="relative z-1 flex items-center justify-between">
          <span className="relative z-1 block text-[13px]">{name}</span>
          <span className="rounded-md bg-amber-600/10 px-1.5 py-[0.5px] text-[10px] font-semibold leading-4 text-amber-600 dark:bg-amber-600/15">
            New
          </span>
        </div>
      ) : isUpdated ? (
        <div className="relative z-1 flex items-center justify-between">
          <span className="relative z-1 block text-[13px]">{name}</span>
          <span className="rounded-md bg-pink-600/10 px-1.5 py-[0.5px] text-[10px] font-semibold leading-4 text-pink-600 dark:bg-pink-600/15">
            Updated
          </span>
        </div>
      ) : (
        <span className="relative z-1 block text-[13px]">{name}</span>
      )}
    </Link>
  )
}
