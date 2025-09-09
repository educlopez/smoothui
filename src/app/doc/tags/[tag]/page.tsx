import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Tag } from "lucide-react"

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
import { findComponentsByTag, getAllTags } from "@/app/utils/componentUtils"
import { getCategoryForTag } from "@/app/utils/tagCategories"

interface TagPageProps {
  params: Promise<{ tag: string }>
}

export async function generateStaticParams() {
  const tags = getAllTags()
  return tags.map((tag) => ({
    tag: tag.toLowerCase(),
  }))
}

export async function generateMetadata({
  params,
}: TagPageProps): Promise<Metadata> {
  const { tag } = await params
  const capitalizedTag = tag.charAt(0).toUpperCase() + tag.slice(1)
  const components = findComponentsByTag(tag)

  return {
    title: `${capitalizedTag} Components | SmoothUI`,
    description: `Discover ${components.length} ${capitalizedTag.toLowerCase()} components with smooth animations and modern design.`,
    openGraph: {
      title: `${capitalizedTag} Components | SmoothUI`,
      description: `Discover ${components.length} ${capitalizedTag.toLowerCase()} components with smooth animations and modern design.`,
    },
  }
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params
  const components = findComponentsByTag(tag)

  if (components.length === 0) {
    notFound()
  }

  const capitalizedTag = tag.charAt(0).toUpperCase() + tag.slice(1)
  const category = getCategoryForTag(tag)
  const allTags = getAllTags()

  // Get related tags from the same category
  const relatedTags = category
    ? allTags
        .filter(
          (t) =>
            t.toLowerCase() !== tag.toLowerCase() &&
            category.tags.some(
              (categoryTag) => categoryTag.toLowerCase() === t.toLowerCase()
            )
        )
        .slice(0, 6)
    : []

  return (
    <section className="my-2 xl:mb-24">
      <div className="space-y-8">
        <div className="space-y-4">
          <Breadcrumbs
            backLink="/doc/tags"
            groupName="Tags"
            currentPage={capitalizedTag}
          />

          <div className="flex items-center gap-3">
            <div className="bg-primary flex h-12 w-12 items-center justify-center rounded-lg border">
              <Tag className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <div className="mb-1 flex items-center gap-2">
                <h1 className="text-3xl font-bold -tracking-wide">
                  {capitalizedTag} Components
                </h1>
                {category && (
                  <Badge variant="outline" className="text-xs">
                    {category.name}
                  </Badge>
                )}
              </div>
              <p className="text-foreground/70">
                {components.length} component
                {components.length !== 1 ? "s" : ""} found
                {category && ` in ${category.name.toLowerCase()}`}
              </p>
            </div>
          </div>

          {/* Category Description */}
          {category && (
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-foreground/80 text-sm">
                <strong>{category.name}:</strong> {category.description}
              </p>
            </div>
          )}
        </div>

        {/* Related Tags */}
        {relatedTags.length > 0 && (
          <div>
            <h2 className="mb-4 text-lg font-semibold">Related Tags</h2>
            <div className="flex flex-wrap gap-2">
              {relatedTags.map((relatedTag) => (
                <Link
                  key={relatedTag}
                  href={`/doc/tags/${relatedTag.toLowerCase()}`}
                >
                  <Badge
                    variant="outline"
                    className="hover:bg-primary hover:text-primary-foreground cursor-pointer transition-colors"
                  >
                    {relatedTag} ({findComponentsByTag(relatedTag).length})
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {components.map((component) => (
            <Card
              key={component.slug}
              className="group cursor-pointer transition-shadow hover:shadow-md"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="group-hover:text-brand text-base transition-colors">
                      <Link
                        href={`/doc/components/${component.slug}`}
                        className="hover:underline"
                      >
                        {component.componentTitle}
                      </Link>
                    </CardTitle>
                    <CardDescription className="line-clamp-2 text-xs">
                      {component.info}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col gap-1">
                    {component.isNew && (
                      <Badge variant="secondary" className="text-xs">
                        New
                      </Badge>
                    )}
                    {component.isUpdated && (
                      <Badge variant="outline" className="text-xs">
                        Updated
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-1">
                    {component.tags?.slice(0, 3).map((componentTag) => (
                      <Badge
                        key={componentTag}
                        variant={
                          componentTag.toLowerCase() === tag.toLowerCase()
                            ? "default"
                            : "outline"
                        }
                        className="text-xs"
                      >
                        {componentTag}
                      </Badge>
                    ))}
                    {component.tags && component.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{component.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-primary rounded-lg border p-6">
          <h3 className="mb-2 text-lg font-semibold">Explore More</h3>
          <p className="text-foreground/70 mb-4">
            Discover components by other tags and categories.
          </p>
          <div className="flex gap-3">
            <Button asChild variant="outline">
              <Link href="/doc/tags">
                <Tag className="mr-2 h-4 w-4" />
                Browse All Tags
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/doc">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Browse All Components
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
