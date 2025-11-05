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
import { BodyText } from "../../../components/body-text";
import { ChangelogEntry } from "../../../components/changelog-entry";
import { FeatureCard } from "../../../components/feature-card";
import { FeatureCardHover } from "../../../components/feature-card-hover";
import { Installer } from "../../../components/installer";
import Divider from "../../../components/landing/divider";
import { LastModified } from "../../../components/last-modified";
import { LLMCopyButton, ViewOptions } from "../../../components/page-actions";
import { OpenInV0Button } from "../../../components/open-in-v0-button";
import { PoweredBy } from "../../../components/powered-by";
import { Preview } from "../../../components/preview";
import { domain } from "../../../lib/domain";
import { createMetadata } from "../../../lib/metadata";
import { getPageImage, source } from "../../../lib/source";
import { typeGenerator } from "../../../mdx-components";

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
  const isComponentOrBlock = page.data.info.path.startsWith("components") || page.data.info.path.startsWith("blocks");

  // Get the component/block name from the last slug (skip index pages)
  const componentName = isComponentOrBlock && page.slugs.length > 1
    ? page.slugs[page.slugs.length - 1]
    : null;
  const registryUrl = componentName ? `${domain}/r/${componentName}.json` : null;

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
      <div className="flex flex-row items-center gap-2 border-b pt-2 pb-6">
        <LLMCopyButton markdownUrl={`${page.url}.mdx`} />
        <ViewOptions
          githubUrl={`https://github.com/educlopez/smoothui/blob/${process.env.NEXT_PUBLIC_GITHUB_BRANCH ?? "monorepo"}/apps/docs/content/docs/${page.slugs.join("/")}.mdx`}
          markdownUrl={`${page.url}.mdx`}
        />
        {registryUrl && <OpenInV0Button url={registryUrl} />}
        {lastModified && <LastModified lastModified={lastModified} />}
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
    page.data.description ?? "Beautiful React components with smooth animations";

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
