"use client";

import { SponsorLogo } from "@docs/components/sponsor-logo";
import { getExternalSponsors } from "@docs/lib/sponsors";
import { Heart } from "lucide-react";
import Link from "next/link";
import Divider from "./divider";

export function Sponsors() {
  const externalSponsors = getExternalSponsors();
  const hasSponsors = externalSponsors.length > 0;

  return (
    <section className="relative w-full bg-background px-8 py-24">
      <Divider />
      <div className="mx-auto max-w-7xl">
        {hasSponsors && (
          <div className="mb-12 text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-linear-to-br from-background via-background to-brand/10 px-4 py-2">
              <Heart className="h-4 w-4 fill-red-500 text-red-500" />
              <span className="font-medium text-foreground text-sm">
                Thank You to Our Sponsors
              </span>
            </div>
            <h2 className="text-balance text-center font-semibold font-title text-3xl text-foreground transition">
              Our Amazing Sponsors
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-foreground/70 text-lg">
              We&apos;re incredibly grateful to our sponsors who help make
              SmoothUI possible.
            </p>
          </div>
        )}

        {hasSponsors ? (
          <div className="flex flex-wrap items-center justify-center gap-8">
            {externalSponsors.map((sponsor) => (
              <Link
                aria-label={`Visit ${sponsor.name}`}
                className="group relative flex items-center justify-center transition-transform duration-200 ease-out hover:scale-110"
                href={sponsor.url}
                key={sponsor.name}
                rel="noopener noreferrer"
                target="_blank"
              >
                <div className="relative flex h-16 w-16 items-center justify-center text-foreground opacity-60 transition-opacity duration-200 ease-out group-hover:opacity-100 md:h-20 md:w-20">
                  <SponsorLogo
                    className="h-full w-full"
                    height={80}
                    sponsor={sponsor}
                    width={80}
                  />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-foreground/60 text-sm">
              Want to support SmoothUI?{" "}
              <Link
                className="text-foreground/80 underline underline-offset-2 transition-colors duration-200 ease-out hover:text-foreground"
                href="/docs/guides/sponsors"
              >
                Learn more
              </Link>
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
