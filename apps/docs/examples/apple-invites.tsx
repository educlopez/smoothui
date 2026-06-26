"use client";

import AppleInvites, {
  type Event,
} from "@repo/smoothui/components/apple-invites";
import { getAllPeople, getAvatarUrl } from "@smoothui/data";

const AVATAR_SIZE = 72;

const demoEvents: Event[] = [
  {
    id: 1,
    title: "Yoga",
    subtitle: "Sat, June 14, 6:00 AM",
    location: "Central Park",
    image: "/images/figma/bg-11.webp",
    badge: "Hosting",
    participants: [
      {
        avatar: getAvatarUrl(getAllPeople()[0]?.avatar || "", AVATAR_SIZE),
      },
    ],
  },
  {
    id: 2,
    title: "Tyler Turns 3!",
    subtitle: "Sat, June 14, 3:00 PM",
    location: "Central Park",
    image: "/images/figma/bg-9.webp",
    badge: "Going",
    participants: [
      {
        avatar: getAvatarUrl(getAllPeople()[1]?.avatar || "", AVATAR_SIZE),
      },
    ],
  },
  {
    id: 3,
    title: "Golf party",
    subtitle: "Sun, April 15, 9:00 AM",
    location: "Golf Park",
    image: "/images/figma/bg-5.webp",
    badge: "Going",
    participants: [
      {
        avatar: getAvatarUrl(getAllPeople()[2]?.avatar || "", AVATAR_SIZE),
      },
    ],
  },
  {
    id: 4,
    title: "Movie Night",
    subtitle: "Fri, June 20, 8:00 PM",
    location: "Cine Town",
    image: "/images/figma/bg-13.webp",
    badge: "Interested",
    participants: [
      {
        avatar: getAvatarUrl(getAllPeople()[3]?.avatar || "", AVATAR_SIZE),
      },
    ],
  },
];

const Example = () => (
  <div className="flex min-h-[500px] items-center justify-center">
    <AppleInvites
      cardWidth={{
        base: 100,
        sm: 140,
        md: 180,
        lg: 220,
        xl: 260,
      }}
      events={demoEvents}
    />
  </div>
);

export default Example;
