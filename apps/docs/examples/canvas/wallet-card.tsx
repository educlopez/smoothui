"use client";

import type {
  WalletAccount,
  WalletMember,
} from "@repo/smoothui/components/wallet-card";
import WalletCard from "@repo/smoothui/components/wallet-card";
import { somePeople } from "@smoothui/data/people";
import { useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

/** The wallet belongs to one person; the rest are who it is shared with. */
const [OWNER, ...SHARED] = somePeople(7, 40);

/** How long a card stays on top before the stack reshuffles. */
const CYCLE_MS = 2400;

const accounts: WalletAccount[] = [
  {
    balance: 4820.42,
    currency: "USD",
    expiry: "08/29",
    gradient:
      "bg-[linear-gradient(145deg,oklch(0.5_0.13_268),oklch(0.25_0.08_268))]",
    holder: OWNER.name,
    id: "everyday",
    label: "Everyday",
    last4: "4242",
    network: "visa",
  },
  {
    balance: 12_300,
    currency: "USD",
    expiry: "02/31",
    gradient:
      "bg-[linear-gradient(145deg,oklch(0.52_0.11_158),oklch(0.26_0.06_158))]",
    holder: OWNER.name,
    id: "savings",
    label: "Savings",
    last4: "1190",
    network: "mastercard",
  },
  {
    balance: 962.75,
    currency: "EUR",
    expiry: "11/28",
    gradient:
      "bg-[linear-gradient(145deg,oklch(0.62_0.13_62),oklch(0.32_0.08_48))]",
    holder: OWNER.name,
    id: "travel",
    label: "Travel",
    last4: "0087",
    network: "amex",
  },
  {
    balance: 48_150.9,
    currency: "USD",
    expiry: "05/30",
    gradient:
      "bg-[linear-gradient(145deg,oklch(0.4_0.02_264),oklch(0.18_0.01_264))]",
    holder: OWNER.name,
    id: "reserve",
    label: "Reserve",
    last4: "7731",
    network: "generic",
  },
];

const members: WalletMember[] = SHARED.map((person) => ({
  avatar: `${person.avatar}?tr=w-64,h-64,f-auto`,
  id: person.id,
  name: person.name,
}));

/**
 * The stack dealing itself. `activeId` is driven on a timer, so the card that
 * is on top keeps changing and the 3D shuffle — the whole point of the
 * component — runs without anyone touching it.
 */
const WalletCardCanvasDemo = () => {
  const shouldReduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (shouldReduceMotion) {
      return;
    }
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % accounts.length);
    }, CYCLE_MS);
    return () => clearInterval(timer);
  }, [shouldReduceMotion]);

  return (
    <div className="w-[300px]">
      <WalletCard
        accounts={accounts}
        activeId={accounts[index]?.id}
        // The balance toggle is a control, and nothing on this canvas is
        // operable — the pointer belongs to the pan gesture.
        className="[&>button]:hidden"
        members={members}
      />
    </div>
  );
};

export default WalletCardCanvasDemo;
