"use client";

import type { Event } from "@repo/smoothui/components/apple-invites";
import AppleInvites from "@repo/smoothui/components/apple-invites";
import { somePeople } from "@smoothui/data/people";

/** The component autoplays on its own; this is just a slightly brisker pace. */
const INTERVAL_MS = 2800;
const CARD_WIDTH = 140;

/** One host per event, drawn from the shared cast. */
const HOSTS = somePeople(4, 30);

const events: Event[] = [
  {
    badge: "Hosting",
    id: 1,
    image:
      "https://ik.imagekit.io/16u211libb/smoothui/scenes/cloud-meadow.webp?tr=w-400,h-640,f-auto",
    location: "Prospect Park",
    participants: [
      {
        avatar: `${HOSTS[0].avatar}?tr=w-72,h-72,f-auto`,
      },
    ],
    subtitle: "Sat, June 14 · 6:00 AM",
    title: "Sunrise Yoga",
  },
  {
    badge: "Going",
    id: 2,
    image:
      "https://ik.imagekit.io/16u211libb/smoothui/scenes/ember-drift-warm.webp?tr=w-400,h-640,f-auto",
    location: "Rue Léon",
    participants: [
      {
        avatar: `${HOSTS[1].avatar}?tr=w-72,h-72,f-auto`,
      },
    ],
    subtitle: "Fri, June 20 · 8:00 PM",
    title: "Supper Club",
  },
  {
    badge: "Going",
    id: 3,
    image:
      "https://ik.imagekit.io/16u211libb/smoothui/scenes/moonrise-valley.webp?tr=w-400,h-640,f-auto",
    location: "Praia do Amado",
    participants: [
      {
        avatar: `${HOSTS[2].avatar}?tr=w-72,h-72,f-auto`,
      },
    ],
    subtitle: "Sun, June 22 · 7:30 AM",
    title: "Dawn Patrol",
  },
  {
    badge: "Interested",
    id: 4,
    image:
      "https://ik.imagekit.io/16u211libb/smoothui/scenes/golden-ridge.webp?tr=w-400,h-640,f-auto",
    location: "Rooftop, Bldg 9",
    participants: [
      {
        avatar: `${HOSTS[3].avatar}?tr=w-72,h-72,f-auto`,
      },
    ],
    subtitle: "Thu, June 26 · 9:00 PM",
    title: "Open-Air Cinema",
  },
];

/**
 * Already self-driving — the invitation deck advances on its own interval, and
 * the neighbours lean in either side. The wrapper only supplies the fixed box
 * the component measures itself against.
 */
const AppleInvitesCanvasDemo = () => (
  <div className="h-[248px] w-[330px] overflow-hidden">
    <AppleInvites
      cardWidth={CARD_WIDTH}
      events={events}
      interval={INTERVAL_MS}
    />
  </div>
);

export default AppleInvitesCanvasDemo;
