"use client"

import Link from "next/link"
import { ArrowRight, Tag } from "lucide-react"

import { Button } from "@/components/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { ComponentsProps } from "@/app/doc/data/typeComponent"
import {
  findComponentsByTag,
  findRelatedComponents,
} from "@/app/utils/componentUtils"

import Divider from "../landing/divider"

interface RelatedComponentsProps {
  currentComponent: ComponentsProps
  group: string
}

export function RelatedComponents({
  currentComponent,
  group,
}: RelatedComponentsProps) {
  const relatedComponents = findRelatedComponents(currentComponent, 4)

  if (relatedComponents.length === 0) {
    return null
  }

  return (
    <div className="relative space-y-10">
      <div>
        <h2
          className="mb-4 text-xl font-semibold"
          data-table-content="Related Components"
          data-level="2"
        >
          Related Components
        </h2>
        <p className="text-foreground/70 mb-6 text-sm">
          Discover similar components that might be useful for your project.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {relatedComponents.map((component) => (
          <Card
            key={component.slug}
            className="group transition-shadow hover:shadow-md"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="group-hover:text-brand text-base transition-colors">
                    <Link
                      href={`/doc/${group}/${component.slug}`}
                      className="hover:underline"
                    >
                      {component.componentTitle}
                    </Link>
                  </CardTitle>
                  <CardDescription className="line-clamp-2 text-xs">
                    {component.info}
                  </CardDescription>
                </div>
                {component.isNew && (
                  <Badge variant="secondary" className="text-xs">
                    New
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {component.tags?.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {component.tags && component.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{component.tags.length - 3}
                    </Badge>
                  )}
                </div>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <Link href={`/doc/${group}/${component.slug}`}>
                    View
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Divider className="relative" />
      {/* Tag-based suggestions */}
      {currentComponent.tags && currentComponent.tags.length > 0 && (
        <>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-medium">
            <Tag className="h-4 w-4" />
            Explore by Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {currentComponent.tags.slice(0, 5).map((tag) => {
              const tagComponents = findComponentsByTag(tag)
              return (
                <Button
                  key={tag}
                  asChild
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  <Link href={`/doc/tags/${tag.toLowerCase()}`}>
                    {tag} ({tagComponents.length})
                  </Link>
                </Button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
