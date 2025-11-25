"use client";

import {
  getSidebarSponsors,
  SPONSOR_ROTATION_INTERVAL,
  type Sponsor,
} from "@docs/lib/sponsors";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BgLines } from "./landing/bg-lines";
import { SponsorLogo } from "./sponsor-logo";

export function NavSponsorCard() {
  const sidebarSponsors = getSidebarSponsors();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Auto-rotate sponsors if there are multiple
  useEffect(() => {
    if (sidebarSponsors.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      setIsTransitioning(true);
      // Wait for fade-out animation before changing index
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % sidebarSponsors.length);
        // Small delay before fading in to ensure smooth transition
        setTimeout(() => {
          setIsTransitioning(false);
        }, 50);
      }, 200); // Half of transition duration (300ms / 2 + buffer)
    }, SPONSOR_ROTATION_INTERVAL);

    return () => clearInterval(interval);
  }, [sidebarSponsors.length]);

  const currentSponsor: Sponsor = sidebarSponsors[currentIndex];

  if (sidebarSponsors.length === 0) {
    return null;
  }

  return (
    <Link
      aria-label={`Visit ${currentSponsor.name}`}
      className="frame-box group relative flex items-center gap-2 rounded-md border bg-linear-to-br from-background via-background to-brand/10 p-2 text-xs transition-colors hover:border-brand/20"
      href={currentSponsor.url}
      rel="noopener noreferrer"
      target="_blank"
    >
      <BgLines />
      <div className="relative h-5 w-5 shrink-0 text-foreground">
        <SponsorLogo
          className="transition-opacity duration-300 ease-out"
          height={20}
          onError={(e) => {
            // Fallback to a simple placeholder if image fails to load
            const target = e.target as HTMLImageElement;
            if (target) {
              target.style.display = "none";
            }
          }}
          sponsor={currentSponsor}
          style={{
            opacity: isTransitioning ? 0 : 1,
          }}
          width={20}
        />
      </div>
      <div className="flex max-w-[200px] flex-col items-start justify-start overflow-hidden text-left">
        <p
          className="font-bold text-foreground transition-opacity duration-300 ease-out"
          style={{
            opacity: isTransitioning ? 0 : 1,
            transform: isTransitioning ? "translateY(-4px)" : "translateY(0)",
          }}
        >
          {currentSponsor.name}
        </p>
        <p
          className="line-clamp-2 text-primary-foreground text-xs transition-opacity duration-300 ease-out"
          style={{
            opacity: isTransitioning ? 0 : 1,
            transform: isTransitioning ? "translateY(-4px)" : "translateY(0)",
          }}
        >
          {currentSponsor.description}
        </p>
      </div>
      {sidebarSponsors.length > 1 && (
        <div className="absolute right-1 bottom-1 flex gap-0.5">
          {sidebarSponsors.map((sponsor: Sponsor, index: number) => (
            <div
              className="h-0.5 rounded-full bg-foreground/30 transition-all duration-300 ease-out"
              key={sponsor.name}
              style={{
                opacity: index === currentIndex ? 1 : 0.3,
                width: index === currentIndex ? "6px" : "2px",
              }}
            />
          ))}
        </div>
      )}
    </Link>
  );
}
