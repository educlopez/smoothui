"use client";

import ExpandableCards, {
  type Card,
} from "@repo/smoothui/components/expandable-cards";
import { getAllPeople, getAvatarUrl, getImageKitUrl } from "@smoothui/data";
import { useState } from "react";

const ExpandableCardsDemo = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const people = getAllPeople();

  const demoCards: Card[] = [
    {
      id: 1,
      title: "Summer Opening",
      image: getImageKitUrl("/images/summer-opening.webp", {
        width: 600,
        quality: 80,
        format: "auto",
      }),
      content:
        "Join us for the Summer Opening event, where we celebrate the start of a vibrant season filled with art and culture.",
      author: {
        name: people[0]?.name || "Eduardo Calvo",
        role: people[0]?.role || "CEO & Founder",
        image: getAvatarUrl(people[0]?.avatar || "", 96),
      },
    },
    {
      id: 2,
      title: "Fashion",
      image: getImageKitUrl("/images/fashion.webp", {
        width: 600,
        quality: 80,
        format: "auto",
      }),
      content:
        "Explore the latest trends in fashion at our exclusive showcase, featuring renowned designers and unique styles.",
      author: {
        name: people[1]?.name || "Sarah Chen",
        role: people[1]?.role || "Head of Design",
        image: getAvatarUrl(people[1]?.avatar || "", 96),
      },
    },
    {
      id: 3,
      title: "Gallery Art",
      image: getImageKitUrl("/images/galleryart.webp", {
        width: 600,
        quality: 80,
        format: "auto",
      }),
      content:
        "Immerse yourself in the world of art at our gallery, showcasing stunning pieces from emerging and established artists.",
      author: {
        name: people[2]?.name || "Marcus Johnson",
        role: people[2]?.role || "Lead Developer",
        image: getAvatarUrl(people[2]?.avatar || "", 96),
      },
    },
    {
      id: 4,
      title: "Dreams",
      image: getImageKitUrl("/images/dreams.webp", {
        width: 600,
        quality: 80,
        format: "auto",
      }),
      content:
        "Join us on a journey through dreams, exploring the subconscious and the art of dreaming.",
      author: {
        name: people[3]?.name || "Emily Rodriguez",
        role: people[3]?.role || "Product Manager",
        image: getAvatarUrl(people[3]?.avatar || "", 96),
      },
    },
  ];

  return (
    <ExpandableCards
      cards={demoCards}
      onSelect={setSelected}
      selectedCard={selected}
    />
  );
};

export default ExpandableCardsDemo;
