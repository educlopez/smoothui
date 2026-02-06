import Script from "next/script";

interface ArticleSchemaProps {
  title: string;
  description: string;
  date: string;
  author?: string;
  url: string;
  image?: string;
}

export function ArticleSchema({
  title,
  description,
  date,
  author,
  url,
  image,
}: ArticleSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    datePublished: date,
    dateModified: date,
    author: author
      ? {
          "@type": "Person",
          name: author,
        }
      : undefined,
    publisher: {
      "@type": "Organization",
      name: "SmoothUI",
      logo: {
        "@type": "ImageObject",
        url: "https://smoothui.dev/logo.png",
      },
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
