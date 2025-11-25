"use client";

import { SponsorCard } from "@docs/components/sponsor-card";
import { SponsorsEmptyState } from "@docs/components/sponsors-empty-state";
import {
  getExternalSponsors,
  getOwnProjects,
  getSupporterSponsors,
  getVelocitySponsors,
} from "@docs/lib/sponsors";

export function SponsorsPageContent() {
  const velocitySponsors = getVelocitySponsors();
  const supporterSponsors = getSupporterSponsors();
  const externalSponsors = getExternalSponsors();
  const ownProjects = getOwnProjects();

  return (
    <>
      {/* Velocity Sponsors (Top Tier) */}
      {velocitySponsors.length > 0 && (
        <div className="mb-12 space-y-6">
          <div>
            <h2 className="mb-2 font-semibold font-title text-2xl text-foreground">
              Velocity Sponsors
            </h2>
            <p className="text-foreground/70 text-sm">
              Our premium tier sponsors who make SmoothUI possible
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-1">
            {velocitySponsors.map((sponsor) => (
              <SponsorCard key={sponsor.name} sponsor={sponsor} />
            ))}
          </div>
        </div>
      )}

      {/* Supporter Sponsors */}
      {supporterSponsors.length > 0 && (
        <div className="mb-12 space-y-6">
          <div>
            <h2 className="mb-2 font-semibold font-title text-2xl text-foreground">
              Supporters
            </h2>
            <p className="text-foreground/70 text-sm">
              Thank you to our GitHub Sponsors
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {supporterSponsors.map((sponsor) => (
              <SponsorCard key={sponsor.name} sponsor={sponsor} />
            ))}
          </div>
        </div>
      )}

      {/* All Other Sponsors */}
      {externalSponsors.length === 0 &&
        velocitySponsors.length === 0 &&
        supporterSponsors.length === 0 && <SponsorsEmptyState />}

      {/* Own Projects Section */}
      {ownProjects.length > 0 && (
        <div className="mb-12 space-y-6">
          <h2 className="font-semibold font-title text-2xl text-foreground">
            Our Projects
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {ownProjects.map((sponsor) => (
              <SponsorCard key={sponsor.name} sponsor={sponsor} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
