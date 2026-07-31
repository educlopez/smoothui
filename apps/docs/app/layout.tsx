import { SoundProvider } from "@docs/components/sound-provider";
import { COMPONENT_COUNT } from "@docs/lib/generated/counts";
import { KitProvider } from "@docs/lib/kit-context";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { RootProvider } from "fumadocs-ui/provider/next";
import type { Metadata } from "next";
import "./global.css";
import { inter, plusJakartaSans, poppins } from "./fonts";
import { smoothUISchema } from "./utils/schema";

const enableVercelAnalytics =
  process.env.NEXT_PUBLIC_ENABLE_VERCEL_ANALYTICS !== "false";

// The component count is the most persuasive number we have, so it comes from
// the generated counts rather than a figure typed once and left to rot — this
// description said "50+" while the real number was 130.
const SOCIAL_DESCRIPTION = `Beautiful animated React components with smooth Motion animations. Drop-in shadcn/ui compatible, fully customizable. ${COMPONENT_COUNT} free components for modern UIs.`;

export const metadata: Metadata = {
  description:
    "Animated React components with smooth Motion animations. Drop-in shadcn/ui compatible, fully customizable with Tailwind CSS.",
  icons: {
    shortcut: "/favicon.ico",
  },
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
  metadataBase: new URL("https://smoothui.dev"),
  openGraph: {
    description: SOCIAL_DESCRIPTION,
    images: [
      {
        alt: "SmoothUI Cover",
        height: 630,
        url: "https://smoothui.dev/og-optimized.webp",
        width: 1200,
      },
    ],
    locale: "en_US",
    siteName: "SmoothUI",
    title: "SmoothUI - Animated React Components for shadcn/ui",
    type: "website",
    url: "https://smoothui.dev",
  },
  robots: {
    follow: true,
    googleBot: {
      follow: true,
      index: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
    index: true,
  },
  title: {
    default:
      "SmoothUI - Animated React Components for shadcn/ui | Motion & Tailwind",
    template: "%s | SmoothUI",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@educalvolpz",
    description: SOCIAL_DESCRIPTION,
    images: [
      {
        alt: "SmoothUI Cover",
        height: 630,
        url: "https://smoothui.dev/og-optimized.webp",
        width: 1200,
      },
    ],
    site: "@educalvolpz",
    title: "SmoothUI - Animated React Components for shadcn/ui",
  },
};

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html
      className={`${inter.className} ${inter.variable} ${poppins.variable} ${plusJakartaSans.variable}`}
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
        {/* Advertise the LLM-facing catalogue. The files existed but nothing
            pointed at them, so an agent had to guess the convention. */}
        <link href="/llms.txt" rel="alternate" type="text/plain" />
        <link href="/llms-full.txt" rel="alternate" type="text/plain" />
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: Schema.org JSON-LD structured data
          dangerouslySetInnerHTML={{ __html: JSON.stringify(smoothUISchema) }}
          id="smoothui-schema"
          type="application/ld+json"
        />
      </head>
      <body className="flex min-h-screen flex-col">
        {enableVercelAnalytics && <Analytics />}
        {enableVercelAnalytics && <SpeedInsights />}
        <RootProvider>
          <SoundProvider>
            <KitProvider>{children}</KitProvider>
          </SoundProvider>
        </RootProvider>
      </body>
    </html>
  );
}
