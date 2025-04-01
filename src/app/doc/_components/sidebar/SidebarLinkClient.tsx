"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Info } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  basicComponents,
  BasicComponentsProps,
} from "@/app/doc/data/basicComponents"
import { components, ComponentsProps } from "@/app/doc/data/components"

import { SidebarButtonClient } from "./sidebarButtonClient"

export default function SidebarLinkClient({}) {
  const pathname = usePathname()

  const isActive = (href: string) => pathname === href

  const { isMobile, setOpenMobile } = useSidebar()
  const handleClick = () => {
    if (isMobile) {
      setOpenMobile(false)
    }
  }
  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>Get Started</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarButtonClient key="1" name="Information" slug="/doc" />
          <SidebarButtonClient key="2" name="Changelog" slug="/doc/changelog" />
        </SidebarMenu>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupLabel>Basic</SidebarGroupLabel>
        <SidebarMenu>
          {basicComponents
            .slice()
            .reverse()
            .map((component: BasicComponentsProps) => {
              const href = `/doc/basic/${component.slug}`
              return (
                <SidebarMenuItem
                  key={component.componentTitle}
                  className="group"
                >
                  <SidebarMenuButton asChild tooltip={component.componentTitle}>
                    <SidebarButtonClient
                      key={component.componentTitle}
                      name={component.componentTitle}
                      slug={`/doc/basic/${component.slug}`}
                      isNew={component.isNew}
                      isUpdated={component.isUpdated}
                    />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
        </SidebarMenu>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupLabel>Components</SidebarGroupLabel>
        <SidebarMenu>
          {components
            .slice()
            .reverse()
            .map((component: ComponentsProps) => {
              const href = `/doc/basic/${component.slug}`
              return (
                <SidebarMenuItem key={component.componentTitle}>
                  <SidebarMenuButton asChild tooltip={component.componentTitle}>
                    <SidebarButtonClient
                      key={component.componentTitle}
                      name={component.componentTitle}
                      slug={`/doc/${component.slug}`}
                      isNew={component.isNew}
                      isUpdated={component.isUpdated}
                    />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
        </SidebarMenu>
      </SidebarGroup>
    </>
  )
}
