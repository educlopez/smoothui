const BASE_URL = "https://smoothui.dev";

type ComponentSchemaProps = {
  /** npm packages the component needs, from the `dependencies` frontmatter. */
  dependencies?: string[];
  description: string;
  /** Registry name, present on any page that documents an installable item. */
  installer?: string;
  /** `["components", "magnetic-button"]` */
  slugs: string[];
  title: string;
};

/**
 * Page-level structured data for a component, block or template page.
 *
 * The site-wide graph in `app/utils/schema.ts` describes SmoothUI as a whole,
 * and the breadcrumb describes where the page sits — but the pages that actually
 * earn the traffic had nothing describing what *they* are. `TechArticle` plus the
 * `SoftwareSourceCode` it is about is the honest reading of a component page: an
 * article documenting a piece of source you can install.
 *
 * The install command is modelled as the `installUrl` of a `SoftwareApplication`
 * action rather than prose, so an assistant answering "how do I install this" has
 * the exact command as data instead of having to parse the page.
 */
export function ComponentSchema({
  dependencies,
  description,
  installer,
  slugs,
  title,
}: ComponentSchemaProps) {
  const pageUrl = `${BASE_URL}/docs/${slugs.join("/")}`;

  const sourceCode = installer
    ? {
        "@type": "SoftwareSourceCode",
        codeRepository: "https://github.com/educlopez/smoothui",
        description,
        license: "https://opensource.org/licenses/MIT",
        name: title,
        programmingLanguage: {
          "@type": "ComputerLanguage",
          name: "TypeScript",
        },
        runtimePlatform: "React",
        // The registry item is the installable artefact behind the article.
        targetProduct: {
          "@type": "SoftwareApplication",
          applicationCategory: "DeveloperApplication",
          installUrl: `${BASE_URL}/r/${installer}.json`,
          name: `SmoothUI ${title}`,
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
          operatingSystem: "Any",
          softwareRequirements:
            dependencies && dependencies.length > 0
              ? dependencies.join(", ")
              : undefined,
        },
        url: pageUrl,
      }
    : undefined;

  const schema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    about: sourceCode,
    author: { "@id": `${BASE_URL}/#organization` },
    description,
    headline: title,
    isPartOf: { "@id": `${BASE_URL}/#website` },
    mainEntityOfPage: {
      "@id": pageUrl,
      "@type": "WebPage",
    },
    proficiencyLevel: "Beginner",
    publisher: { "@id": `${BASE_URL}/#organization` },
    url: pageUrl,
  };

  // A plain <script> rather than next/script: next/script injects after
  // hydration, so the JSON-LD is absent from the server HTML — which is all that
  // many crawlers, and most LLM fetchers, ever read. JSON-LD is inert data, so
  // there is nothing to defer.
  return (
    <script
      // biome-ignore lint/security/noDangerouslySetInnerHtml: Schema.org JSON-LD structured data requires innerHTML
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      id="component-schema"
      type="application/ld+json"
    />
  );
}
