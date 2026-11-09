import type { Metadata } from "next/types";

const defaultOgImage = {
  alt: "SmoothUI — React components. Made to move.",
  height: 630,
  type: "image/gif",
  url: "https://smoothui.dev/og/og.gif",
  width: 1200,
};

const defaultOgVideo = {
  height: 630,
  type: "video/mp4",
  url: "https://smoothui.dev/og/og.mp4",
  width: 1200,
};

const defaultTwitterImage = {
  alt: "SmoothUI — React components. Made to move.",
  height: 630,
  url: "https://smoothui.dev/og/og-poster.png",
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
