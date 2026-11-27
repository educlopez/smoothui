import { blogCoverImage } from "@docs/lib/blog-cover";

const BASE_URL = "https://smoothui.dev";

// Every post is written by the same person. Frontmatter carries a short
// display name ("Eduardo Calvo"); the schema uses the full name and a URL so
// search engines can tie the posts to one author entity.
const AUTHOR = {
  "@type": "Person",
  name: "Eduardo Calvo López",
  sameAs: ["https://twitter.com/educalvolpz", "https://github.com/educlopez"],
  url: "https://educalvolopez.com",
} as const;

interface ArticleSchemaProps {
  date: string;
  dateModified?: string;
  description: string;
  title: string;
  url: string;
}

export function ArticleSchema({
  title,
  description,
  date,
  dateModified,
  url,
}: ArticleSchemaProps) {
  const pageUrl = `${BASE_URL}${url}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    author: AUTHOR,
    dateModified: dateModified ?? date,
    datePublished: date,
    description,
    headline: title,
    image: blogCoverImage(url),
    mainEntityOfPage: {
      "@id": pageUrl,
      "@type": "WebPage",
    },
    publisher: {
      "@id": `${BASE_URL}/#organization`,
      "@type": "Organization",
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/logo-smoothui.svg`,
      },
      name: "SmoothUI",
      url: BASE_URL,
    },
    url: pageUrl,
  };

  // A plain <script>, not next/script: next/script injects JSON-LD on the
  // client, so it never reaches the server-rendered HTML crawlers read.
  return (
    <script
      // biome-ignore lint/security/noDangerouslySetInnerHtml: Schema.org JSON-LD structured data requires innerHTML
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      type="application/ld+json"
    />
  );
}
