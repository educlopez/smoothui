"use client";

import Sidebar, {
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@repo/smoothui/components/sidebar";
import {
  FolderIcon,
  LayoutDashboardIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-react";

const DemoChrome = () => {
  const { collapsed } = useSidebar();

  return (
    <div className="flex h-72 w-full max-w-xl overflow-hidden rounded-lg border">
      <Sidebar>
        <SidebarHeader>
          <SidebarLabel className="font-medium text-sm">SmoothUI</SidebarLabel>
          <SidebarTrigger className={collapsed ? undefined : "ml-auto"} />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton active icon={<LayoutDashboardIcon />}>
                Overview
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton icon={<FolderIcon />}>
                Projects
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton icon={<SettingsIcon />}>
                Settings
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenuButton icon={<UserIcon />}>Account</SidebarMenuButton>
        </SidebarFooter>
      </Sidebar>
      <div className="flex flex-1 items-center justify-center bg-foreground/[0.02] p-6 text-muted-foreground text-sm">
        Main content
      </div>
    </div>
  );
};

const FeaturesDemo = () => (
  <SidebarProvider>
    <DemoChrome />
  </SidebarProvider>
);

export const demoScenes = {
  Features: FeaturesDemo,
};

export default function SidebarDemo() {
  return <FeaturesDemo />;
}
