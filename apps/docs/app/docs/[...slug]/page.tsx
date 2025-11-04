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
import { FeatureCard } from "../../../components/feature-card";
import { FeatureCardHover } from "../../../components/feature-card-hover";
import { Installer } from "../../../components/installer";
import Divider from "../../../components/landing/divider";
import { LastModified } from "../../../components/last-modified";
import { PoweredBy } from "../../../components/powered-by";
import { Preview } from "../../../components/preview";
import { createMetadata } from "../../../lib/metadata";
import { source } from "../../../lib/source";
import { typeGenerator } from "../../../mdx-components";

export const revalidate = false;

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
      <DocsDescription>{page.data.description}</DocsDescription>
      {lastModified && (
        <LastModified className="mt-2" lastModified={lastModified} />
      )}
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
            AutoTypeTable: (props) => (
              <AutoTypeTable {...props} generator={typeGenerator} />
            ),
            Installer,
            Preview,
            PoweredBy,
            BodyText,
            FeatureCard,
            FeatureCardHover,
            Divider,
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
    page.data.description ?? "The library for building documentation sites";

  const image = {
    url: ["/og", ...slug, "image.webp"].join("/"),
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
