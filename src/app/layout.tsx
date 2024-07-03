import type { Metadata } from "next"
import { Rubik } from "next/font/google"

import "./globals.css"

import { ThemeProvider } from "next-themes"

import { Analytics } from "@/app/components/analytics"
import { FloatNav } from "@/app/components/floatNav"
import Footer from "@/app/components/footer"

const rubik = Rubik({
  subsets: ["latin"],
})

export const metadata: Metadata = {
  metadataBase: new URL("https://smoothui.educalvolopez.com"),
  title: {
    default: "SmoothUI",
    template: "%s | SmoothUI",
  },
  description: "",
  keywords: [""],
  openGraph: {
    title: "SmoothUI",
    description: "",
    url: "https://smoothui.educalvolopez.com",
    siteName: "SmoothUI",
    images: [
      {
        url: "https://smoothui.educalvolopez.com/og.jpg",
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
    title: "smoothui",
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
      </body>
    </html>
  )
}
