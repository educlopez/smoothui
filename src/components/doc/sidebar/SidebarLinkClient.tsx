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
import { basicComponents } from "@/app/doc/data/basicComponents"
import { components } from "@/app/doc/data/components"
import { textComponents } from "@/app/doc/data/textComponentes"
import { ComponentsProps } from "@/app/doc/data/typeComponent"

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
            .map((component: ComponentsProps) => {
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
          Text
        </SidebarGroupLabel>
        <SidebarMenuSub>
          {textComponents
            .slice()
            .reverse()
            .map((component: ComponentsProps) => {
              const href = `/doc/text/${component.slug}`
              return (
                <SidebarMenuSubItem
                  key={component.componentTitle}
                  className="group"
                >
                  <SidebarMenuButton asChild tooltip={component.componentTitle}>
                    <SidebarButtonClient
                      key={component.componentTitle}
                      name={component.componentTitle}
                      slug={`/doc/text/${component.slug}`}
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
              const href = `/doc/components/${component.slug}`
              return (
                <SidebarMenuSubItem key={component.componentTitle}>
                  <SidebarMenuButton asChild tooltip={component.componentTitle}>
                    <SidebarButtonClient
                      key={component.componentTitle}
                      name={component.componentTitle}
                      slug={`/doc/components/${component.slug}`}
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
