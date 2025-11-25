"use client";

import { SponsorLogo } from "@docs/components/sponsor-logo";
import type { Sponsor, SponsorTier } from "@docs/lib/sponsors";
import { Zap } from "lucide-react";
import Link from "next/link";

type SponsorCardProps = {
  sponsor: Sponsor;
  tier?: SponsorTier;
};

export function SponsorCard({ sponsor, tier }: SponsorCardProps) {
  const isVelocity = tier === "velocity" || sponsor.tier === "velocity";
  const isSupporter = tier === "supporter" || sponsor.tier === "supporter";

  return (
    <Link
      className={`group not-prose relative flex flex-col gap-4 rounded-lg border p-6 transition-all duration-200 ease-out ${
        isVelocity
          ? "border-brand/30 bg-linear-to-br from-brand/20 via-brand/10 to-background hover:border-brand/50 hover:shadow-brand/10 hover:shadow-xl"
          : "border-border bg-linear-to-br from-background via-background to-brand/5 hover:border-brand/20 hover:shadow-brand/5 hover:shadow-lg"
      }`}
      href={sponsor.url}
      key={sponsor.name}
      rel="noopener noreferrer"
      target="_blank"
    >
      {/* Velocity Badge */}
      {isVelocity && (
        <div className="group/badge before:-z-10 after:-z-10 absolute top-4 right-4 isolate inline-flex h-[1.875rem] items-center justify-center gap-1 overflow-hidden rounded-full border-0 bg-brand px-3 font-medium text-white text-xs shadow-[0_1px_theme(colors.white/0.07)_inset,0_1px_3px_theme(colors.gray.900/0.2)] ring-brand transition duration-300 ease-[cubic-bezier(0.4,0.36,0,1)] before:pointer-events-none before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-b before:from-white/20 before:opacity-50 before:transition-opacity before:duration-300 before:ease-[cubic-bezier(0.4,0.36,0,1)] after:pointer-events-none after:absolute after:inset-0 after:rounded-full after:bg-gradient-to-b after:from-[46%] after:from-white/10 after:to-[54%] after:mix-blend-overlay hover:before:opacity-100">
          <Zap className="h-3 w-3 fill-white text-white" />
          <span className="font-semibold text-xs">Velocity</span>
        </div>
      )}

      {/* Supporter Badge */}
      {isSupporter && (
        <div className="group/badge before:-z-10 after:-z-10 absolute top-4 right-4 isolate inline-flex h-[1.875rem] items-center justify-center overflow-hidden rounded-full border-0 bg-brand px-3 font-medium text-white text-xs shadow-[0_1px_theme(colors.white/0.07)_inset,0_1px_3px_theme(colors.gray.900/0.2)] ring-brand transition duration-300 ease-[cubic-bezier(0.4,0.36,0,1)] before:pointer-events-none before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-b before:from-white/20 before:opacity-50 before:transition-opacity before:duration-300 before:ease-[cubic-bezier(0.4,0.36,0,1)] after:pointer-events-none after:absolute after:inset-0 after:rounded-full after:bg-gradient-to-b after:from-[46%] after:from-white/10 after:to-[54%] after:mix-blend-overlay hover:before:opacity-100">
          <span className="font-medium text-xs">Supporter</span>
        </div>
      )}

      <div className="flex items-start gap-4">
        <div
          className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-background text-foreground ${
            isVelocity ? "h-16 w-16" : "h-12 w-12"
          }`}
        >
          <SponsorLogo
            className={`transition-transform duration-200 ease-out group-hover:scale-110 ${
              isVelocity ? "h-12 w-12" : "h-8 w-8"
            }`}
            height={isVelocity ? 48 : 32}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (target?.parentElement) {
                target.parentElement.innerHTML = `<div class="flex h-full w-full items-center justify-center text-xs text-foreground/50">${sponsor.name.charAt(0)}</div>`;
              }
            }}
            sponsor={sponsor}
            width={isVelocity ? 48 : 32}
          />
        </div>
        <div className="flex-1 space-y-2">
          <h3
            className={`font-bold text-foreground transition-colors duration-200 ease-out ${
              isVelocity ? "text-xl" : "text-lg"
            }`}
          >
            {sponsor.name}
          </h3>
          <p
            className={`line-clamp-2 text-foreground/70 leading-relaxed ${
              isVelocity ? "text-base" : "text-sm"
            }`}
          >
            {sponsor.description}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-foreground/50 text-xs">
        <span>Visit website</span>
        <svg
          className="h-3 w-3 transition-transform duration-200 ease-out group-hover:translate-x-1"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <title>External link</title>
          <path
            d="M5 12h14M12 5l7 7-7 7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </Link>
  );
}
