import React from "react"

import { CodeBlock } from "@/components/doc/codeBlock"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/doc/tabs"
import Divider from "@/components/landing/divider"
import { heroBlocks } from "@/app/doc/data/block-hero"
import { pricingBlocks } from "@/app/doc/data/block-pricing"
import { testimonialBlocks } from "@/app/doc/data/block-testimonials"
import { BlocksProps } from "@/app/doc/data/typeBlock"
import { readComponentSource, readStyleSource } from "@/app/utils/readFile"

// Map group to data file
const groupDataMap: Record<string, BlocksProps[]> = {
  hero: heroBlocks,
  pricing: pricingBlocks,
  testimonial: testimonialBlocks,
  // Add more groups here as needed
}

// Add group descriptions
const groupDescriptionMap: Record<string, string> = {
  hero: "A collection of animated hero sections for landing pages, featuring modern layouts and engaging effects.",
  pricing:
    "Beautiful, responsive pricing sections to showcase your product plans with style and clarity.",
  testimonial:
    "Stylish testimonial sections to highlight user feedback and build trust with your audience.",
  // Add more group descriptions as needed
}

export async function generateStaticParams() {
  const params = []
  for (const [group, data] of Object.entries(groupDataMap)) {
    for (const component of data) {
      // Generate slug from title (kebab-case)
      const slug = component.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
      params.push({ group, slug })
    }
  }
  return params
}

export const dynamicParams = false

export default async function BlocksGroupPage({
  params,
}: {
  params: Promise<{ group: string }>
}) {
  const { group } = await params
  const blocks = groupDataMap[group] || []

  // Load source code for each block if componentPath is present
  const blocksWithSource = await Promise.all(
    blocks.map(async (block: any) => ({
      ...block,
      source: block.componentPath
        ? await readComponentSource(block.componentPath)
        : null,
      styleSource: block.stylePath
        ? await readStyleSource(block.stylePath)
        : null,
    }))
  )

  if (!blocks || blocks.length === 0) {
    return (
      <div className="p-8 text-center text-lg">
        No blocks found for this group.
      </div>
    )
  }

  return (
    <section className="my-2 xl:mb-24">
      <div className="space-y-10">
        <div className="space-y-4">
          <h1
            data-table-content="Introduction"
            data-level="1"
            className="text-foreground text-3xl font-bold -tracking-wide capitalize"
          >
            {group.replace(/-/g, " ")}
          </h1>
          <p className="text-primary-foreground text-sm">
            {groupDescriptionMap[group] || ""}
          </p>
        </div>
        <Divider className="relative my-4" />
        {blocksWithSource.map((block: any, idx: number) => {
          // Generate slug from title (kebab-case)
          const slug = block.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "")
          return (
            <section key={slug + idx}>
              <h2 className="mb-2 text-xl font-semibold">{block.title}</h2>
              <p className="text-muted-foreground mb-4">{block.description}</p>
              <Tabs defaultValue="preview" className="mb-2">
                <TabsList>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                  <TabsTrigger value="code">Code</TabsTrigger>
                  {block.styleSource && (
                    <TabsTrigger value="style">Style</TabsTrigger>
                  )}
                </TabsList>
                <TabsContent value="preview" className="py-4">
                  <div className="overflow-hidden rounded-md border">
                    {block.componentUi &&
                      React.createElement(block.componentUi)}
                  </div>
                </TabsContent>
                <TabsContent value="code" className="py-4">
                  <div className="relative">
                    <CodeBlock
                      code={block.source}
                      fileName={block.title + ".tsx"}
                      lang="tsx"
                    />
                  </div>
                </TabsContent>
                {block.styleSource && (
                  <TabsContent value="style" className="py-4">
                    <div className="relative">
                      <CodeBlock
                        code={block.styleSource}
                        fileName={block.title + ".module.css"}
                        lang="css"
                      />
                    </div>
                  </TabsContent>
                )}
              </Tabs>
            </section>
          )
        })}
      </div>
    </section>
  )
}
