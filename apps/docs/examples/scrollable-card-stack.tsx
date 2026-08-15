"use client";

import ScrollableCardStack from "@repo/smoothui/components/scrollable-card-stack";
import { getAllPeople, getAvatarUrl, getImageKitUrl } from "@smoothui/data";
import { somePeople } from "@smoothui/data/people";
import { sceneById } from "@smoothui/data/scenes";

const CAST = somePeople(3, 5);

export default function ScrollableCardStackDemo() {
  const people = getAllPeople();

  const cardData = [
    {
      avatar: getImageKitUrl(`${CAST[0].avatar}`, {
        format: "auto",
        height: 80,
        quality: 85,
        width: 80,
      }), // Keep educlopez as requested
      handle: "@educalvolpz",
      href: "https://x.com/educalvolpz",
      id: "siriorb",
      image:
        "https://ik.imagekit.io/16u211libb/smoothui/scenes/cloud-meadow.webp?tr=w-600,h-380,f-auto",
      name: people[0]?.name || "Edu Calvo",
    },
    {
      avatar: getAvatarUrl(people[1]?.avatar || "", 40),
      handle: `@${
        people[1]?.name?.toLowerCase().replace(/\s+/g, "") || "sarahchen"
      }`,
      href: `https://x.com/${
        people[1]?.name?.toLowerCase().replace(/\s+/g, "") || "sarahchen"
      }`,
      id: "richpopover",
      image: getImageKitUrl(`${sceneById("cloud-meadow")?.src}`, {
        format: "auto",
        quality: 80,
        width: 600,
      }),
      name: people[1]?.name || "Sarah Chen",
    },
    {
      avatar: getAvatarUrl(people[2]?.avatar || "", 40),
      handle: `@${
        people[2]?.name?.toLowerCase().replace(/\s+/g, "") || "marcusj"
      }`,
      href: `https://x.com/${
        people[2]?.name?.toLowerCase().replace(/\s+/g, "") || "marcusj"
      }`,
      id: "sparkbites",
      image:
        "https://ik.imagekit.io/16u211libb/smoothui/scenes/lake-camp.webp?tr=w-600,h-380,f-auto",
      name: people[2]?.name || "Marcus Johnson",
    },
    {
      avatar: getAvatarUrl(people[3]?.avatar || "", 40),
      handle: `@${
        people[3]?.name?.toLowerCase().replace(/\s+/g, "") || "emilyrodriguez"
      }`,
      href: `https://x.com/${
        people[3]?.name?.toLowerCase().replace(/\s+/g, "") || "emilyrodriguez"
      }`,
      id: "svgl",
      image:
        "https://ik.imagekit.io/16u211libb/smoothui/scenes/cyan-aurora.webp?tr=w-600,h-380,f-auto",
      name: people[3]?.name || "Emily Rodriguez",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-md">
      <ScrollableCardStack
        cardHeight={200}
        className="mx-auto"
        items={cardData}
        perspective={1200}
        transitionDuration={200}
      />
    </div>
  );
}
