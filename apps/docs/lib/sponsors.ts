export type SponsorTier = "supporter" | "velocity" | "own";

export interface Sponsor {
  name: string;
  url: string;
  logo: string;
  description: string;
  isOwnProject?: boolean;
  enabled?: boolean; // Set to false to temporarily disable a sponsor
  tier?: SponsorTier; // "supporter" (GitHub $20), "velocity" (top tier), or "own" (your projects)
}

// Define sponsors - order doesn't matter here, we'll sort them properly
// Set enabled: false to disable a sponsor (useful for testing empty states)
// Tiers:
//   - "supporter": Basic GitHub Sponsors ($20/month)
//   - "velocity": Top tier sponsors (premium tier)
//   - "own": Your own projects (like Sparkbites)
// {
//   name: "Shadcnblocks.com", url;
//   : "https://shadcnblocks.com/",
//     logo: "/shadcnblocks.svg",
//     description:
//       "Explore a premium collection of 929 blocks and 1148 component patterns, custom-built for shadcn/ui, Tailwind, and React. Designed and developed by our team these high-quality, interactive, and fully responsive components are ready to copy and paste seamlessly into your project or install via the Shadcn CLI.",
//     tier: "velocity",
//     enabled: true,
// }

const sponsorsList: Sponsor[] = [
  {
    name: "Sparkbites",
    url: "https://sparkbites.dev/",
    logo: "/sparkbites.png",
    description: "Inspiration directory for your next project",
    isOwnProject: true,
    tier: "own", // Own project
    enabled: true, // Set to false to disable
  },
];

// Rotation interval in milliseconds (default: 5 seconds)
export const SPONSOR_ROTATION_INTERVAL = 5000;

// Get sponsors in the correct order:
// 1. Velocity (top tier) sponsors first (exclude own projects)
// 2. Supporter tier sponsors second (exclude own projects)
// 3. Own projects last
// Only returns enabled sponsors (enabled is true by default if not specified)
export const getAllSponsors = (): Sponsor[] => {
  const enabledSponsors = sponsorsList.filter(
    (sponsor) => sponsor.enabled !== false
  );
  const velocity = enabledSponsors.filter(
    (sponsor) => sponsor.tier === "velocity"
  );
  const supporter = enabledSponsors.filter(
    (sponsor) => sponsor.tier === "supporter"
  );
  const ownProjects = enabledSponsors.filter(
    (sponsor) => sponsor.tier === "own"
  );
  return [...velocity, ...supporter, ...ownProjects];
};

// Get external sponsors for home page (Velocity + Supporter tiers, exclude only tier "own")
export const getExternalSponsors = (): Sponsor[] => {
  const enabledSponsors = sponsorsList.filter(
    (sponsor) => sponsor.enabled !== false
  );
  return enabledSponsors.filter(
    (sponsor) => sponsor.tier === "velocity" || sponsor.tier === "supporter"
  );
};

// Get velocity (top tier) sponsors
export const getVelocitySponsors = (): Sponsor[] => {
  const enabledSponsors = sponsorsList.filter(
    (sponsor) => sponsor.enabled !== false
  );
  return enabledSponsors.filter((sponsor) => sponsor.tier === "velocity");
};

// Get supporter tier sponsors
export const getSupporterSponsors = (): Sponsor[] => {
  const enabledSponsors = sponsorsList.filter(
    (sponsor) => sponsor.enabled !== false
  );
  return enabledSponsors.filter((sponsor) => sponsor.tier === "supporter");
};

// Get own projects (only tier === "own")
export const getOwnProjects = (): Sponsor[] => {
  const enabledSponsors = sponsorsList.filter(
    (sponsor) => sponsor.enabled !== false
  );
  return enabledSponsors.filter((sponsor) => sponsor.tier === "own");
};

// Get sponsors for sidebar (Velocity + Own projects, excluding Supporter)
export const getSidebarSponsors = (): Sponsor[] => {
  const enabledSponsors = sponsorsList.filter(
    (sponsor) => sponsor.enabled !== false
  );
  const velocity = enabledSponsors.filter(
    (sponsor) => sponsor.tier === "velocity"
  );
  const ownProjects = getOwnProjects();
  return [...velocity, ...ownProjects];
};

// Export sponsors array for backwards compatibility (sorted)
export const sponsors: Sponsor[] = getAllSponsors();
