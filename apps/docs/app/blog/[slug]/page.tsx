import { ArticleSchema } from "@docs/components/article-schema";
import { RelatedPosts } from "@docs/components/related-posts";
import { ShareButtons } from "@docs/components/share-buttons";
import { createMetadata } from "@docs/lib/metadata";
import {
  blogSource,
  formatDate,
  getBlogPageImage,
  getReadingTime,
} from "@docs/lib/source";
import { CodeBlock, Pre } from "fumadocs-ui/components/codeblock";
import defaultMdxComponents from "fumadocs-ui/mdx";
import { DocsBody } from "fumadocs-ui/page";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = false;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = blogSource.getPage([slug]);

  if (!post) {
    notFound();
  }

  const MDX = post.data.body;
  const content = await post.data.getText("processed");
  const readingTime = getReadingTime(content);

  return (
    <>
      <ArticleSchema
        author={post.data.author as string | undefined}
        date={post.data.date as string}
        description={post.data.description ?? ""}
        image={post.data.image as string | undefined}
        title={post.data.title}
        url={post.url}
      />
      <main className="container max-w-6xl py-12">
        <Link
          className="mb-8 inline-flex items-center gap-2 text-foreground/60 text-sm hover:text-foreground"
          href="/blog"
        >
          ← Back to Blog
        </Link>

        <article>
          <header className="mb-8 border-b pb-8">
            <h1 className="mb-4 font-bold text-4xl">{post.data.title}</h1>
            <p className="mb-4 text-foreground/70 text-lg">
              {post.data.description}
            </p>
            <div className="flex items-center gap-3 text-foreground/60 text-sm">
              {post.data.author && (
                <div className="flex items-center gap-2">
                  <img
                    alt={post.data.author as string}
                    className="size-8 rounded-full object-cover"
                    src="https://ik.imagekit.io/16u211libb/avatar-educalvolpz.jpeg?updatedAt=1765524159631&tr=w-64,h-64,q-85,f-auto"
                  />
                  <span className="font-medium text-foreground">
                    {post.data.author as string}
                  </span>
                </div>
              )}
              <span>·</span>
              <time dateTime={post.data.date as string}>
                {formatDate(post.data.date as string)}
              </time>
              <span>·</span>
              <span>{readingTime} min read</span>
            </div>
          </header>

          <DocsBody>
            <MDX
              components={{
                ...defaultMdxComponents,
                pre: (preProps) => {
                  const { ref: _ref, ...restProps } = preProps;
                  return (
                    <CodeBlock {...restProps}>
                      <Pre>{restProps.children}</Pre>
                    </CodeBlock>
                  );
                },
              }}
            />
          </DocsBody>

          <footer className="mt-12 border-t pt-8">
            <ShareButtons title={post.data.title} url={post.url} />
          </footer>

          <RelatedPosts currentSlug={slug} />
        </article>
      </main>
    </>
  );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = blogSource.getPage([slug]);

  if (!post) {
    return createMetadata({
      title: "Not Found",
    });
  }

  const image = getBlogPageImage(slug);

  return createMetadata({
    title: post.data.title,
    description: post.data.description,
    openGraph: {
      type: "article",
      url: `/blog/${slug}`,
      publishedTime: post.data.date as string,
      authors: post.data.author ? [post.data.author as string] : undefined,
      images: [{ url: image.url, width: 1200, height: 630 }],
    },
    twitter: {
      images: [{ url: image.url, width: 1200, height: 630 }],
    },
  });
}

export function generateStaticParams() {
  return blogSource.getPages().map((page) => ({
    slug: page.slugs[0],
  }));
}
