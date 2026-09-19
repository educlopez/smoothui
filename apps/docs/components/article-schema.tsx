import { blogCoverImage } from "@docs/lib/blog-cover";
import Script from "next/script";

interface ArticleSchemaProps {
  author?: string;
  date: string;
  dateModified?: string;
  description: string;
  image?: string;
  title: string;
  url: string;
}

export function ArticleSchema({
  title,
  description,
  date,
  dateModified,
  author,
  url,
}: ArticleSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    author: author
      ? {
          "@type": "Person",
          name: author,
        }
      : undefined,
    dateModified: dateModified ?? date,
    datePublished: date,
    description,
    headline: title,
    image: blogCoverImage(url),
    mainEntityOfPage: {
      "@id": `https://smoothui.dev${url}`,
      "@type": "WebPage",
    },
    publisher: {
      "@id": "https://smoothui.dev/#organization",
    },
  };

  return (
    <Script
      // biome-ignore lint/security/noDangerouslySetInnerHtml: Schema.org JSON-LD structured data requires innerHTML
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      id="article-schema"
      type="application/ld+json"
    />
  );
}
