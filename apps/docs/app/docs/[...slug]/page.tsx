import { BodyText } from "@docs/components/body-text";
import { ChangelogEntry } from "@docs/components/changelog-entry";
import { FeatureCard } from "@docs/components/feature-card";
import { FeatureCardHover } from "@docs/components/feature-card-hover";
import { Installer } from "@docs/components/installer";
import Divider from "@docs/components/landing/divider";
import { LastModified } from "@docs/components/last-modified";
import { OpenInV0Button } from "@docs/components/open-in-v0-button";
import { LLMCopyButton, ViewOptions } from "@docs/components/page-actions";
import { PoweredBy } from "@docs/components/powered-by";
import { Preview } from "@docs/components/preview";
import { SponsorsPageContent } from "@docs/components/sponsors-page-content";
import { domain } from "@docs/lib/domain";
import { createMetadata } from "@docs/lib/metadata";
import { getPageImage, source } from "@docs/lib/source";
import { typeGenerator } from "@docs/mdx-components";
import type { TableOfContents } from "fumadocs-core/toc";
import { AutoTypeTable } from "fumadocs-typescript/ui";
import { CodeBlock, Pre } from "fumadocs-ui/components/codeblock";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import defaultMdxComponents from "fumadocs-ui/mdx";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "fumadocs-ui/page";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const revalidate = false;

// Wrapper component for AutoTypeTable with typeGenerator
const AutoTypeTableWithGenerator = (
  props: React.ComponentProps<typeof AutoTypeTable>
) => <AutoTypeTable {...props} generator={typeGenerator} />;

export default async function Page(props: PageProps<"/docs/[...slug]">) {
  const params = await props.params;
  const page = source.getPage(params.slug);

  if (!page) {
    notFound();
  }

  const MDX = page.data.body;

  // Access lastModified from page data (available when lastModifiedTime: 'git' is enabled)
  const lastModified = (page.data as { lastModified?: number }).lastModified;

  const updatedToc: TableOfContents = [
    {
      title: "Installation",
      url: "#installation",
      depth: 2,
    },
    ...page.data.toc,
  ];

  const type = page.data.info.path.startsWith("blocks") ? "block" : "component";
  const isComponentOrBlock =
    page.data.info.path.startsWith("components") ||
    page.data.info.path.startsWith("blocks");

  // Get the component/block name from the last slug (skip index pages)
  const componentName =
    isComponentOrBlock && page.slugs.length > 1
      ? (page.slugs.at(-1) ?? null)
      : null;
  const registryUrl = componentName
    ? `${domain}/r/${componentName}.json`
    : null;

  return (
    <DocsPage
      container={{
        className: "max-w-[75rem]",
      }}
      full={page.data.full ?? page.slugs.includes("blocks")}
      tableOfContent={{
        style: "clerk",
        footer: page.data.dependencies && (
          <PoweredBy packages={page.data.dependencies} />
        ),
      }}
      toc={updatedToc}
    >
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription className="mb-2 text-foreground/70 text-md">
        {page.data.description}
      </DocsDescription>
      <div className="flex flex-wrap items-center gap-2 border-b pt-2 pb-6">
        <LLMCopyButton markdownUrl={`${page.url}.mdx`} />
        <ViewOptions
          githubUrl={`https://github.com/educlopez/smoothui/blob/${process.env.NEXT_PUBLIC_GITHUB_BRANCH ?? "monorepo"}/apps/docs/content/docs/${page.slugs.join("/")}.mdx`}
          markdownUrl={`${page.url}.mdx`}
        />
        {registryUrl && <OpenInV0Button url={registryUrl} />}
        {lastModified && (
          <LastModified
            className="order-last w-full pt-2 sm:order-0 sm:ml-auto sm:w-auto sm:pt-0"
            lastModified={lastModified}
          />
        )}
      </div>
      <DocsBody>
        {page.data.installer && (
          <>
            <Preview path={page.data.installer} type={type} />
            <h2 id="installation">Installation</h2>
            <Installer packageName={page.data.installer} />
          </>
        )}
        <MDX
          components={{
            ...defaultMdxComponents,
            Tab,
            Tabs,
            // HTML `ref` attribute conflicts with `forwardRef`
            pre: (preProps) => {
              const { ref: _ref, ...restProps } = preProps;
              return (
                <CodeBlock {...restProps}>
                  <Pre>{restProps.children}</Pre>
                </CodeBlock>
              );
            },
            AutoTypeTable: AutoTypeTableWithGenerator,
            Installer,
            Preview,
            PoweredBy,
            BodyText,
            FeatureCard,
            FeatureCardHover,
            Divider,
            ChangelogEntry,
            SponsorsPageContent,
          }}
        />
      </DocsBody>
    </DocsPage>
  );
}
export async function generateMetadata(
  props: PageProps<"/docs/[...slug]">
): Promise<Metadata> {
  const { slug = [] } = await props.params;
  const page = source.getPage(slug);

  // biome-ignore lint/style/useBlockStatements: we need to return the metadata for the not found page
  if (!page)
    return createMetadata({
      title: "Not Found",
    });

  const description =
    page.data.description ??
    "Beautiful React components with smooth animations";

  const image = {
    url: getPageImage(page).url,
    width: 1200,
    height: 630,
  };

  return createMetadata({
    title: page.data.title,
    description,
    openGraph: {
      url: `/docs/${page.slugs.join("/")}`,
      images: [image],
    },
    twitter: {
      images: [image],
    },
  });
}

export function generateStaticParams() {
  return source.generateParams();
}
