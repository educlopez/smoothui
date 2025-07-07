"use client"

import React from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"

interface PagerItem {
  slug: string
  componentTitle: string
  info: string
}

interface ComponentPagerProps {
  group: string
  slug: string
  components: PagerItem[]
}

export const ComponentPager: React.FC<ComponentPagerProps> = ({
  group,
  slug,
  components,
}) => {
  const idx = components.findIndex((c) => c.slug === slug)
  if (idx === -1) return null
  const prev = idx > 0 ? components[idx - 1] : null
  const next = idx < components.length - 1 ? components[idx + 1] : null

  return (
    <div className="mt-12 mb-2 flex w-full flex-col justify-center gap-6 md:flex-row">
      {prev && (
        <div className="flex-1">
          <Link
            href={`/doc/${group}/${prev.slug}`}
            className="bg-primary hover:bg-background block rounded-2xl border px-6 py-6 text-left transition-colors"
          >
            <div className="mb-2 flex items-center gap-2 font-semibold">
              <ArrowLeft className="h-5 w-5 transition-colors" />
              {prev.componentTitle}
            </div>
            <div className="text-primary-foreground line-clamp-1 text-base">
              {prev.info}
            </div>
          </Link>
        </div>
      )}
      {next && (
        <div className="flex-1 text-right">
          <Link
            href={`/doc/${group}/${next.slug}`}
            className="bg-primary hover:bg-background block rounded-2xl border px-6 py-6 text-left transition-colors"
          >
            <div className="mb-2 flex items-center justify-end gap-2 font-semibold">
              {next.componentTitle}
              <ArrowRight className="h-5 w-5 transition-colors" />
            </div>
            <div className="text-primary-foreground line-clamp-1 text-base">
              {next.info}
            </div>
          </Link>
        </div>
      )}
    </div>
  )
}

export default ComponentPager
