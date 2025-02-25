import { Metadata } from "next"

import { Sidebar } from "@/app/doc/_components/sidebar/sidebar"
import TableOfContent from "@/app/doc/_components/tableOfContent"

import Footer from "../components/footer"

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
    <div className={`bg-light-50 dark:bg-dark-50 antialiased transition`}>
      <div className="lg:grid lg:grid-cols-[260px_1fr] 2xl:grid-cols-[260px_1fr_260px]">
        <Sidebar />
        <div className="grid-cols-[1fr_760px_1fr] px-4 pt-16 *:col-start-2 lg:grid lg:p-12 lg:pt-[92px]">
          <div className="fixed inset-x-0 top-0 isolate z-10 h-[50px]">
            <div className="body-mask-b-0 absolute inset-0 backdrop-blur-[1px]"></div>
            <div className="body-mask-b-0 absolute inset-0 backdrop-blur-[2px]"></div>
            <div className="body-mask-b-0 absolute inset-0 backdrop-blur-[3px]"></div>
            <div className="body-mask-b-0 absolute inset-0 backdrop-blur-[6px]"></div>
            <div className="body-mask-b-0 absolute inset-0 backdrop-blur-[12px]"></div>
          </div>
          <div className="fixed inset-x-0 bottom-0 isolate z-10 h-[100px]">
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
    </div>
  )
}
