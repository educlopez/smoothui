"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { X } from "lucide-react"

import { components, ComponentsProps } from "@/app/doc/data"

import BadgeBeta from "../badgeBeta"
import Logo from "./../../../../../public/icon.png"
import { MobileHeader } from "./mobileHeader"
import { SidebarButton } from "./sidebarButton"

export function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleOpenSidebar = () => {
    setIsSidebarOpen(true)
  }

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false)
  }

  return (
    <>
      <MobileHeader onOpenSidebar={handleOpenSidebar} />

      <aside
        className={`bg-light-100 dark:bg-dark-100 border-light-400 dark:border-dark-400 fixed inset-y-0 right-0 z-50 w-64 transform overflow-y-auto rounded-s-2xl border-l p-3 transition-transform duration-200 ease-in-out md:rounded-s-none md:p-6 lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-auto lg:flex-1 lg:transform-none lg:flex-col ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between pb-[14px] md:px-2">
          {!isSidebarOpen && (
            <div className="flex flex-row items-center gap-4">
              <Link href="/">
                <Image src={Logo} alt="Logo SmoothUI" width={36} />
              </Link>
              <BadgeBeta />
            </div>
          )}
          <button
            onClick={handleCloseSidebar}
            className="hover:bg-light-200 dark:hover:bg-dark-200 mt-2 rounded-lg lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={16} />
          </button>
        </div>

        <nav className="flex h-auto flex-col gap-4.5 overflow-y-auto px-0 pt-[20px] pb-10 md:px-2">
          <div className="flex flex-col gap-1">
            <span className="text-light-950 dark:text-dark-950 text-xs font-medium">
              Get Started
            </span>
            <div className="flex flex-col">
              <SidebarButton key="1" name="Information" slug="/doc" />
            </div>
          </div>
          <div className="flex h-[calc(100vh-330px)] flex-col gap-1 overflow-y-scroll">
            <span className="text-light-950 dark:text-dark-950 relative z-1 text-xs font-medium">
              Components
            </span>
            <div className="flex flex-col pb-8">
              {components
                .slice()
                .reverse()
                .map((component: ComponentsProps) => (
                  <SidebarButton
                    key={component.componentTitle}
                    name={component.componentTitle}
                    slug={`/doc/${component.slug}`}
                    isNew={component.isNew}
                    isUpdated={component.isUpdated}
                    onClick={handleCloseSidebar}
                  />
                ))}
            </div>
          </div>
          <div className="border-light-200 dark:border-dark-200 absolute bottom-3 left-0 mt-auto flex w-full flex-col gap-3 border-t px-3 pt-4">
            <a
              href="https://sparkbites.dev/"
              target="_blank"
              className="shadow-light dark:shadow-dark bg-light-50 dark:bg-dark-300 dark:hover:bg-light-50/10 hover:bg-dark-50/1 flex flex-col rounded-lg p-3 transition-colors"
            >
              <h3 className="mb-1 text-xs font-medium text-black dark:text-white">
                Sparkbites
              </h3>
              <p className="text-xs text-[#52525b] dark:text-[#a1a1aa]">
                A directory of websites to inspire your mind
              </p>
            </a>
            <a
              href="https://github.com/educlopez/smoothui.dev-issues/issues/new/"
              target="_blank"
              rel="noopener noreferrer"
              className="candy-btn group relative isolate flex w-full items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium"
            >
              <span>Report an Issue</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform group-hover:translate-x-0.5"
              >
                <path d="M7 7h10v10" />
                <path d="M7 17 17 7" />
              </svg>
            </a>
          </div>
        </nav>
      </aside>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-white/50 backdrop-blur-sm lg:hidden dark:bg-black/50"
          onClick={handleCloseSidebar}
        />
      )}
    </>
  )
}
