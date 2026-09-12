import { ThemeStudio } from "@docs/components/themes/theme-studio";
import { createMetadata } from "@docs/lib/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = createMetadata({
  alternates: {
    canonical: "/playground",
  },
  description:
    "Installable SmoothUI color themes for shadcn projects. Six palettes with light and dark mode, applied with a single CLI command.",
  openGraph: {
    url: "/playground",
  },
  title: "Playground",
});

export default function PlaygroundPage() {
  return <ThemeStudio />;
}
