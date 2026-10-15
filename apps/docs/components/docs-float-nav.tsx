"use client";

import { FloatNav } from "@docs/components/float-nav";
import { useSidebar } from "fumadocs-ui/components/sidebar/base";

export function DocsFloatNav() {
  const { open } = useSidebar();
  return <FloatNav hidden={open} />;
}
