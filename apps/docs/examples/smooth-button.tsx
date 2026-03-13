"use client";

import SmoothButton from "@repo/smoothui/components/smooth-button";
import { ExternalLink, Heart, Trash2 } from "lucide-react";

export default function SmoothButtonDemo() {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <SmoothButton variant="default">Default</SmoothButton>
        <SmoothButton variant="candy">
          Candy <ExternalLink className="h-4 w-4" />
        </SmoothButton>
        <SmoothButton variant="destructive">
          <Trash2 className="h-4 w-4" /> Delete
        </SmoothButton>
        <SmoothButton variant="outline">Outline</SmoothButton>
        <SmoothButton variant="secondary">Secondary</SmoothButton>
        <SmoothButton variant="ghost">Ghost</SmoothButton>
        <SmoothButton variant="link">Link</SmoothButton>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <SmoothButton size="sm" variant="candy">
          Small
        </SmoothButton>
        <SmoothButton size="default" variant="candy">
          Default
        </SmoothButton>
        <SmoothButton size="lg" variant="candy">
          Large
        </SmoothButton>
        <SmoothButton size="icon" variant="candy">
          <Heart className="h-4 w-4" />
        </SmoothButton>
      </div>
    </div>
  );
}
