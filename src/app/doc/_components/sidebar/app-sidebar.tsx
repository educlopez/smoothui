import * as React from "react"
import Image from "next/image"
import Link from "next/link"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import Logo from "./../../../../../public/icon.png"
import SidebarLinkClient from "./SidebarLinkClient"

export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      collapsible="offcanvas"
      className="bg-light-100 dark:bg-dark-100 border-light-400 dark:border-dark-400"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="h-12 data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/" title="home" aria-label="Home">
                <Image
                  src={Logo}
                  alt="Logo SmoothUI"
                  className="h-full w-auto"
                />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarLinkClient />
      </SidebarContent>
      <SidebarFooter>
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
          href="https://github.com/educlopez/smoothui/issues/new/"
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
      </SidebarFooter>
    </Sidebar>
  )
}
