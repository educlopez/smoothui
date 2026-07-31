import { getBlockCategories } from "@docs/lib/blocks-gallery";

import { BlockGallery } from "./block-gallery";

/**
 * Server wrapper for the blocks index, used as an MDX component.
 *
 * Reading the categories on the server keeps the counts honest — they come from
 * the category pages themselves — and leaves the client with nothing to fetch.
 */
export const BlocksGalleryPage = async () => {
  const categories = await getBlockCategories();

  return <BlockGallery categories={categories} />;
};
