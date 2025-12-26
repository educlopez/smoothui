import { RootProvider } from "fumadocs-ui/provider/next";
import type { Metadata } from "next";
import Script from "next/script";
import "./global.css";
import { inter, poppins } from "./fonts";
import { smoothUISchema } from "./utils/schema";

export const metadata: Metadata = {
  metadataBase: new URL("https://smoothui.dev"),
  alternates: {
    canonical: "/",
  },
  title: {
    default: "SmoothUI - React UI with TailwindCSS & Motion Animations",
    template: "%s | SmoothUI",
  },
  description:
    "Free React UI components built with TailwindCSS and Framer Motion. shadcn/ui compatible, customizable, responsive, dark mode-ready, and perfect for modern UIs.",
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
    title: "SmoothUI - React UI with TailwindCSS & Motion Animations",
    description:
      "Explore smooth animated UI components for React, powered by TailwindCSS and Framer Motion. shadcn/ui compatible components for modern web development.",
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
    title: "SmoothUI - React UI with TailwindCSS & Motion Animations",
    description:
      "Explore smooth animated UI components for React, powered by TailwindCSS and Framer Motion. shadcn/ui compatible components for modern web development.",
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
      </head>
      <body className="flex min-h-screen flex-col">
        <Script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(smoothUISchema),
          }}
          id="smoothui-schema"
          strategy="beforeInteractive"
          type="application/ld+json"
        />
        {process.env.NODE_ENV === "production" && (
          <Script
            data-website-id="065d3f91-4dc8-4b41-a95e-77369e47bd4e"
            src="https://cloud.umami.is/script.js"
            strategy="afterInteractive"
          />
        )}
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
