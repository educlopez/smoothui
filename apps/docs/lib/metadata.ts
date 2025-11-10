import type { Metadata } from "next/types";

export function createMetadata(override: Metadata): Metadata {
  const defaultOgImage = {
    width: 1200,
    height: 630,
    url: "https://smoothui.dev/og-optimized.webp",
    alt: "SmoothUI Cover",
  };

  return {
    ...override,
    openGraph: {
      title: override.title ?? undefined,
      description: override.description ?? undefined,
      url: "https://smoothui.dev",
      images: [defaultOgImage],
      siteName: "SmoothUI",
      locale: "en_US",
      type: "website",
      ...override.openGraph,
    },
    twitter: {
      card: "summary_large_image",
      creator: "@educalvolpz",
      site: "@educalvolpz",
      title: override.title ?? undefined,
      description: override.description ?? undefined,
      images: [defaultOgImage],
      ...override.twitter,
    },
    alternates: {
      ...override.alternates,
    },
  };
}

export const baseUrl =
  process.env.NODE_ENV === "development" ||
  !process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? new URL("http://localhost:3000")
    : new URL(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`);
