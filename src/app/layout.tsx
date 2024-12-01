import type { Metadata } from "next"
import { Rubik } from "next/font/google"

import "./globals.css"

import { VercelToolbar } from "@vercel/toolbar/next"
import { ThemeProvider } from "next-themes"

import { Analytics } from "@/app/components/analytics"
import { FloatNav } from "@/app/components/floatNav"
import Footer from "@/app/components/footer"

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
        url: "https://www.smoothui.dev/og.jpg",
        width: 1920,
        height: 1080,
      },
    ],
    locale: "en-EN",
    type: "website",
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
  twitter: {
    title: "SmoothUI",
    card: "summary_large_image",
  },
  icons: {
    shortcut: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const shouldInjectToolbar = process.env.NODE_ENV === "development"
  return (
    <html lang="en">
      <body
        className={`bg-light1 antialiased transition dark:bg-dark1 ${rubik.className}`}
      >
        <ThemeProvider attribute="class">
          <FloatNav />
          {children}
          <Footer />
          <Analytics />
        </ThemeProvider>
        {shouldInjectToolbar && <VercelToolbar />}
      </body>
    </html>
  )
}
