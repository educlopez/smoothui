import fs from "fs"
import path from "path"
import { promisify } from "util"
import React from "react"
import { Metadata } from "next"
import { notFound } from "next/navigation"

import BadgeBeta from "@/components/doc/badgeBeta"
import { Breadcrumbs } from "@/components/doc/breadcrumbs"
import { CodeBlock } from "@/components/doc/codeBlock"
import { CodeBlockWrapper } from "@/components/doc/codeBlocKWarapper"
import ComponentPager from "@/components/doc/ComponentPager"
import { ComponentView } from "@/components/doc/componentView"
import { OpenInV0Button } from "@/components/doc/openInV0"
import PropsTable from "@/components/doc/PropsTable"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/doc/tabs"
import Divider from "@/components/landing/divider"
import { Separator } from "@/components/ui/separator"
import { basicComponents } from "@/app/doc/data/basicComponents"
import { components } from "@/app/doc/data/components"
import { textComponents } from "@/app/doc/data/textComponentes"
import { ComponentsProps } from "@/app/doc/data/typeComponent"

const groupDataMap: Record<string, ComponentsProps[]> = {
  components,
  basic: basicComponents,
  text: textComponents,
}

export async function generateStaticParams() {
  const params = []
  for (const [group, data] of Object.entries(groupDataMap)) {
    for (const component of data) {
      params.push({ group, slug: component.slug })
    }
  }
  return params
}

export const dynamicParams = false

export async function generateMetadata({
  params,
}: {
  params: Promise<{ group: string; slug: string }>
}): Promise<Metadata | undefined> {
  const { group, slug } = await params
  const data = groupDataMap[group]
  if (!data) return
  const component = data.find(
    (component: ComponentsProps) => component.slug === slug
  )
  if (!component) return
  const { componentTitle } = component
  return {
    title: `${componentTitle} - React Component`,
    description: `Learn how to use the ${componentTitle} component from SmoothUI. Customizable, responsive, and animated with TailwindCSS and Framer Motion.`,
    alternates: {
      canonical: `/doc/${group}/${slug}`,
    },
    openGraph: {
      title: `${componentTitle} - React Component | SmoothUI`,
      description: `Explore the ${componentTitle} component. Built for React with TailwindCSS and Framer Motion to enhance modern UIs.`,
      type: "article",
      url: `/doc/${group}/${slug}`,
      images: [
        {
          width: 1920,
          height: 1080,
          url: `/api/og?title=${encodeURIComponent(componentTitle)}`,
          alt: `${componentTitle} component preview`,
        },
      ],
      siteName: "SmoothUI",
    },
    twitter: {
      title: `${componentTitle} - React Component | SmoothUI`,
      description: `Discover how to use ${componentTitle} from SmoothUI - beautifully animated with TailwindCSS & Framer Motion.`,
      card: "summary_large_image",
      images: [
        {
          width: 1920,
          height: 1080,
          url: `/api/og?title=${encodeURIComponent(componentTitle)}`,
          alt: `${componentTitle} component preview`,
        },
      ],
      site: "@educalvolpz",
      creator: "@educalvolpz",
    },
  }
}

async function readFilePath(filePath: string) {
  const readFile = promisify(fs.readFile)
  const fileContent = await readFile(path.join(process.cwd(), filePath), "utf8")
  return fileContent
}

