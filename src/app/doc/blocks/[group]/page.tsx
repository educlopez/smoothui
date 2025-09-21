import React from "react"
import type { Metadata } from "next"

import { BodyText } from "@/components/doc/BodyText"
import { Breadcrumbs } from "@/components/doc/breadcrumbs"
import { CodeBlock } from "@/components/doc/codeBlock"
import PropsTable from "@/components/doc/PropsTable"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/doc/tabs"
import { Title } from "@/components/doc/Title"
import Divider from "@/components/landing/divider"
import { faqsBlocks } from "@/app/doc/data/block-faqs"
import { footerBlocks } from "@/app/doc/data/block-footer"
import { heroBlocks } from "@/app/doc/data/block-hero"
import { logoCloudBlocks } from "@/app/doc/data/block-logo-cloud"
import { pricingBlocks } from "@/app/doc/data/block-pricing"
import { statsBlocks } from "@/app/doc/data/block-stats"
import { teamBlocks } from "@/app/doc/data/block-team"
import { testimonialBlocks } from "@/app/doc/data/block-testimonials"
import type { BlocksProps } from "@/app/doc/data/typeBlock"
import { readComponentSource, readStyleSource } from "@/app/utils/readFile"

// Map group to data file
const groupDataMap: Record<string, BlocksProps[]> = {
  hero: heroBlocks,
  pricing: pricingBlocks,
  testimonial: testimonialBlocks,
  "logo-cloud": logoCloudBlocks,
  stats: statsBlocks,
  team: teamBlocks,
  footer: footerBlocks,
  faqs: faqsBlocks,
}

// Add group descriptions
const groupDescriptionMap: Record<string, string> = {
  hero: "A collection of animated hero sections for landing pages, featuring modern layouts and engaging effects.",
  pricing:
    "Beautiful, responsive pricing sections to showcase your product plans with style and clarity.",
  testimonial:
    "Stylish testimonial sections to highlight user feedback and build trust with your audience.",
  "logo-cloud":
    "Elegant logo cloud sections to showcase trusted partners, clients, and integrations with smooth animations.",
  stats:
    "Impressive statistics sections with animated counters, trend indicators, and engaging visual presentations.",
  team: "Professional team showcase sections with member profiles, social links, and interactive layouts.",
  footer:
    "Comprehensive footer sections with navigation, social links, newsletter signup, and company information.",
  faqs: "User-friendly FAQ sections with accordion layouts and organized question categories for better UX.",
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ group: string }>
}): Promise<Metadata> {
  const { group } = await params
  const groupDescription = groupDescriptionMap[group]
  const groupTitle =
    group.charAt(0).toUpperCase() + group.slice(1).replace(/-/g, " ")

  if (!groupDescription) {
    return {
      title: "Blocks Group Not Found",
    }
  }

  return {
    title: `${groupTitle} Blocks`,
    description: groupDescription,
    alternates: {
      canonical: `/doc/blocks/${group}`,
    },
    openGraph: {
      title: `${groupTitle} Blocks - SmoothUI`,
      description: groupDescription,
      type: "website",
      url: `/doc/blocks/${group}`,
      images: [
        {
          width: 1920,
          height: 1080,
          url: `/api/og?title=${encodeURIComponent(`${groupTitle} Blocks`)}&description=${encodeURIComponent(groupDescription)}`,
          alt: `SmoothUI ${groupTitle} Blocks showcase`,
        },
      ],
      siteName: "SmoothUI",
    },
    twitter: {
      title: `${groupTitle} Blocks - SmoothUI`,
      description: groupDescription,
      card: "summary_large_image",
      images: [
        {
          width: 1920,
          height: 1080,
          url: `/api/og?title=${encodeURIComponent(`${groupTitle} Blocks`)}&description=${encodeURIComponent(groupDescription)}`,
          alt: `SmoothUI ${groupTitle} Blocks showcase`,
        },
      ],
      site: "@educalvolpz",
      creator: "@educalvolpz",
    },
  }
}

export default async function BlocksGroupPage({
  params,
}: {
  params: Promise<{ group: string }>
}) {
  const { group } = await params
  const blocks = groupDataMap[group] || []

  // Load source code for each block if componentPath is present
  const blocksWithSource = await Promise.all(
    blocks.map(async (block: BlocksProps) => ({
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
    <div className="space-y-8">
      <div className="space-y-4">
        <Breadcrumbs groupName="Blocks" currentPage="Hero" />
        <div className="space-y-3.5">
          <Title level={1} tableContent="Introduction" className="capitalize">
            {group.replace(/-/g, " ")}
          </Title>
          <BodyText>{groupDescriptionMap[group] || ""}</BodyText>
        </div>
      </div>
      <Divider className="relative my-4" />
      {blocksWithSource.map(
        (
          block: BlocksProps & {
            source: string | null
            styleSource: string | null
          }
        ) => {
          // Generate slug from title (kebab-case)
          const slug = block.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "")
          return (
            <section key={slug}>
              <Title level={2}>{block.title}</Title>
              <BodyText className="mb-4">{block.description}</BodyText>
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
                      code={block.source || ""}
                      fileName={block.title + ".tsx"}
                      lang="tsx"
                    />
                  </div>
                </TabsContent>
                {block.styleSource && (
                  <TabsContent value="style" className="py-4">
                    <div className="relative">
                      <CodeBlock
                        code={block.styleSource || ""}
                        fileName={block.title + ".module.css"}
                        lang="css"
                      />
                    </div>
                  </TabsContent>
                )}
              </Tabs>
              {block.props && (
                <>
                  <Divider className="relative my-6" />
                  <Title level={3}>Props</Title>
                  <PropsTable props={block.props} />
                </>
              )}
            </section>
          )
        }
      )}
    </div>
  )
}
