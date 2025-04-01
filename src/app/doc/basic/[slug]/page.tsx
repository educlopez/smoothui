import fs from "fs"
import path from "path"
import { promisify } from "util"
import React from "react"
import { Metadata } from "next"
import { notFound } from "next/navigation"

import { Breadcrumbs } from "@/app/doc/_components/breadcrumbs"
import { CodeBlock } from "@/app/doc/_components/codeBlock"
import { ComponentView } from "@/app/doc/_components/componentView"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/doc/_components/tabs"
import { basicComponents } from "@/app/doc/data/basicComponents"

import BadgeBeta from "../../_components/badgeBeta"
import { CodeBlockWrapper } from "../../_components/codeBlocKWarapper"
import { OpenInV0Button } from "../../_components/openInV0"

export async function generateStaticParams() {
  const component = basicComponents.map((component) => ({
    slug: component.slug,
  }))

  return component
}

export const dynamicParams = false

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>
}): Promise<Metadata | undefined> {
  const params = await props.params
  const component = basicComponents.find(
    (component) => component.slug === params.slug
  )

  if (!component) {
    return
  }

  const { componentTitle, slug } = component

  return {
    title: componentTitle,
    description: `Navigate to ${componentTitle} component, which will make your application smooth .`,
    openGraph: {
      title: `SmoothUI — ${componentTitle}`,
      description: `Navigate to ${componentTitle} component, which will make your application smooth`,
      type: "website",
      url: `https://smoothui.dev/doc/basic/${slug}`,
      images: [
        {
          width: 1920,
          height: 1080,
          url: `/api/og?title=${componentTitle}`,
          alt: "SmoothUI cover",
        },
      ],
    },
    twitter: {
      title: `SmootUI — ${componentTitle}`,
      description: `Navigate to ${componentTitle} component, which will make your application smooth.`,
      card: "summary_large_image",
      images: [
        {
          width: 1920,
          height: 1080,
          url: `/api/og?title=${componentTitle}`,
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
  const component = basicComponents.find(
    (component) => component.slug === params.slug
  )

  if (!component) {
    notFound()
  }

  const filePath = `./src/app/doc/_components/ui/${component.componentTitle.replace(/\s+/g, "")}.tsx`

  const code = await readFilePath(filePath)

  const cnPath = `./src/app/utils/cn.ts`
  const cnCode = await readFilePath(cnPath)

  const currentComponent = basicComponents.indexOf(component)
  const previousComponent = basicComponents[currentComponent - 1]
  const nextComponent = basicComponents[currentComponent + 1]

  return (
    <main className="my-2 xl:mb-24">
      <div className="space-y-10">
        <div className="space-y-4">
          <Breadcrumbs
            backLink="/doc"
            groupName="Components"
            currentPage={component.componentTitle}
          />
          <h1
            data-table-content="Introduction"
            data-level="1"
            className="text-light-950 dark:text-dark-950 text-3xl font-bold -tracking-wide"
          >
            {component.componentTitle}
          </h1>
          <p className="text-light-900 dark:text-dark-900 text-sm">
            {component.info}
          </p>
        </div>
        <div className="space-y-6">
          <ComponentView>
            <OpenInV0Button
              url={`https://smoothui.dev/r/${component.slug}.json`}
            />
            {component.componentUi &&
              React.createElement(component.componentUi)}
          </ComponentView>
          <h2 data-table-content="Code" data-level="2">
            Code
          </h2>
          {component.slug && (
            <>
              <h3
                data-table-content="shadcn"
                data-level="3"
                className="flex flex-row items-center gap-2"
              >
                Install with shadcn <BadgeBeta />
              </h3>
              <CodeBlock
                code={`npx shadcn@latest add "https://smoothui.dev/r/${component.slug}.json"`}
                fileName="Terminal"
                lang="shell"
              />
            </>
          )}
          <h3 data-table-content="Manual install" data-level="3">
            Manual install
          </h3>
          {component.download && (
            <Tabs defaultValue="npm">
              <TabsList>
                <TabsTrigger
                  value="npm"
                  className="data-[state=active]:border-none data-[state=active]:bg-pink-600/5 data-[state=active]:text-pink-700 data-[state=active]:shadow-none dark:data-[state=active]:bg-pink-600/10 dark:data-[state=active]:text-pink-400"
                >
                  npm
                </TabsTrigger>
                <TabsTrigger
                  value="pnpm"
                  className="data-[state=active]:border-none data-[state=active]:bg-pink-600/5 data-[state=active]:text-pink-700 data-[state=active]:shadow-none dark:data-[state=active]:bg-pink-600/10 dark:data-[state=active]:text-pink-400"
                >
                  pnpm
                </TabsTrigger>
                <TabsTrigger
                  value="yarn"
                  className="data-[state=active]:border-none data-[state=active]:bg-pink-600/5 data-[state=active]:text-pink-700 data-[state=active]:shadow-none dark:data-[state=active]:bg-pink-600/10 dark:data-[state=active]:text-pink-400"
                >
                  yarn
                </TabsTrigger>
                <TabsTrigger
                  value="bun"
                  className="data-[state=active]:border-none data-[state=active]:bg-pink-600/5 data-[state=active]:text-pink-700 data-[state=active]:shadow-none dark:data-[state=active]:bg-pink-600/10 dark:data-[state=active]:text-pink-400"
                >
                  bun
                </TabsTrigger>
              </TabsList>
              <TabsContent value="npm">
                <CodeBlock
                  code={component.download}
                  fileName="Terminal"
                  installCommand="npm install"
                  lang="shell"
                />
              </TabsContent>
              <TabsContent value="pnpm">
                <CodeBlock
                  code={component.download}
                  fileName="Terminal"
                  installCommand="pnpm install"
                  lang="shell"
                />
              </TabsContent>
              <TabsContent value="yarn">
                <CodeBlock
                  code={component.download}
                  fileName="Terminal"
                  installCommand="yarn add"
                  lang="shell"
                />
              </TabsContent>
              <TabsContent value="bun">
                <CodeBlock
                  code={component.download}
                  fileName="Terminal"
                  installCommand="bun add"
                  lang="shell"
                />
              </TabsContent>
            </Tabs>
          )}

          {component.cnFunction && (
            <CodeBlock code={cnCode} fileName="utils/cn.ts" lang="typescript" />
          )}
          {component.customCss && (
            <CodeBlock
              code={component.customCss}
              fileName="global.css"
              lang="css"
            />
          )}
          <CodeBlockWrapper
            expandButtonTitle="Expand"
            className="my-6 overflow-hidden rounded-md"
          >
            <CodeBlock
              code={code}
              fileName={`${component.componentTitle.replace(/\s+/g, "")}.tsx`}
            />
          </CodeBlockWrapper>
        </div>
      </div>
    </main>
  )
}
