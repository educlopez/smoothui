import type { Metadata } from "next"
import Link from "next/link"
import { Tag } from "lucide-react"

import { Breadcrumbs } from "@/components/doc/breadcrumbs"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  findComponentsByTag,
  getAllTags,
  getPopularTags,
} from "@/app/utils/componentUtils"

export const metadata: Metadata = {
  title: "Component Tags | SmoothUI",
  description:
    "Browse SmoothUI components by tags. Discover components organized by technology, functionality, and use cases.",
  openGraph: {
    title: "Component Tags | SmoothUI",
    description:
      "Browse SmoothUI components by tags. Discover components organized by technology, functionality, and use cases.",
  },
}

export default function TagsPage() {
  const popularTags = getPopularTags(20)
  const allTags = getAllTags()

  return (
    <section className="my-2 xl:mb-24">
      <div className="space-y-8">
        <div className="space-y-4">
          <Breadcrumbs
            backLink="/doc"
            groupName="Documentation"
            currentPage="Tags"
          />

          <div className="flex items-center gap-3">
            <div className="bg-primary flex h-12 w-12 items-center justify-center rounded-lg border">
              <Tag className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold -tracking-wide">
                Component Tags
              </h1>
              <p className="text-foreground/70">
                Discover components organized by technology, functionality, and
                use cases
              </p>
            </div>
          </div>
        </div>

        {/* Popular Tags */}
        <div>
          <h2
            className="mb-4 text-xl font-semibold"
            data-table-content="Popular Tags"
            data-level="2"
          >
            Popular Tags
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {popularTags.map(({ tag, count }) => (
              <Card
                key={tag}
                className="group cursor-pointer border shadow-none"
              >
                <CardHeader className="pb-3">
                  <CardTitle className="group-hover:text-brand text-base transition-colors">
                    <Link
                      href={`/doc/tags/${tag.toLowerCase()}`}
                      className="flex items-center gap-2 hover:underline"
                    >
                      <Tag className="h-4 w-4" />
                      {tag}
                    </Link>
                  </CardTitle>
                  <CardDescription>
                    {count} component{count !== 1 ? "s" : ""}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-1">
                    {findComponentsByTag(tag)
                      .slice(0, 3)
                      .map((component) => (
                        <Badge
                          key={component.slug}
                          variant="outline"
                          className="text-xs"
                        >
                          <Link href={`/doc/components/${component.slug}`}>
                            {component.componentTitle}
                          </Link>
                        </Badge>
                      ))}
                    {findComponentsByTag(tag).length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{findComponentsByTag(tag).length - 3} more
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* All Tags */}
        <div>
          <h2
            className="mb-4 text-xl font-semibold"
            data-table-content="All Tags"
            data-level="2"
          >
            All Tags
          </h2>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => {
              const count = findComponentsByTag(tag).length
              return (
                <Link key={tag} href={`/doc/tags/${tag.toLowerCase()}`}>
                  <Badge
                    variant="outline"
                    className="hover:bg-primary hover:text-primary-foreground cursor-pointer transition-colors"
                  >
                    {tag} ({count})
                  </Badge>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
