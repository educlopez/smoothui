import { Metadata } from "next"
import { cookies } from "next/headers"

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/app/doc/_components/sidebar/app-sidebar"
import TableOfContent from "@/app/doc/_components/tableOfContent"

import Footer from "../components/footer"
import Header from "./_components/header"

export const metadata: Metadata = {
  title: {
    default: "SmoothUI",
    template: "%s | SmoothUI",
  },
  description: "A collection of awesome test components with smooth animations",
  keywords: [
    "components, Smooth animations, Awesome test components, motion, motion, Interactive components",
  ],
  openGraph: {
    images: [
      {
        width: 1920,
        height: 1080,
        url: "https://smoothui.dev/og.jpg",
        alt: "Smoothui Cover",
      },
    ],
    locale: "en",
    siteName: "SmoothUI",
    title: "SmoothUI",
    description:
      "A collection of awesome test components with smooth animations",
    type: "website",
    url: "https://smoothui.dev/doc",
  },
  twitter: {
    images: [
      {
        width: 1920,
        height: 1080,
        url: "https://smoothui.dev/og.jpg",
        alt: "Smoothui Cover",
      },
    ],
    card: "summary_large_image",
    title: "Smoothui",
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
        <SidebarInset className="overflow-hidden border md:peer-data-[variant=inset]:shadow-none">
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
