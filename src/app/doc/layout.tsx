import { Metadata } from "next"
import { cookies } from "next/headers"

import { AppSidebar } from "@/components/doc/sidebar/app-sidebar"
import TableOfContent from "@/components/doc/tableOfContent"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

import Header from "../../components/doc/header"
import Footer from "../../components/footer"

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
        width: 1920,
        height: 1080,
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
        <AppSidebar variant="inset" />
        <SidebarInset className="border md:peer-data-[variant=inset]:shadow-none">
          <Header />
          <div className="lg:grid lg:grid-cols-[1fr] 2xl:grid-cols-[1fr_248px]">
            <div className="grid-cols-[1fr_760px_1fr] px-4 pt-8 *:col-start-2 lg:grid lg:p-8">
              {children}
              <Footer />
            </div>
            <TableOfContent />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
