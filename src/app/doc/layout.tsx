import type { Metadata } from "next"

import Header from "@/components/doc/header"
import { AppSidebar } from "@/components/doc/sidebar/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

import { DocLayoutClient } from "./DocLayoutClient"

export const metadata: Metadata = {
  title: {
    default: "Docs - TailwindCSS + Framer Motion Components for React",
    template: "%s | SmoothUI",
  },
  alternates: {
    canonical: `/doc`,
  },
  description:
    "Documentation for SmoothUI - learn how to use free React components styled with TailwindCSS and animated with Framer Motion.",
  keywords: [
    "react ui documentation",
    "tailwindcss components",
    "framer motion docs",
    "animated components react",
    "smoothui",
    "component usage guide",
    "interactive react ui",
  ],
  openGraph: {
    title: "SmoothUI Docs - TailwindCSS + Motion Components",
    description:
      "Explore the SmoothUI documentation. Learn how to implement customizable React components with TailwindCSS and Framer Motion.",
    url: "https://smoothui.dev/doc",
    siteName: "SmoothUI",
    images: [
      {
        width: 1200,
        height: 630,
        url: "https://smoothui.dev/og.jpg",
        alt: "Smoothui Cover",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    title: "SmoothUI Docs - TailwindCSS + Motion Components for React",
    description:
      "Official documentation for SmoothUI. Learn how to use beautifully animated React UI components built with TailwindCSS and Framer Motion.",
    images: [
      {
        width: 1200,
        height: 630,
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

export default function ComponentPageLayout({ children }: ComponentPageLayout) {
  return (
    <div className={`bg-background antialiased transition`}>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 64)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="floating" className="z-40" />
        <SidebarInset className="md:peer-data-[variant=inset]:shadow-none">
          <Header />
          <DocLayoutClient>{children}</DocLayoutClient>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
