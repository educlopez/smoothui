"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { X } from "lucide-react"

import { components, ComponentsProps } from "@/app/data"

import Logo from "./../../../../../public/images/icon.png"
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
        className={`bg-light2 dark:bg-dark2 border-light5 dark:border-dark5 fixed inset-y-0 right-0 z-50 w-64 transform overflow-y-auto rounded-s-2xl border-l p-3 transition-transform duration-200 ease-in-out md:rounded-s-none md:p-6 lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-auto lg:flex-1 lg:transform-none lg:flex-col ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between pb-[14px] md:px-6">
          {!isSidebarOpen && (
            <Link href="/">
              <Image src={Logo} alt="Logo SmoothUI" width={36} />
            </Link>
          )}
          <button
            onClick={handleCloseSidebar}
            className="hover:bg-light3 dark:hover:bg-dark3 mt-2 rounded-lg lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={16} />
          </button>
        </div>

        <nav className="flex h-auto flex-col gap-4.5 overflow-y-auto px-0 pt-[20px] pb-10 md:px-2">
          <div className="flex flex-col gap-1">
            <span className="text-light12 dark:text-dark12 text-xs font-medium">
              Get Started
            </span>
            <div className="flex flex-col">
              <SidebarButton key="1" name="Information" slug="/doc" />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-light12 dark:text-dark12 relative z-1 text-xs font-medium">
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
