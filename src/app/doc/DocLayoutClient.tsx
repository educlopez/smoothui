"use client"

import { usePathname } from "next/navigation"

import TableOfContent from "@/components/doc/tableOfContent"

export function DocLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isBlockPage = pathname.includes("/doc/blocks/")

  return (
    <div
      className={
        isBlockPage
          ? "lg:grid lg:grid-cols-1 2xl:grid-cols-1"
          : "lg:grid lg:grid-cols-[1fr] 2xl:grid-cols-[1fr_248px]"
      }
    >
      <div
        className={
          isBlockPage
            ? "mb-20 w-full px-4 pt-8 md:mb-10 lg:p-8"
            : "mb-20 grid-cols-[1fr_760px_1fr] px-4 pt-8 *:col-start-2 md:mb-10 lg:grid lg:p-8"
        }
      >
        {children}
      </div>
      {!isBlockPage && <TableOfContent />}
    </div>
  )
}
