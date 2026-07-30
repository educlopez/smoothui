import { AddToKitButton } from "@docs/components/add-to-kit-button";
import { BodyText } from "@docs/components/body-text";
import { BreadcrumbSchema } from "@docs/components/breadcrumb-schema";
import { BundleSizeBadge } from "@docs/components/bundle-size-badge";
import { ChangelogEntry } from "@docs/components/changelog-entry";
import { Contributor } from "@docs/components/contributor";
import { FeatureCard } from "@docs/components/feature-card";
import { FeatureCardHover } from "@docs/components/feature-card-hover";
import { GalleryPage } from "@docs/components/gallery";
import { Installer } from "@docs/components/installer";
import Divider from "@docs/components/landing/divider";
import { FooterBody } from "@docs/components/landing/footer";
import { LastModified } from "@docs/components/last-modified";
import { OpenInV0Button } from "@docs/components/open-in-v0-button";
import { PackageManagerTabs } from "@docs/components/package-manager-tabs";
import { LLMCopyButton, ViewOptions } from "@docs/components/page-actions";
import { PoweredBy } from "@docs/components/powered-by";
import { loadPreview, Preview } from "@docs/components/preview";
import { DocsBreadcrumb } from "@docs/components/preview/docs-breadcrumb";
import { SplitDocsChrome } from "@docs/components/preview/split-docs-chrome";
import { SplitPreviewShell } from "@docs/components/preview/split-shell";
import { Reference } from "@docs/components/reference";
import { SponsorsPageContent } from "@docs/components/sponsors-page-content";
import { domain } from "@docs/lib/domain";
import {
  type ContributorInfo,
  getComponentContributors,
} from "@docs/lib/git-contributor";
import { createMetadata } from "@docs/lib/metadata";
import { getSectionNav } from "@docs/lib/section-nav";
import { getPageImage, source } from "@docs/lib/source";
import { typeGenerator } from "@docs/mdx-components";
import { findNeighbour } from "fumadocs-core/page-tree";
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
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = false;

// Same rewrites the old source accordion applied, so tabs show the paths a user
// will actually have after installing.
const SHADCN_SOURCE_IMPORT = /@repo\/shadcn-ui\//g;
const REPO_SOURCE_IMPORT = /@repo\//g;

// Wrapper component for AutoTypeTable with typeGenerator
const AutoTypeTableWithGenerator = (
  props: React.ComponentProps<typeof AutoTypeTable>
) => <AutoTypeTable {...props} generator={typeGenerator} />;

