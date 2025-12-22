"use client";

import AppleInvites, {
  type Event,
} from "@repo/smoothui/components/apple-invites";
import { getAllPeople, getAvatarUrl, getImageKitUrl } from "@smoothui/data";

const AVATAR_SIZE = 72;

const demoEvents: Event[] = [
  {
    id: 1,
    title: "Yoga",
    subtitle: "Sat, June 14, 6:00 AM",
    location: "Central Park",
    image: getImageKitUrl("/images/yogaday.webp", {
      width: 400,
      height: 500,
      quality: 80,
      format: "auto",
    }),
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
    image: getImageKitUrl("/images/park.webp", {
      width: 400,
      height: 500,
      quality: 80,
      format: "auto",
    }),
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
    image: getImageKitUrl("/images/golf.webp", {
      width: 400,
      height: 500,
      quality: 80,
      format: "auto",
    }),
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
    image: getImageKitUrl("/images/movie.webp", {
      width: 400,
      height: 500,
      quality: 80,
      format: "auto",
    }),
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
