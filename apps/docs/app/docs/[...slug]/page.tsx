import { AddToKitButton } from "@docs/components/add-to-kit-button";
import { BlurMagic } from "@docs/components/blurmagic/blurmagic";
import { BodyText } from "@docs/components/body-text";
import { BreadcrumbSchema } from "@docs/components/breadcrumb-schema";
import { BundleSizeBadge } from "@docs/components/bundle-size-badge";
import { ChangelogEntry } from "@docs/components/changelog-entry";
import { Contributor } from "@docs/components/contributor";
import { FeatureCard } from "@docs/components/feature-card";
import { FeatureCardHover } from "@docs/components/feature-card-hover";
import { BlocksGalleryPage, GalleryPage } from "@docs/components/gallery";
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

// The file tree for one demo, keyed by where each file lands after installing —
// the registry writes every package to `components/smoothui/<name>/`. The demo
// itself is not installed anywhere; it is the usage example, so it sits at the
// root of the tree.
const toPreviewFiles = (data: Awaited<ReturnType<typeof loadPreview>>) => [
  { code: data.parsedCode, path: "demo.tsx" },
  ...data.sourceComponents.map((component) => ({
    code: component.source
      .replace(SHADCN_SOURCE_IMPORT, "@/")
      .replace(REPO_SOURCE_IMPORT, "@/components/smoothui/"),
    path: component.target,
  })),
];

export default async function Page(props: PageProps<"/docs/[...slug]">) {
  const params = await props.params;
  const page = source.getPage(params.slug);

  if (!page) {
    notFound();
  }

  const MDX = page.data.body;

  // Access lastModified from page data (available when lastModifiedTime: 'git' is enabled)
  const lastModified = (page.data as { lastModified?: number }).lastModified;

  const type = page.data.info.path.startsWith("blocks") ? "block" : "component";
  const isComponentOrBlock =
    page.data.info.path.startsWith("components") ||
    page.data.info.path.startsWith("blocks");

  // Get the component name from the last slug (skip index pages).
  //
  // Block pages are excluded on purpose: a page like `blocks/hero` documents
  // five packages and is not one itself, so `/r/hero.json` 500s and the bundle
  // size 404s. Everything that identifies a single package — Open in v0, the
  // bundle badge, the registry URL — belongs on each block's own toolbar.
  const componentName =
    isComponentOrBlock && type !== "block" && page.slugs.length > 1
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

  // Split is the default for component pages: one component, one stage. A block
  // page documents several blocks at once, so it stays stacked — each preview
  // full width under the section that describes it, with its own controls.
  const installer = page.data.installer;
  const isSplit = Boolean(
    installer && (page.data.splitPreview ?? type === "component")
  );

  const previewData =
    isSplit && installer ? await loadPreview({ path: installer, type }) : null;

  // Blocks are full-width page sections. Capping the article at 1200px showed
  // every hero at a width nobody ships one at, which is the whole reason to be
  // looking at a preview.
  //
  // `min-w-0` is not cosmetic: the article is a grid item, so it defaults to
  // `min-width: auto` and sizes itself to its widest content. One long Tailwind
  // class string in a source file stretched it to ~3900px, which pushed the
  // preview column off screen instead of scrolling inside the code pane.
  // The index galleries are wall-to-wall previews, same as a block page, so
  // they get the whole track rather than the reading-width cap.
  const isGalleryIndex = isComponentOrBlock && page.slugs.length === 1;
  let contentWidth = "min-w-0";
  if (!isSplit) {
    contentWidth =
      type === "block" || isGalleryIndex
        ? "min-w-0 max-w-none"
        : "min-w-0 max-w-[75rem]";
  }

  // The install section is injected by the layout, not written in the MDX, so it
  // is missing from the generated table of contents. Only add the entry where
  // the anchor actually exists — block pages install per block, from each
  // preview's own toolbar.
  const updatedToc: TableOfContents = installer
    ? [
        { depth: 2, title: "Installation", url: "#installation" },
        ...page.data.toc,
      ]
    : page.data.toc;

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
        BlocksGallery: BlocksGalleryPage,
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
        className={contentWidth}
        // Split pages render their own prev/next at the end of the reading
        // column; Fumadocs' full-width one underneath would be the same links
        // twice. The gallery indexes drop it too: a "next page" pointing at the
        // first category is noise under a grid that already links to all of
        // them.
        footer={isSplit || isGalleryIndex ? { enabled: false } : undefined}
        full={page.data.full ?? isSplit}
        tableOfContent={{
          style: "clerk",
          footer: footerContent,
        }}
        toc={updatedToc}
      >
        {isSplit && previewData ? (
          <DocsBody>
            <SplitDocsChrome />
            <SplitPreviewShell
              files={previewData ? toPreviewFiles(previewData) : []}
              nav={
                <DocsBreadcrumb
                  section={sectionNav.title}
                  title={page.data.title}
                />
              }
              popOutHref={
                installer
                  ? `${type === "block" ? "/blocks" : ""}/preview/${installer}`
                  : ""
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
            {/* Blocks and the two index galleries borrow the split pages'
                chrome: the catalogue starts collapsed and the crumb doubles as
                its handle. These pages are wall-to-wall previews, so 240px of
                permanent sidebar was coming straight out of them. */}
            {isComponentOrBlock && (
              <>
                <SplitDocsChrome hideLayoutFooter={false} />
                {/* Same geometry as the split pages: the row cancels the
                    article's 56px top padding so it starts pinned under the
                    navbar instead of travelling down on the first scroll, and
                    the content below it begins past the fade rather than opening
                    already smudged. */}
                {/* Desktop only. The crumb doubles as the handle for a sidebar
                    that is only collapsed on wide screens; on a phone the navbar
                    already carries the drawer toggle, and showing both would
                    offer the same sidebar twice. */}
                <div className="not-prose sticky top-[6.5rem] z-10 mb-6 hidden items-center py-2 lg:-mt-14 lg:mb-36 lg:flex">
                  {/* The module only blurs; painting the page colour under the
                      mask is what makes the text dissolve instead of staying
                      legible-but-smudged. */}
                  <BlurMagic
                    background="var(--color-background)"
                    blur="6px"
                    className="absolute! inset-x-0! -top-2! -z-10 h-[178px]! w-auto!"
                    side="top"
                    stop="25%"
                    style={{
                      background:
                        "linear-gradient(to bottom, var(--color-background), transparent)",
                    }}
                  />
                  <DocsBreadcrumb
                    section={sectionNav.title}
                    title={page.data.title}
                  />
                </div>
              </>
            )}
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
