import type { Metadata } from "next/types";

export function createMetadata(override: Metadata): Metadata {
  const defaultOgImage = {
    alt: "SmoothUI Cover",
    height: 630,
    url: "https://smoothui.dev/og-optimized.webp",
    width: 1200,
  };

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
      ...override.openGraph,
    },
    twitter: {
      card: "summary_large_image",
      creator: "@educalvolpz",
      description: override.description ?? undefined,
      images: [defaultOgImage],
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