export default async function ComponentPage({
  params,
}: {
  params: Promise<{ group: string; slug: string }>
}) {
  const { group, slug } = await params
  const data = groupDataMap[group]
  if (!data) notFound()
  const component = data.find(
    (component: ComponentsProps) => component.slug === slug
  )
  if (!component) notFound()

  const filePath = `./src/components/smoothui/ui/${component.componentTitle.replace(/\s+/g, "")}.tsx`
  const code = await readFilePath(filePath)
  const cnPath = `./src/components/smoothui/utils/cn.ts`
  const cnCode = await readFilePath(cnPath)

  const currentComponent = data.indexOf(component)
  const previousComponent = data[currentComponent - 1]
  const nextComponent = data[currentComponent + 1]

  // Try to read the demo file for the usage example
  const demoFilePath = path.join(
    process.cwd(),
    "src/components/smoothui/examples",
    `${component.componentTitle.replace(/\s/g, "")}Demo.tsx`
  )
  let usageExample = ""
  try {
    usageExample = fs.readFileSync(demoFilePath, "utf8")
  } catch (e) {
    usageExample = `import { ${component.componentTitle.replace(/\s/g, "")} } from "your-library"

<${component.componentTitle.replace(/\s/g, "")}
  // your props here
/>`
  }

  return (
    <section className="my-2 xl:mb-24">
      <div className="space-y-10">
        <div className="space-y-4">
          <Breadcrumbs
            backLink="/doc"
            groupName={group.charAt(0).toUpperCase() + group.slice(1)}
            currentPage={component.componentTitle}
          />
          <h1
            data-table-content="Introduction"
            data-level="1"
            className="text-foreground text-3xl font-bold -tracking-wide"
          >
            {component.componentTitle}
          </h1>
          <p className="text-primary-foreground text-sm">{component.info}</p>
        </div>
        <div className="relative space-y-6">
          <ComponentView hasRefreshDemo={component.hasRefreshDemo !== false}>
            <OpenInV0Button
              url={`https://smoothui.dev/r/${component.slug}-demo.json`}
            />
            {component.componentUi &&
              React.createElement(component.componentUi)}
          </ComponentView>
          <h2
            className="text-xl font-semibold"
            data-table-content="Code"
            data-level="2"
          >
            Code
          </h2>
          {component.slug && (
            <Tabs defaultValue="cli" className="mb-6">
              <TabsList className="text-primary-foreground bg-primary mb-2 border">
                <TabsTrigger
                  value="cli"
                  className="data-[state=active]:bg-brand-secondary data-[state=active]:shadow-custom-brand data-[state=active]:border-none data-[state=active]:text-white"
                >
                  CLI
                </TabsTrigger>
                <TabsTrigger
                  value="manual"
                  className="data-[state=active]:bg-brand-secondary data-[state=active]:shadow-custom-brand data-[state=active]:border-none data-[state=active]:text-white"
                >
                  Manual
                </TabsTrigger>
              </TabsList>
              <TabsContent value="cli">
                {(() => {
                  const steps = []
                  // Step 1: Install with shadcn
                  steps.push(
                    <div className="relative" key="cli-step-1">
                      <div className="bg-primary absolute flex h-9 w-9 items-center justify-center rounded-full border select-none">
                        <span className="text-foreground font-semibold">1</span>
                      </div>
                      <div className="ml-[1.1rem] border-l">
                        <div className="space-y-4 pt-1 pb-10 pl-8">
                          <p className="font-medium">
                            Install with shadcn <BadgeBeta />
                          </p>

                          <CodeBlock
                            code={`npx shadcn@latest add \"https://smoothui.dev/r/${component.slug}.json\"`}
                            fileName="Terminal"
                            lang="shell"
                          />
                          <p className="font-medium">Or install the demo</p>
                          <CodeBlock
                            code={`npx shadcn@latest add \"https://smoothui.dev/r/${component.slug}-demo.json\"`}
                            fileName="Terminal"
                            lang="shell"
                          />
                        </div>
                      </div>
                    </div>
                  )
                  // Step 2: Add the CSS (if present)
                  if (component.customCss) {
                    steps.push(
                      <div className="relative" key="cli-step-2">
                        <div className="bg-primary absolute flex h-9 w-9 items-center justify-center rounded-full border select-none">
                          <span className="text-foreground font-semibold">
                            2
                          </span>
                        </div>
                        <div className="ml-[1.1rem] border-l">
                          <div className="space-y-4 pt-1 pb-10 pl-8">
                            <p className="font-medium">Add the CSS</p>
                            <CodeBlockWrapper
                              expandButtonTitle="Expand"
                              className="my-6 overflow-hidden rounded-md"
                            >
                              <CodeBlock
                                code={component.customCss}
                                fileName="global.css"
                                lang="css"
                              />
                            </CodeBlockWrapper>
                          </div>
                        </div>
                      </div>
                    )
                  }
                  // Remove border from last step
                  if (steps.length > 0) {
                    const last = steps.length - 1
                    steps[last] = React.cloneElement(
                      steps[last],
                      {},
                      steps[last].props.children[0],
                      <div className="ml-[1.1rem]">
                        {steps[last].props.children[1].props.children}
                      </div>
                    )
                  }
                  return <div className="mb-4 space-y-0">{steps}</div>
                })()}
              </TabsContent>
              <TabsContent value="manual">
                {(() => {
                  const steps = []
                  let stepNum = 1
                  // Step 1: Install the packages
                  steps.push(
                    <div className="relative" key="manual-step-1">
                      <div className="bg-primary absolute flex h-9 w-9 items-center justify-center rounded-full border select-none">
                        <span className="text-foreground font-semibold">
                          {stepNum}
                        </span>
                      </div>
                      <div className="ml-[1.1rem] border-l">
                        <div className="space-y-4 pt-1 pb-10 pl-8">
                          <p className="font-medium">Install the packages</p>

                          {component.download && (
                            <Tabs defaultValue="npm" className="mt-2">
                              <TabsList className="text-primary-foreground bg-primary border">
                                <TabsTrigger
                                  value="npm"
                                  className="data-[state=active]:bg-brand-secondary data-[state=active]:shadow-custom-brand data-[state=active]:border-none data-[state=active]:text-white"
                                >
                                  npm
                                </TabsTrigger>
                                <TabsTrigger
                                  value="pnpm"
                                  className="data-[state=active]:bg-brand-secondary data-[state=active]:shadow-custom-brand data-[state=active]:border-none data-[state=active]:text-white"
                                >
                                  pnpm
                                </TabsTrigger>
                                <TabsTrigger
                                  value="yarn"
                                  className="data-[state=active]:bg-brand-secondary data-[state=active]:shadow-custom-brand data-[state=active]:border-none data-[state=active]:text-white"
                                >
                                  yarn
                                </TabsTrigger>
                                <TabsTrigger
                                  value="bun"
                                  className="data-[state=active]:bg-brand-secondary data-[state=active]:shadow-custom-brand data-[state=active]:border-none data-[state=active]:text-white"
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
                        </div>
                      </div>
                    </div>
                  )
                  stepNum++
                  // Step 2: Component code
                  steps.push(
                    <div className="relative" key="manual-step-2">
                      <div className="bg-primary absolute flex h-9 w-9 items-center justify-center rounded-full border select-none">
                        <span className="text-foreground font-semibold">
                          {stepNum}
                        </span>
                      </div>
                      <div className="ml-[1.1rem] border-l">
                        <div className="space-y-4 pt-1 pb-10 pl-8">
                          <p className="font-medium">
                            Copy and paste the following code into your project
                          </p>

                          <CodeBlockWrapper
                            expandButtonTitle="Expand"
                            className="overflow-hidden rounded-md"
                          >
                            <CodeBlock
                              code={code}
                              fileName={`${component.componentTitle.replace(/\s+/g, "")}.tsx`}
                            />
                          </CodeBlockWrapper>
                        </div>
                      </div>
                    </div>
                  )
                  stepNum++
                  // Step 3: utils/cn.ts (if present)
                  if (component.cnFunction) {
                    steps.push(
                      <div className="relative" key="manual-step-3">
                        <div className="bg-primary absolute flex h-9 w-9 items-center justify-center rounded-full border select-none">
                          <span className="text-foreground font-semibold">
                            {stepNum}
                          </span>
                        </div>
                        <div className="ml-[1.1rem] border-l">
                          <div className="space-y-4 pt-1 pb-10 pl-8">
                            <p className="font-medium">
                              Create a file with the path{" "}
                              <code>utils/cn.ts</code>
                            </p>

                            <CodeBlock
                              code={cnCode}
                              fileName="utils/cn.ts"
                              lang="typescript"
                            />
                          </div>
                        </div>
                      </div>
                    )
                    stepNum++
                  }
                  // Step: CSS block (if present)
                  if (component.customCss) {
                    steps.push(
                      <div className="relative" key="manual-step-css">
                        <div className="bg-primary absolute flex h-9 w-9 items-center justify-center rounded-full border select-none">
                          <span className="text-foreground font-semibold">
                            {stepNum}
                          </span>
                        </div>
                        <div className="ml-[1.1rem] border-l">
                          <div className="space-y-4 pt-1 pb-10 pl-8">
                            <p className="font-medium">Add the CSS</p>
                            <CodeBlockWrapper
                              expandButtonTitle="Expand"
                              className="my-6 overflow-hidden rounded-md"
                            >
                              <CodeBlock
                                code={component.customCss}
                                fileName="global.css"
                                lang="css"
                              />
                            </CodeBlockWrapper>
                          </div>
                        </div>
                      </div>
                    )
                  }
                  // Remove border from last step
                  if (steps.length > 0) {
                    const last = steps.length - 1
                    steps[last] = React.cloneElement(
                      steps[last],
                      {},
                      steps[last].props.children[0],
                      <div className="ml-[1.1rem]">
                        {steps[last].props.children[1].props.children}
                      </div>
                    )
                  }
                  return <div className="mb-4 space-y-0">{steps}</div>
                })()}
              </TabsContent>
            </Tabs>
          )}
          {/* Divider for separation */}
          <Divider className="relative" />
          <h2
            className="text-xl font-semibold"
            data-table-content="How to use"
            data-level="2"
          >
            How to use
          </h2>
          <CodeBlockWrapper
            expandButtonTitle="Expand"
            className="my-6 overflow-hidden rounded-md"
          >
            <CodeBlock code={usageExample} fileName="Demo.tsx" lang="tsx" />
          </CodeBlockWrapper>
        </div>
        {component.props && (
          <>
            <Divider className="relative" />
            <h2
              className="mb-8 text-xl font-semibold"
              data-table-content="Props"
              data-level="2"
            >
              Props
            </h2>
            <PropsTable props={component.props} />
          </>
        )}
      </div>
      {/* Pager navigation at the bottom */}
      <ComponentPager
        group={group}
        slug={slug}
        components={data
          .filter(({ slug }) => typeof slug === "string")
          .map(({ slug, componentTitle, info }) => ({
            slug: slug as string,
            componentTitle,
            info,
          }))}
      />
    </section>
  )
}
