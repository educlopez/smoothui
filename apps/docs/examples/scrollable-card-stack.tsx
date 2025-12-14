"use client";

import ScrollableCardStack from "@repo/smoothui/components/scrollable-card-stack";
import { getAllPeople, getAvatarUrl, getImageKitUrl } from "@smoothui/data";

export default function ScrollableCardStackDemo() {
  const people = getAllPeople();

  const cardData = [
    {
      id: "siriorb",
      name: people[0]?.name || "Edu Calvo",
      handle: "@educalvolpz",
      avatar: getImageKitUrl("/images/educalvolpz.jpg", {
        width: 80,
        height: 80,
        quality: 85,
        format: "auto",
      }), // Keep educlopez as requested
      image: getImageKitUrl(
        "https://ik.imagekit.io/16u211libb/smoothui/surf.webp?updatedAt=1764932280262",
        {
          width: 600,
          quality: 80,
          format: "auto",
        }
      ),
      href: "https://x.com/educalvolpz",
    },
    {
      id: "richpopover",
      name: people[1]?.name || "Sarah Chen",
      handle: `@${
        people[1]?.name?.toLowerCase().replace(/\s+/g, "") || "sarahchen"
      }`,
      avatar: getAvatarUrl(people[1]?.avatar || "", 40),
      image: getImageKitUrl(
        "https://ik.imagekit.io/16u211libb/smoothui/girl-nature.webp?updatedAt=1764932272804",
        {
          width: 600,
          quality: 80,
          format: "auto",
        }
      ),
      href: `https://x.com/${
        people[1]?.name?.toLowerCase().replace(/\s+/g, "") || "sarahchen"
      }`,
    },
    {
      id: "sparkbites",
      name: people[2]?.name || "Marcus Johnson",
      handle: `@${
        people[2]?.name?.toLowerCase().replace(/\s+/g, "") || "marcusj"
      }`,
      avatar: getAvatarUrl(people[2]?.avatar || "", 40),
      image: getImageKitUrl(
        "https://ik.imagekit.io/16u211libb/smoothui/dreams.webp?updatedAt=1764932263863",
        {
          width: 600,
          quality: 80,
          format: "auto",
        }
      ),
      href: `https://x.com/${
        people[2]?.name?.toLowerCase().replace(/\s+/g, "") || "marcusj"
      }`,
    },
    {
      id: "svgl",
      name: people[3]?.name || "Emily Rodriguez",
      handle: `@${
        people[3]?.name?.toLowerCase().replace(/\s+/g, "") || "emilyrodriguez"
      }`,
      avatar: getAvatarUrl(people[3]?.avatar || "", 40),
      image: getImageKitUrl(
        "https://ik.imagekit.io/16u211libb/smoothui/galleryart.webp?updatedAt=1764932265858",
        {
          width: 600,
          quality: 80,
          format: "auto",
        }
      ),
      href: `https://x.com/${
        people[3]?.name?.toLowerCase().replace(/\s+/g, "") || "emilyrodriguez"
      }`,
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
