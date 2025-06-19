"use client"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import {
  basicComponents,
  BasicComponentsProps,
} from "@/app/doc/data/basicComponents"
import { components, ComponentsProps } from "@/app/doc/data/components"

import { SidebarButtonClient } from "./sidebarButtonClient"

export default function SidebarLinkClient({}) {
  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel className="text-foreground font-bold">
          Get Started
        </SidebarGroupLabel>
        <SidebarMenuSub>
          <SidebarMenuSubItem key="1">
            <SidebarButtonClient key="1" name="Information" slug="/doc" />
          </SidebarMenuSubItem>
          <SidebarMenuSubItem key="2">
            <SidebarButtonClient
              key="2"
              name="Changelog"
              slug="/doc/changelog"
            />
          </SidebarMenuSubItem>
        </SidebarMenuSub>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupLabel className="text-foreground font-bold">
          Basic
        </SidebarGroupLabel>
        <SidebarMenuSub>
          {basicComponents
            .slice()
            .reverse()
            .map((component: BasicComponentsProps) => {
              const href = `/doc/basic/${component.slug}`
              return (
                <SidebarMenuSubItem
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
                </SidebarMenuSubItem>
              )
            })}
        </SidebarMenuSub>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupLabel className="text-foreground font-bold">
          Components
        </SidebarGroupLabel>
        <SidebarMenuSub>
          {components
            .slice()
            .reverse()
            .map((component: ComponentsProps) => {
              const href = `/doc/basic/${component.slug}`
              return (
                <SidebarMenuSubItem key={component.componentTitle}>
                  <SidebarMenuButton asChild tooltip={component.componentTitle}>
                    <SidebarButtonClient
                      key={component.componentTitle}
                      name={component.componentTitle}
                      slug={`/doc/${component.slug}`}
                      isNew={component.isNew}
                      isUpdated={component.isUpdated}
                    />
                  </SidebarMenuButton>
                </SidebarMenuSubItem>
              )
            })}
        </SidebarMenuSub>
      </SidebarGroup>
    </>
  )
}
