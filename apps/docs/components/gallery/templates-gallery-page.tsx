import { getTemplates } from "@docs/lib/templates-gallery";

import { TemplateGallery } from "./template-gallery";

/** Server wrapper for the templates index, used as an MDX component. */
export const TemplatesGalleryPage = () => (
  <TemplateGallery templates={getTemplates()} />
);
