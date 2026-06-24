import { ThemeStudio } from "@docs/components/themes/theme-studio";
import { createMetadata } from "@docs/lib/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = createMetadata({
  title: "Themes — SmoothUI",
  description:
    "Installable SmoothUI color themes for shadcn projects. Six palettes with light and dark mode, applied with a single CLI command.",
  alternates: {
    canonical: "/themes",
  },
  openGraph: {
    url: "/themes",
  },
});

export default function ThemesPage() {
  return <ThemeStudio />;
}
