import fs from "fs"
import path from "path"
import { promisify } from "util"
import React from "react"
import { Metadata } from "next"
import { notFound } from "next/navigation"

import { components } from "@/app/data"
import { Breadcrumbs } from "@/app/doc/_components/breadcrumbs"
import { CodeBlock } from "@/app/doc/_components/codeBlock"
import { ComponentView } from "@/app/doc/_components/componentView"
import { cn } from "@/app/utils/cn"

// import { Pagination } from "../_components/Pagination"

export async function generateStaticParams() {
  const component = components.map((component) => ({
    slug: component.slug,
  }))

  return component
}

export const dynamicParams = false

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>
}): Promise<Metadata | undefined> {
  const params = await props.params
  const component = components.find(
    (component) => component.slug === params.slug
  )

  if (!component) {
    return
  }

  const { componentTitle, slug } = component

  return {
    title: componentTitle,
    description: `Navigate to ${componentTitle} component, which will make your application sophisticated and luxurious.`,
    openGraph: {
      title: `SmoothUI — ${componentTitle}`,
      description: `Navigate to ${componentTitle} component, which will make your application sophisticated and luxurious.`,
      type: "website",
      url: `https://smoothui.dev/doc/${slug}`,
      images: [
        {
          width: 1920,
          height: 1080,
          url: "https://smoothui.dev/og.jpg",
          alt: "SmoothUI cover",
        },
      ],
    },
    twitter: {
      title: `SmootUI — ${componentTitle}`,
      description: `Navigate to ${componentTitle} component, which will make your application sophisticated and luxurious.`,
      card: "summary_large_image",
      images: [
        {
          width: 1920,
          height: 1080,
          url: "https://smoothui.dev/og.jpg",
          alt: "SmoothUI cover",
        },
      ],
    },
  }
}

async function readFilePath(filePath: string) {
  const readFile = promisify(fs.readFile)

  const fileContent = await readFile(path.join(process.cwd(), filePath), "utf8")

  return fileContent
}

export default async function ComponentPage(props: {
  params: Promise<{ slug: string }>
}) {
  const params = await props.params
  const component = components.find(
    (component) => component.slug === params.slug
  )

  if (!component) {
    notFound()
  }

  //   const filePath = `./src/app/_components/doc/${
  //     component.type
  //   }/${component.componentTitle.replace(/\s+/g, "")}.tsx`

  const filePath = `./src/app/components/ui/${component.componentTitle.replace(/\s+/g, "")}.tsx`

  const code = await readFilePath(filePath)

  const cnPath = `./src/app/utils/cn.ts`
  const cnCode = await readFilePath(cnPath)

  const currentComponent = components.indexOf(component)
  const previousComponent = components[currentComponent - 1]
  const nextComponent = components[currentComponent + 1]

  return (
    <main className="my-2 xl:mb-24">
      <div className="space-y-10">
        <div className="space-y-4">
          <Breadcrumbs
            backLink="/ui"
            groupName="Components"
            currentPage={component.componentTitle}
          />
          <h1 className="text-3xl font-bold -tracking-wide text-light12 dark:text-dark12">
            {component.componentTitle}
          </h1>
          <p className="text-sm text-light11 dark:text-dark11">
            {component.info}
          </p>
        </div>
        <div className="space-y-6">
          <ComponentView>
            {component.componentUi &&
              React.createElement(component.componentUi)}
          </ComponentView>

          {component.download && (
            <CodeBlock
              code={component.download}
              fileName="Terminal"
              lang="shellscript"
            />
          )}

          {component.cnFunction && (
            <CodeBlock code={cnCode} fileName="utils/cn.ts" />
          )}

          <CodeBlock
            code={code}
            fileName={`${component.componentTitle.replace(/\s+/g, "")}.tsx`}
          />
        </div>

        {/* <Pagination
          back={{
            href: previousComponent ? `/ui/${previousComponent.slug}` : "",
            name: previousComponent ? previousComponent.componentTitle : "",
          }}
          next={{
            href: nextComponent ? `/ui/${nextComponent.slug}` : "",
            name: nextComponent ? nextComponent.componentTitle : "",
          }}
        /> */}
      </div>
    </main>
  )
}