// Renders BodyText as div to avoid <p>-in-<p> hydration errors when MDX wraps content in <p>
const BodyTextAsDiv = (props: React.ComponentProps<typeof BodyText>) => (
  <BodyText as="div" {...props} />
);

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

  const dependencies = page.data.dependencies;
  const references = page.data.references;
  const contributorFromFrontmatter = page.data.contributor;

  // Get all contributors from GitHub API (automatic, similar to lastModified)
  // During build, we might hit rate limits, so we gracefully handle failures
  let allContributors: ContributorInfo[] = [];
  let creator: { name: string; url?: string; avatar?: string } | null = null;

  if (componentName) {
    try {
      allContributors = await getComponentContributors(type, componentName);
    } catch (error) {
      // Log error but don't fail the page generation
      // This allows the page to build successfully even if GitHub API is unavailable
      console.error(
        `Failed to fetch contributors for ${type}/${componentName}:`,
        error instanceof Error ? error.message : String(error)
      );
      allContributors = [];
    }

    // Get creator (first contributor or from frontmatter)
    if (contributorFromFrontmatter) {
      creator = {
        name: contributorFromFrontmatter.name,
        url: contributorFromFrontmatter.url,
        avatar: contributorFromFrontmatter.avatar,
      };
    } else if (allContributors.length > 0) {
      const firstContributor = allContributors[0];
      creator = {
        name: firstContributor.name,
        url: firstContributor.url,
        avatar: firstContributor.avatar,
      };
    }
  } else if (contributorFromFrontmatter) {
    creator = {
      name: contributorFromFrontmatter.name,
      url: contributorFromFrontmatter.url,
      avatar: contributorFromFrontmatter.avatar,
    };
  }

  // Split is the default for component pages: one component, one stage. Block
  // pages document several blocks at once and have no single `installer`, so they
  // keep the stacked layout unless a page opts in with `splitPreview: true`.
  const installer = page.data.installer;
  const isSplit = Boolean(
    installer && (page.data.splitPreview ?? type === "component")
  );
  const previewData =
    isSplit && installer ? await loadPreview({ path: installer, type }) : null;

  const hasDependencies =
    Array.isArray(dependencies) && dependencies.length > 0;
  const hasReferences = Array.isArray(references) && references.length > 0;
  const hasContributor = creator !== null;

  const footerContent =
    hasDependencies || hasReferences || hasContributor ? (
      <>
        {hasContributor && creator && (
          <Contributor contributors={allContributors} creator={creator} />
        )}
        {hasDependencies && <PoweredBy packages={dependencies} />}
        {hasReferences && <Reference sources={references} />}
      </>
    ) : undefined;

  const heading = (
    <>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription className="mb-2 text-foreground/70 text-md">
        {page.data.description}
      </DocsDescription>
    </>
  );

  const mdxBody = (
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
        Reference,
        Contributor,
        BodyText: BodyTextAsDiv,
        FeatureCard,
        FeatureCardHover,
        Divider,
        ChangelogEntry,
        SponsorsPageContent,
        GalleryPage,
        PackageManagerTabs,
      }}
    />
  );

  const actionRow = (
    <div className="flex flex-wrap items-center gap-2 border-b pt-2 pb-6">
      <LLMCopyButton markdownUrl={`${page.url}.mdx`} />
      <ViewOptions
        githubUrl={`https://github.com/educlopez/smoothui/blob/${process.env.NEXT_PUBLIC_GITHUB_BRANCH ?? "monorepo"}/apps/docs/content/docs/${page.slugs.join("/")}.mdx`}
        markdownUrl={`${page.url}.mdx`}
      />
      {registryUrl && <OpenInV0Button url={registryUrl} />}
      {installer && (
        <AddToKitButton size="sm" slug={installer} title={page.data.title} />
      )}
      {(componentName || lastModified) && (
        <div className="order-last flex w-full items-center gap-2 pt-2 sm:order-0 sm:ml-auto sm:w-auto sm:pt-0">
          {componentName && <BundleSizeBadge slug={componentName} />}
          {lastModified && <LastModified lastModified={lastModified} />}
        </div>
      )}
    </div>
  );

  const neighbours = findNeighbour(source.pageTree, page.url);
  const sectionNav = getSectionNav(source.pageTree, page.url);

  const pageNav =
    neighbours.previous || neighbours.next ? (
      <nav className="not-prose mt-10 grid gap-3 border-t pt-6 sm:grid-cols-2">
        {neighbours.previous ? (
          <Link
            className="flex flex-col gap-0.5 rounded-xl border p-3 transition-colors hover:bg-muted"
            href={neighbours.previous.url}
          >
            <span className="text-muted-foreground text-xs">Previous</span>
            <span className="font-medium text-sm">
              {neighbours.previous.name}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {neighbours.next && (
          <Link
            className="flex flex-col gap-0.5 rounded-xl border p-3 text-right transition-colors hover:bg-muted sm:items-end"
            href={neighbours.next.url}
          >
            <span className="text-muted-foreground text-xs">Next</span>
            <span className="font-medium text-sm">{neighbours.next.name}</span>
          </Link>
        )}
      </nav>
    ) : null;

  const installSection = installer ? (
    <>
      <h2 id="installation">Installation</h2>
      <Installer addToKit={false} packageName={installer} />
    </>
  ) : null;

  return (
    <>
      <BreadcrumbSchema slugs={page.slugs} title={page.data.title} />
      <DocsPage
        className={isSplit ? undefined : "max-w-[75rem]"}
        // Split pages render their own prev/next at the end of the reading
        // column; Fumadocs' full-width one underneath would be the same links
        // twice.
        footer={isSplit ? { enabled: false } : undefined}
        full={page.data.full ?? isSplit}
        tableOfContent={{
          style: "clerk",
          footer: footerContent,
        }}
        toc={updatedToc}
      >
        {isSplit && previewData && installer ? (
          <DocsBody>
            <SplitDocsChrome />
            <SplitPreviewShell
              files={[
                // Named for what it is: the component\'s own file is in the list too,
                // and two tabs called siri-orb.tsx helped nobody.
                { code: previewData.parsedCode, name: "demo.tsx" },
                ...previewData.sourceComponents.map((component) => ({
                  code: component.source
                    .replace(SHADCN_SOURCE_IMPORT, "@/")
                    .replace(REPO_SOURCE_IMPORT, "@/components/smoothui/"),
                  name: `${component.name}.tsx`,
                })),
              ]}
              nav={
                <DocsBreadcrumb
                  section={sectionNav.title}
                  title={page.data.title}
                />
              }
              popOutHref={
                type === "block"
                  ? `/blocks/preview/${installer}`
                  : `/preview/${installer}`
              }
              title={page.data.title}
            >
              {heading}
              {actionRow}
              {installSection}
              {mdxBody}
              {/* On a split page there is no TOC column, and this content used to
                  live in its footer — contributors, dependencies and references
                  would have vanished. It ends the reading column instead. */}
              {footerContent && (
                <div className="not-prose mt-10 flex flex-col gap-4 border-t pt-6">
                  {footerContent}
                </div>
              )}
              {pageNav}
              {/* The site footer belongs at the end of the reading column here,
                  not spanning the full width underneath the stage. The layout's
                  own copy is suppressed by SplitDocsChrome. */}
              <div className="not-prose mt-10 border-t pt-6">
                <FooterBody />
              </div>
            </SplitPreviewShell>
          </DocsBody>
        ) : (
          <>
            {heading}
            {actionRow}
            <DocsBody>
              {installer && (
                <>
                  <Preview path={installer} type={type} />
                  {installSection}
                </>
              )}
              {mdxBody}
            </DocsBody>
          </>
        )}
      </DocsPage>
    </>
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

  // Per-page fallback so pages without a frontmatter description don't all share
  // one generic (thin/duplicate) meta description.
  const section = slug[0];
  const kind =
    section === "blocks"
      ? "block"
      : section === "guides"
        ? "guide"
        : "component";
  const description =
    page.data.description ??
    `${page.data.title} — an animated React ${kind} for shadcn/ui, built with Motion and Tailwind CSS. Copy, paste, and ship.`;

  const image = {
    url: getPageImage(page).url,
    width: 1200,
    height: 630,
  };

  const pageUrl = `/docs/${page.slugs.join("/")}`;

  return createMetadata({
    title: page.data.title,
    description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      url: pageUrl,
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
