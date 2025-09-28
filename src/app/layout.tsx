import type { Metadata } from "next"
import { Asap, Inter } from "next/font/google"

import { smoothUISchema } from "@/app/utils/schema"

import "./styles/globals.css"

import Script from "next/script"
import { VercelToolbar } from "@vercel/toolbar/next"
import { ThemeProvider } from "next-themes"

import { FloatNav } from "@/components/floatnav/floatNav"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
})
const asap = Asap({
  subsets: ["latin"],
  variable: "--font-asap",
})

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
}

type ComponentPageLayout = {
  children: React.ReactNode
}

export default function RootLayout({ children }: ComponentPageLayout) {
  const shouldInjectToolbar = process.env.NODE_ENV === "development"
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(smoothUISchema) }}
        />
        {process.env.NODE_ENV === "production" && (
          <Script
            data-website-id="065d3f91-4dc8-4b41-a95e-77369e47bd4e"
            src="https://cloud.umami.is/script.js"
            strategy="afterInteractive"
          />
        )}
      </head>
      <body
        className={`bg-background antialiased ${asap.variable} ${inter.className}`}
      >
        <ThemeProvider attribute="class">
          <FloatNav />
          {children}
        </ThemeProvider>
        {shouldInjectToolbar && <VercelToolbar />}
      </body>
    </html>
  )
}
