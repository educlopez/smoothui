interface BreadcrumbSchemaProps {
  slugs: string[];
  title: string;
}

const sectionLabels: Record<string, string> = {
  blocks: "Blocks",
  components: "Components",
  guides: "Guides",
};

export function BreadcrumbSchema({ slugs, title }: BreadcrumbSchemaProps) {
  const items: { name: string; item: string }[] = [
    { item: "https://smoothui.dev", name: "Home" },
    { item: "https://smoothui.dev/docs", name: "Docs" },
  ];

  if (slugs.length > 0) {
    const [section] = slugs;
    const label = sectionLabels[section] ?? section;
    items.push({
      item: `https://smoothui.dev/docs/${section}`,
      name: label,
    });
  }

  if (slugs.length > 1) {
    items.push({
      item: `https://smoothui.dev/docs/${slugs.join("/")}`,
      name: title,
    });
  }

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((entry, index) => ({
      "@type": "ListItem",
      item: entry.item,
      name: entry.name,
      position: index + 1,
    })),
  };

  // A plain <script> rather than next/script: next/script injects after
  // hydration, so the JSON-LD is absent from the server HTML — which is all that
  // many crawlers, and most LLM fetchers, ever read. JSON-LD is inert data, so
  // there is nothing to defer.
  return (
    <script
      // biome-ignore lint/security/noDangerouslySetInnerHtml: Schema.org JSON-LD structured data requires innerHTML
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      id="breadcrumb-schema"
      type="application/ld+json"
    />
  );
}
