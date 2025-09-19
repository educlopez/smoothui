import * as React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Bot, Sparkles } from "lucide-react"

import { isComponentNew } from "@/lib/componentUtils"
import { Button } from "@/components/button"
import { Breadcrumbs } from "@/components/doc/breadcrumbs"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { aiComponents } from "@/app/doc/data/aiComponents"
import { basicComponents } from "@/app/doc/data/basicComponents"
import { components } from "@/app/doc/data/components"
import { textComponents } from "@/app/doc/data/textComponentes"

const groupDataMap = {
  ai: {
    title: "AI Components",
    description:
      "AI-powered components for building intelligent user interfaces with chat, reasoning, and response capabilities.",
    components: aiComponents,
    icon: Bot,
    featuredCount: 6, // Show first 6 components
    relatedGroups: [
      { name: "Basic Components", href: "/doc/basic" },
      { name: "Advanced Components", href: "/doc/components" },
    ],
  },
  basic: {
    title: "Basic Components",
    description:
      "Essential UI components with smooth animations built with TailwindCSS and Framer Motion.",
    components: basicComponents,
    featuredCount: 6, // Show first 6 components
    relatedGroups: [
      { name: "Advanced Components", href: "/doc/components" },
      { name: "Text Components", href: "/doc/text" },
    ],
  },
  text: {
    title: "Text Components",
    description:
      "Animated text components with stunning effects built with TailwindCSS and Framer Motion.",
    components: textComponents,
    featuredCount: 6, // Show first 6 components
    relatedGroups: [
      { name: "Basic Components", href: "/doc/basic" },
      { name: "Advanced Components", href: "/doc/components" },
    ],
  },
  components: {
    title: "Advanced Components",
    description:
      "Complex and interactive components for sophisticated user interfaces.",
    components: components,
    featuredCount: 6, // Show first 6 components
    relatedGroups: [
      { name: "Basic Components", href: "/doc/basic" },
      { name: "Text Components", href: "/doc/text" },
    ],
  },
} as const

export async function generateMetadata({
  params,
}: {
  params: Promise<{ group: string }>
}): Promise<Metadata> {
  const { group } = await params
  const groupData = groupDataMap[group as keyof typeof groupDataMap]

  if (!groupData) {
    return {
      title: "Group Not Found",
    }
  }

  return {
    title: groupData.title,
    description: groupData.description,
    alternates: {
      canonical: `/doc/${group}`,
    },
    openGraph: {
      title: `${groupData.title} - SmoothUI`,
      description: groupData.description,
      type: "website",
      url: `/doc/${group}`,
      images: [
        {
          width: 1920,
          height: 1080,
          url: `/api/og?title=${encodeURIComponent(groupData.title)}&description=${encodeURIComponent(groupData.description)}`,
          alt: `SmoothUI ${groupData.title} showcase`,
        },
      ],
      siteName: "SmoothUI",
    },
    twitter: {
      title: `${groupData.title} - SmoothUI`,
      description: groupData.description,
      card: "summary_large_image",
      images: [
        {
          width: 1920,
          height: 1080,
          url: `/api/og?title=${encodeURIComponent(groupData.title)}&description=${encodeURIComponent(groupData.description)}`,
          alt: `SmoothUI ${groupData.title} showcase`,
        },
      ],
      site: "@educalvolpz",
      creator: "@educalvolpz",
    },
  }
}

export default async function GroupPage({
  params,
}: {
  params: Promise<{ group: string }>
}) {
  const { group } = await params
  const groupData = groupDataMap[group as keyof typeof groupDataMap]

  if (!groupData) {
    return (
      <div className="container mx-auto max-w-4xl space-y-4 px-4 py-8">
        <h1 className="text-4xl font-bold tracking-tight">Group Not Found</h1>
        <p className="text-foreground/70 mt-4 text-lg">
          The requested component group does not exist.
        </p>
      </div>
    )
  }

  const IconComponent = "icon" in groupData ? groupData.icon : undefined
  const featuredComponents = groupData.components.slice(
    0,
    groupData.featuredCount
  )

  return (
    <div className="container mx-auto max-w-4xl space-y-4 px-4 py-8">
      <Breadcrumbs
        category="Documentation"
        groupName={groupData.title}
        backLink="/doc"
        currentPage="Overview"
      />

      <div className="mb-8">
        <h1
          className="text-4xl font-bold tracking-tight"
          data-table-content={groupData.title}
          data-level="1"
        >
          {groupData.title}
        </h1>
        <p className="text-foreground/70 mt-4 text-lg">
          {groupData.description}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {featuredComponents.map((component) => (
          <Card
            key={component.id}
            className="group !gap-0 !shadow-none transition-all duration-200"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle
                    className="group-hover:text-brand text-lg transition-colors"
                    data-table-content={component.componentTitle}
                    data-level="2"
                  >
                    {component.componentTitle}
                  </CardTitle>
                  {isComponentNew(component) ||
                    (component.isUpdated && (
                      <div className="mt-2 flex items-center gap-2">
                        {isComponentNew(component) && (
                          <Badge
                            variant="secondary"
                            className="bg-amber-50 text-xs text-amber-600 dark:bg-amber-950"
                          >
                            {IconComponent ? (
                              <IconComponent className="mr-1 h-3 w-3" />
                            ) : (
                              <Sparkles className="mr-1 h-3 w-3" />
                            )}
                            New
                          </Badge>
                        )}
                        {component.isUpdated && (
                          <Badge variant="outline" className="text-xs">
                            Updated
                          </Badge>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="text-foreground/70 mb-4 line-clamp-2 text-sm">
                {component.info}
              </CardDescription>

              {/* Component Demo */}
              <div className="frame-box relative mb-4 rounded-lg p-4">
                <div className="relative z-10 flex aspect-square min-h-52 items-center justify-center">
                  {component.componentUi &&
                    React.createElement(component.componentUi)}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-foreground text-xs">
                  {component.download}
                </div>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="group-hover:bg-brand/10 group-hover:text-brand transition-colors"
                >
                  <Link href={`/doc/${group}/${component.slug}`}>
                    View Component
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-primary mt-12 rounded-lg border p-6">
        <h3 className="mb-2 text-lg font-semibold">Looking for more?</h3>
        <p className="text-foreground/70 mb-4">
          Explore our other component groups for more UI elements.
        </p>
        <div className="flex gap-4">
          {groupData.relatedGroups.map((relatedGroup) => (
            <Button key={relatedGroup.href} asChild variant="outline">
              <Link href={relatedGroup.href}>{relatedGroup.name}</Link>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
