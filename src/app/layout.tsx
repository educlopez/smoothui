import type { Metadata } from "next"
import { Asap, Inter } from "next/font/google"
import { Toaster } from "sonner"

import { smoothUISchema } from "@/app/utils/schema"

import "./styles/globals.css"

import { VercelToolbar } from "@vercel/toolbar/next"
import { ThemeProvider } from "next-themes"

import { Analytics } from "@/components/analytics"
import { FloatNav } from "@/components/floatNav"

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
  metadataBase: new URL("https://smoothui.dev"),
  alternates: {
    canonical: "/",
  },
  title: {
    default: "SmoothUI - React UI with TailwindCSS & Motion Animations",
    template: "%s | SmoothUI",
  },
  description:
    "Free React UI components built with TailwindCSS and Framer Motion. Customizable, responsive, dark mode-ready, and perfect for modern UIs.",
  keywords: [
    "react components",
    "tailwindcss ui",
    "motion animations",
    "framer motion",
    "shadcn/ui",
    "react ui library",
    "customizable components",
    "animated ui components",
    "dark mode components",
  ],
  openGraph: {
    title: "SmoothUI - React UI with TailwindCSS & Motion Animations",
    description:
      "Explore smooth animated UI components for React, powered by TailwindCSS and Framer Motion.",
    url: "https://smoothui.dev",
    siteName: "SmoothUI",
    images: [
      {
        width: 1920,
        height: 1080,
        url: "https://smoothui.dev/og.jpg",
        alt: "SmoothUI Cover",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    title: "SmoothUI - React UI with TailwindCSS & Motion Animations",
    description:
      "Free React UI components styled with TailwindCSS and animated using Framer Motion.",
    images: [
      {
        width: 1920,
        height: 1080,
        url: "https://smoothui.dev/og.jpg",
        alt: "SmoothUI Cover",
      },
    ],
    card: "summary_large_image",
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
      </head>
      <body
        className={`bg-background antialiased transition-colors ${asap.variable} ${inter.className}`}
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
                  " bg-background rounded-lg p-4 border border-smooth-500  text-xs shadow-xs w-full",
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
