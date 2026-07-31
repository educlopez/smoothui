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
      author: {
        image: getAvatarUrl(people[0]?.avatar || "", 96),
        name: people[0]?.name || "Eduardo Calvo",
        role: people[0]?.role || "CEO & Founder",
      },
      content:
        "Join us for the Summer Opening event, where we celebrate the start of a vibrant season filled with art and culture.",
      id: 1,
      image: getImageKitUrl("/images/summer-opening.webp", {
        format: "auto",
        quality: 80,
        width: 600,
      }),
      title: "Summer Opening",
    },
    {
      author: {
        image: getAvatarUrl(people[1]?.avatar || "", 96),
        name: people[1]?.name || "Sarah Chen",
        role: people[1]?.role || "Head of Design",
      },
      content:
        "Explore the latest trends in fashion at our exclusive showcase, featuring renowned designers and unique styles.",
      id: 2,
      image: getImageKitUrl("/images/fashion.webp", {
        format: "auto",
        quality: 80,
        width: 600,
      }),
      title: "Fashion",
    },
    {
      author: {
        image: getAvatarUrl(people[2]?.avatar || "", 96),
        name: people[2]?.name || "Marcus Johnson",
        role: people[2]?.role || "Lead Developer",
      },
      content:
        "Immerse yourself in the world of art at our gallery, showcasing stunning pieces from emerging and established artists.",
      id: 3,
      image: getImageKitUrl("/images/galleryart.webp", {
        format: "auto",
        quality: 80,
        width: 600,
      }),
      title: "Gallery Art",
    },
    {
      author: {
        image: getAvatarUrl(people[3]?.avatar || "", 96),
        name: people[3]?.name || "Emily Rodriguez",
        role: people[3]?.role || "Product Manager",
      },
      content:
        "Join us on a journey through dreams, exploring the subconscious and the art of dreaming.",
      id: 4,
      image: getImageKitUrl("/images/dreams.webp", {
        format: "auto",
        quality: 80,
        width: 600,
      }),
      title: "Dreams",
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
