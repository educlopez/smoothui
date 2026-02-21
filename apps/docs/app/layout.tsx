import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { RootProvider } from "fumadocs-ui/provider/next";
import type { Metadata } from "next";
import Script from "next/script";
import "./global.css";
import { inter, poppins } from "./fonts";
import { smoothUISchema } from "./utils/schema";

const enableUmami = process.env.NEXT_PUBLIC_ENABLE_UMAMI === "true";
const enableVercelAnalytics =
  process.env.NEXT_PUBLIC_ENABLE_VERCEL_ANALYTICS !== "false";

export const metadata: Metadata = {
  metadataBase: new URL("https://smoothui.dev"),
  alternates: {
    canonical: "/",
  },
  title: {
    default:
      "SmoothUI - Animated React Components for shadcn/ui | Motion & Tailwind",
    template: "%s | SmoothUI",
  },
  description:
    "Beautiful animated React components with smooth Motion animations. Drop-in shadcn/ui compatible, fully customizable. 50+ free components with Tailwind CSS for modern UIs.",
  keywords: [
    "react components",
    "tailwindcss ui",
    "motion animations",
    "framer motion",
    "shadcn/ui",
    "shadcn ui components",
    "react ui library",
    "customizable components",
    "animated ui components",
    "dark mode components",
    "shadcn alternative",
  ],
  openGraph: {
    title: "SmoothUI - Animated React Components for shadcn/ui",
    description:
      "Beautiful animated React components with smooth Motion animations. Drop-in shadcn/ui compatible, fully customizable. 50+ free components for modern UIs.",
    url: "https://smoothui.dev",
    siteName: "SmoothUI",
    images: [
      {
        width: 1200,
        height: 630,
        url: "https://smoothui.dev/og-optimized.webp",
        alt: "SmoothUI Cover",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    title: "SmoothUI - Animated React Components for shadcn/ui",
    description:
      "Beautiful animated React components with smooth Motion animations. Drop-in shadcn/ui compatible, fully customizable. 50+ free components for modern UIs.",
    card: "summary_large_image",
    images: [
      {
        width: 1200,
        height: 630,
        url: "https://smoothui.dev/og-optimized.webp",
        alt: "SmoothUI Cover",
      },
    ],
    site: "@educalvolpz",
    creator: "@educalvolpz",
  },
  icons: {
    shortcut: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html
      className={`${inter.className} ${inter.variable} ${poppins.variable}`}
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <meta content="SmoothUI" name="apple-mobile-web-app-title" />
        <link
          href="/blog/rss.xml"
          rel="alternate"
          title="SmoothUI Blog"
          type="application/rss+xml"
        />
      </head>
      <body className="flex min-h-screen flex-col">
        <Script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: Schema.org JSON-LD structured data requires innerHTML
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(smoothUISchema),
          }}
          id="smoothui-schema"
          strategy="beforeInteractive"
          type="application/ld+json"
        />
        {enableUmami && (
          <Script
            data-website-id="065d3f91-4dc8-4b41-a95e-77369e47bd4e"
            src="https://cloud.umami.is/script.js"
            strategy="afterInteractive"
          />
        )}
        {enableVercelAnalytics && <Analytics />}
        <SpeedInsights />
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
