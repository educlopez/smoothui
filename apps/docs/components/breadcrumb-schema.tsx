import Script from "next/script";

interface BreadcrumbSchemaProps {
  slugs: string[];
  title: string;
}

const sectionLabels: Record<string, string> = {
  components: "Components",
  blocks: "Blocks",
  guides: "Guides",
};

export function BreadcrumbSchema({ slugs, title }: BreadcrumbSchemaProps) {
  const items: { name: string; item: string }[] = [
    { name: "Home", item: "https://smoothui.dev" },
    { name: "Docs", item: "https://smoothui.dev/docs" },
  ];

  if (slugs.length > 0) {
    const section = slugs[0];
    const label = sectionLabels[section] ?? section;
    items.push({
      name: label,
      item: `https://smoothui.dev/docs/${section}`,
    });
  }

  if (slugs.length > 1) {
    items.push({
      name: title,
      item: `https://smoothui.dev/docs/${slugs.join("/")}`,
    });
  }

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.name,
      item: entry.item,
    })),
  };

  return (
    <Script
      // biome-ignore lint/security/noDangerouslySetInnerHtml: Schema.org JSON-LD structured data requires innerHTML
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      id="breadcrumb-schema"
      type="application/ld+json"
    />
  );
}
