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

export default async function ComponentPageLayout({
  children,
}: ComponentPageLayout) {
  const cookieStore = await cookies()

  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"
  return (
    <div className={`bg-light-50 dark:bg-dark-50 antialiased transition`}>
      <SidebarProvider
        defaultOpen={defaultOpen}
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 64)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <Header />
          <div className="lg:grid lg:grid-cols-[1fr] 2xl:grid-cols-[1fr_248px]">
            <div className="grid-cols-[1fr_760px_1fr] px-4 pt-8 *:col-start-2 lg:grid lg:p-8">
              <div className="fixed inset-x-0 top-0 isolate z-3 h-[50px]">
                <div className="body-mask-b-0 absolute inset-0 backdrop-blur-[1px]"></div>
                <div className="body-mask-b-0 absolute inset-0 backdrop-blur-[2px]"></div>
                <div className="body-mask-b-0 absolute inset-0 backdrop-blur-[3px]"></div>
                <div className="body-mask-b-0 absolute inset-0 backdrop-blur-[6px]"></div>
                <div className="body-mask-b-0 absolute inset-0 backdrop-blur-[12px]"></div>
              </div>
              <div className="fixed inset-x-0 bottom-0 isolate z-3 h-[100px]">
                <div className="body-mask-t-0 absolute inset-0 backdrop-blur-[1px]"></div>
                <div className="body-mask-t-0 absolute inset-0 backdrop-blur-[2px]"></div>
                <div className="body-mask-t-0 absolute inset-0 backdrop-blur-[3px]"></div>
                <div className="body-mask-t-0 absolute inset-0 backdrop-blur-[6px]"></div>
                <div className="body-mask-t-0 absolute inset-0 backdrop-blur-[12px]"></div>
              </div>
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
