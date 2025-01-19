import type { Metadata } from "next"
import { Rubik } from "next/font/google"

import "./globals.css"

import { VercelToolbar } from "@vercel/toolbar/next"
import { ThemeProvider } from "next-themes"

import { Analytics } from "@/app/components/analytics"
import { FloatNav } from "@/app/components/floatNav"

const rubik = Rubik({
  subsets: ["latin"],
})

export const metadata: Metadata = {
  metadataBase: new URL("https://www.smoothui.dev"),
  title: {
    default: "SmoothUI",
    template: "%s | SmoothUI",
  },
  description: "A collection of awesome test components with smooth animations",
  keywords: [
    "components, Smooth animations, Awesome test components, motion, framer-motion, Interactive components",
  ],
  openGraph: {
    title: "SmoothUI",
    description:
      "A collection of awesome test components with smooth animations",
    url: "https://www.smoothui.dev",
    siteName: "SmoothUI",
    images: [
      {
        width: 1920,
        height: 1080,
        url: "https://smoothui.dev/og.jpg",
        alt: "SmoothUI Cover",
      },
    ],
    locale: "en",
    type: "website",
  },
  twitter: {
    title: "SmoothUI",
    images: [
      {
        width: 1920,
        height: 1080,
        url: "https://smoothui.dev/og.jpg",
        alt: "SmoothUI Cover",
      },
    ],
    card: "summary_large_image",
    description:
      "A collection of awesome test components with smooth animations",
    site: "@educalvolpz",
    creator: "Eduardo Calvo",
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
      <body
        className={`bg-light1 antialiased transition dark:bg-dark1 ${rubik.className}`}
      >
        <ThemeProvider attribute="class">
          <FloatNav />
          {children}
          <Analytics />
        </ThemeProvider>
        {shouldInjectToolbar && <VercelToolbar />}
      </body>
    </html>
  )
}
