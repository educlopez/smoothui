import type { StaticImageData } from "next/image";

import chatDesktop from "./shots/chat-template-desktop.webp";
import chatMobile from "./shots/chat-template-mobile.webp";

export type TemplateShot = {
  alt: string;
  image: StaticImageData;
  /** Phone shots are shown narrow beside the wide ones rather than full bleed. */
  narrow?: boolean;
};

/**
 * Screenshots per template, keyed by registry name.
 *
 * A template is a whole surface, so its page sells it the way a theme shop does:
 * stills of the real thing plus a live preview, not a wall of source. The code is
 * one command away and reading it here helps nobody decide.
 */
export const TEMPLATE_SHOTS: Record<string, TemplateShot[]> = {
  "chat-template": [
    { alt: "Chat template on a desktop viewport", image: chatDesktop },
    {
      alt: "Chat template on a phone viewport",
      image: chatMobile,
      narrow: true,
    },
  ],
};
