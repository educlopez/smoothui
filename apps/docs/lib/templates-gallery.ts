import { source } from "@docs/lib/source";

export type TemplateMeta = {
  description: string;
  href: string;
  /** Registry name, and the id of its isolated preview route. */
  installer: string;
  slug: string;
  title: string;
};

/**
 * Every template, for the index and for its own page.
 *
 * Read from the page tree rather than a hand-kept list, so a new template
 * appears on the index as soon as its MDX exists.
 */
export const getTemplates = (): TemplateMeta[] => {
  const templates: TemplateMeta[] = [];

  for (const page of source.getPages()) {
    if (!page.data.info.path.startsWith("templates/")) {
      continue;
    }

    const slug = page.slugs.at(-1);
    const { installer } = page.data;

    if (!(slug && installer) || page.slugs.length < 2) {
      continue;
    }

    templates.push({
      description: page.data.description ?? "",
      href: page.url,
      installer,
      slug,
      title: page.data.title,
    });
  }

  return templates.sort((a, b) => a.title.localeCompare(b.title));
};
