import * as React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"

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
import { basicComponents } from "@/app/doc/data/basicComponents"

export const metadata: Metadata = {
  title: "Basic Components",
  description:
    "Essential UI components with smooth animations built with TailwindCSS and Framer Motion.",
  alternates: {
    canonical: "/doc/basic",
  },
  openGraph: {
    title: "Basic Components - SmoothUI",
    description:
      "Essential UI components with smooth animations built with TailwindCSS and Framer Motion.",
    type: "website",
    url: "/doc/basic",
    images: [
      {
        width: 1920,
        height: 1080,
        url: "/api/og?title=Basic%20Components&description=Essential UI components with smooth animations built with TailwindCSS and Framer Motion",
        alt: "SmoothUI Basic Components showcase",
      },
    ],
    siteName: "SmoothUI",
  },
  twitter: {
    title: "Basic Components - SmoothUI",
    description:
      "Essential UI components with smooth animations built with TailwindCSS and Framer Motion.",
    card: "summary_large_image",
    images: [
      {
        width: 1920,
        height: 1080,
        url: "/api/og?title=Basic%20Components&description=Essential UI components with smooth animations built with TailwindCSS and Framer Motion",
        alt: "SmoothUI Basic Components showcase",
      },
    ],
    site: "@educalvolpz",
    creator: "@educalvolpz",
  },
}

export default function BasicComponentsPage() {
  // Show only 6 specific components - you can customize this list
  const featuredComponents = basicComponents.slice(0, 6)

  return (
    <div className="container mx-auto max-w-4xl space-y-4 px-4 py-8">
      <Breadcrumbs
        category="Documentation"
        groupName="Basic Components"
        backLink="/doc"
        currentPage="Overview"
      />

      <div className="mb-8">
        <h1
          className="text-4xl font-bold tracking-tight"
          data-table-content="Components"
          data-level="1"
        >
          Basic Components
        </h1>
        <p className="text-foreground/70 mt-4 text-lg">
          Essential UI components with smooth animations built with TailwindCSS
          and Framer Motion. These components provide the foundation for
          building beautiful, interactive user interfaces.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {featuredComponents.map((component) => (
          <Card
            key={component.id}
            className="group !shadow-none transition-all duration-200"
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
                  <div className="mt-2 flex items-center gap-2">
                    {component.isNew && (
                      <Badge
                        variant="secondary"
                        className="bg-amber-50 text-xs text-amber-600 dark:bg-amber-950"
                      >
                        <Sparkles className="mr-1 h-3 w-3" />
                        New
                      </Badge>
                    )}
                    {component.isUpdated && (
                      <Badge variant="outline" className="text-xs">
                        Updated
                      </Badge>
                    )}
                    {component.tags?.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="text-foreground/70 mb-4 line-clamp-2 text-sm">
                {component.info}
              </CardDescription>

              {/* Component Demo */}
              <div className="bg-primary mb-4 rounded-lg border p-4">
                <div className="flex items-center justify-center">
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
                  <Link href={`/doc/basic/${component.slug}`}>
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
          Explore our advanced components and text components for more UI
          elements.
        </p>
        <div className="flex gap-4">
          <Button asChild variant="outline">
            <Link href="/doc/components">Advanced Components</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/doc/text">Text Components</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
