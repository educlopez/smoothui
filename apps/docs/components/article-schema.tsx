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
  image,
}: ArticleSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    datePublished: date,
    dateModified: dateModified ?? date,
    author: author
      ? {
          "@type": "Person",
          name: author,
        }
      : undefined,
    publisher: {
      "@id": "https://smoothui.dev/#organization",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://smoothui.dev${url}`,
    },
    image:
      image ??
      `https://smoothui.dev/og/blog/${url.replace("/blog/", "")}/image.png`,
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
