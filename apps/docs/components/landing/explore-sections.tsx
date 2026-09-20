"use client";

import { ExploreSectionCards } from "@docs/components/illustrations/explore-section-cards";
import Divider from "@docs/components/landing/divider";
import { SectionHeader } from "@docs/components/landing/section-header";

/**
 * Trial strip of Sapira-style section drawings on the SmoothUI home.
 * Same language as the docs overview cards: drawings, not screenshots.
 */
export function ExploreSections() {
  return (
    <section className="@container relative bg-background px-8 py-24 transition">
      <Divider />
      <SectionHeader
        description="Drawings of what each area holds — the same illustration language we use in the theme settings."
        title={
          <>
            Browse Smooth<span className="text-brand">UI</span>
          </>
        }
      />
      <div className="mt-12">
        <ExploreSectionCards />
      </div>
    </section>
  );
}
