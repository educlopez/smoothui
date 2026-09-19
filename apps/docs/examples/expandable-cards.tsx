"use client";

import {
  INVITE_HOSTS,
  INVITES,
  inviteImage,
} from "@docs/examples/shared/demo-fixtures";
import ExpandableCards, {
  type Card,
} from "@repo/smoothui/components/expandable-cards";
import { getAvatarUrl } from "@smoothui/data";
import { useState } from "react";

const EVENT_DESCRIPTIONS = [
  "Greet the morning with a relaxed outdoor yoga session, soft light and room to breathe. Bring a mat and meet the group at sunrise.",
  "Share a slow evening around a beautifully set table. Seasonal dishes, warm candlelight and conversation are on the menu.",
  "Meet by the water for an early surf session. Watch the first light cross the waves before heading out together.",
  "Settle into an open-air screening after sunset. Bring a light layer and enjoy a film beneath the night sky.",
];

const demoCards: Card[] = INVITES.map((invite, index) => ({
  author: {
    image: getAvatarUrl(INVITE_HOSTS[index].avatar, 96),
    name: INVITE_HOSTS[index].name,
    role: "Event host",
  },
  content: EVENT_DESCRIPTIONS[index],
  id: invite.id,
  image: inviteImage(invite.scene, 600, 800),
  title: invite.title,
}));

export default function ExpandableCardsDemo() {
  const [selected, setSelected] = useState<number | null>(null);
  return (
    <ExpandableCards
      cards={demoCards}
      onSelect={setSelected}
      selectedCard={selected}
    />
  );
}
