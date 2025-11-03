"use client";

import { TooltipProvider } from "@repo/shadcn-ui/components/ui/tooltip";
import { RootProvider } from "fumadocs-ui/provider/base";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";

export function Provider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <RootProvider>
        <TooltipProvider>{children}</TooltipProvider>
      </RootProvider>
    </ThemeProvider>
  );
}
