import type { Metadata } from "next/types";

const defaultOgImage = {
  alt: "SmoothUI: real components fanning out between Smooth and UI",
  height: 630,
  type: "image/gif",
  url: "https://smoothui.dev/social/og-animated.gif",
  width: 1200,
};

const defaultOgVideo = {
  height: 630,
  type: "video/mp4",
  url: "https://smoothui.dev/social/og-animated.mp4",
  width: 1200,
};

const defaultTwitterImage = {
  alt: "SmoothUI: real components fanning out between Smooth and UI",
  height: 630,
  url: "https://smoothui.dev/social/og-animated-poster.png",
  width: 1200,
};

export function createMetadata(override: Metadata): Metadata {
  const inheritsDefaultImage =
    override.openGraph?.images === undefined ||
    override.openGraph?.images === null;

  return {
    ...override,
    alternates: {
      ...override.alternates,
    },
    openGraph: {
      description: override.description ?? undefined,
      images: [defaultOgImage],
      locale: "en_US",
      siteName: "SmoothUI",
      title: override.title ?? undefined,
      type: "website",
      url: "https://smoothui.dev",
      ...(inheritsDefaultImage ? { videos: [defaultOgVideo] } : {}),
      ...override.openGraph,
      // An explicit `images: undefined` must not wipe the fallback.
      ...(inheritsDefaultImage ? { images: [defaultOgImage] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      creator: "@educalvolpz",
      description: override.description ?? undefined,
      images: [defaultTwitterImage],
      site: "@educalvolpz",
      title: override.title ?? undefined,
      ...override.twitter,
    },
  };
}

export const baseUrl =
  process.env.NODE_ENV === "development" ||
  !process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? new URL("http://localhost:3000")
    : new URL(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`);
