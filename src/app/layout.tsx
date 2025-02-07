import type { Metadata } from "next"
import { Asap, Inter } from "next/font/google"
import { Toaster } from "sonner"

import "./globals.css"

import { VercelToolbar } from "@vercel/toolbar/next"
import { ThemeProvider } from "next-themes"

import { Analytics } from "@/app/components/analytics"
import { FloatNav } from "@/app/components/floatNav"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
})
const asap = Asap({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-asap",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://www.smoothui.dev"),
  title: {
    default: "SmoothUI",
    template: "%s | SmoothUI",
  },
  description: "A collection of awesome test components with smooth animations",
  keywords: [
    "components, Smooth animations, Awesome test components, motion, motion, Interactive components",
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
        className={`bg-light-50 dark:bg-dark-50 antialiased transition-colors ${asap.variable} ${inter.className}`}
      >
        <ThemeProvider attribute="class">
          <FloatNav />
          {children}
          <Toaster
            offset={{ bottom: "76px" }}
            mobileOffset={{ bottom: "76px" }}
            position="bottom-center"
            visibleToasts={1}
            toastOptions={{
              unstyled: true,
              classNames: {
                toast:
                  "dark:bg-dark-300 bg-light-50 rounded-lg p-4 border border-light-500 dark:border-dark-500 text-xs shadow-xs w-full",
              },
            }}
          />
          <Analytics />
        </ThemeProvider>
        {shouldInjectToolbar && <VercelToolbar />}
      </body>
    </html>
  )
}
