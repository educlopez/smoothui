import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import SparkbitesIcon from "@/assets/images/sparkbites.png"

import { Button } from "@/components/button"
import Logo from "@/components/logo"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import SidebarLinkClient from "./SidebarLinkClient"

export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5 [&>h1]:text-2xl [&>svg]:size-auto [&>svg]:h-6"
            >
              <Link href="/" title="home" aria-label="Home">
                <Logo />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarLinkClient />
      </SidebarContent>
      <SidebarFooter>
        <Link
          href="https://sparkbites.dev/"
          target="_blank"
          className="bg-primary hover:bg-background flex items-center gap-2 rounded-md border p-2 text-xs transition-colors"
        >
          <Image
            src={SparkbitesIcon.src}
            alt="Sparkbites"
            width={20}
            height={20}
            className="h-5 w-5"
          />
          <div className="flex max-w-[200px] flex-col items-start justify-start text-left">
            <p className="text-foreground font-bold">Sparkbites</p>
            <p className="text-primary-foreground text-xs">
              Inspiration directory for your next project
            </p>
          </div>
        </Link>
        <Button asChild variant="candy" size="sm">
          <Link
            href="https://github.com/educlopez/smoothui/issues/new/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>Report an Issue</span>
          </Link>
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
