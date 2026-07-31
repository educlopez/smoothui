import type { StaticImageData } from "next/image";

import chatDesktop from "./shots/chat-template-desktop.webp";
import chatMobile from "./shots/chat-template-mobile.webp";

export type TemplateShot = {
  alt: string;
  /** Shown under the frame, the way a kit labels its screens. */
  caption: string;
  image: StaticImageData;
  /** Phone shots sit at the width they were taken at, not full bleed. */
  narrow?: boolean;
};

/**
 * Screenshots per template, keyed by registry name.
 *
 * A template is a whole surface, so its page sells it the way a theme shop does:
 * stills of the real thing plus a live preview, not a wall of source. Reading a
 * chat app's source to decide whether you want it is the wrong order.
 *
 * The phone shot is taken from a real browser, not headless: headless Chrome
 * ignores a window narrower than roughly 500px and lays the page out wider before
 * cropping the image, so every capture came out looking clipped when the template
 * was fine. Load the preview route in a 390px iframe and crop that region.
 */
export const TEMPLATE_SHOTS: Record<string, TemplateShot[]> = {
  "chat-template": [
    {
      alt: "Chat template on a desktop viewport, with the conversation sidebar open",
      caption: "Sidebar, transcript and composer on a desktop viewport",
      image: chatDesktop,
    },
    {
      alt: "Chat template on a phone, with the conversation list behind a header button",
      caption: "The same surface at 390px",
      image: chatMobile,
      narrow: true,
    },
  ],
};
