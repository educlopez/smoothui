"use client";

import ScrollableCardStack from "@repo/smoothui/components/scrollable-card-stack";
import { getAllPeople, getAvatarUrl, getImageKitUrl } from "@smoothui/data";

export default function ScrollableCardStackDemo() {
  const people = getAllPeople();

  const cardData = [
    {
      avatar: getImageKitUrl(
        "https://ik.imagekit.io/16u211libb/avatar-educalvolpz.jpeg?updatedAt=1765524159631",
        {
          format: "auto",
          height: 80,
          quality: 85,
          width: 80,
        }
      ), // Keep educlopez as requested
      handle: "@educalvolpz",
      href: "https://x.com/educalvolpz",
      id: "siriorb",
      image: "/images/figma/bg-5.webp",
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
      image: getImageKitUrl(
        "https://ik.imagekit.io/16u211libb/smoothui/girl-nature.webp?updatedAt=1764932272804",
        {
          format: "auto",
          quality: 80,
          width: 600,
        }
      ),
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
      image: "/images/figma/bg-8.webp",
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
      image: "/images/figma/bg-1.webp",
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
