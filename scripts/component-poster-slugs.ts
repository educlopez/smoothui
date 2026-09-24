const SECTION_SEPARATOR_REGEX = /^---(.+)---$/;

/**
 * Component slugs from the docs nav, in nav order.
 *
 * Skips the guide (the index page) and the section labels. These are the
 * cards on `/docs/components`.
 */
export const galleryComponentSlugs = (pages: readonly string[]): string[] => {
  const slugs: string[] = [];
  let category = "";

  for (const entry of pages) {
    const match = SECTION_SEPARATOR_REGEX.exec(entry);
    if (match) {
      category = match[1]?.trim() ?? "";
      continue;
    }
    if (entry === "index" || category === "Guide") {
      continue;
    }
    slugs.push(entry);
  }

  return slugs;
};
