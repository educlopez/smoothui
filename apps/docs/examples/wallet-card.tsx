"use client";

import SmoothButton from "@repo/smoothui/components/smooth-button";
import type {
  WalletAccount,
  WalletMember,
} from "@repo/smoothui/components/wallet-card";
import WalletCard from "@repo/smoothui/components/wallet-card";
import { ArrowUpRight, Plus } from "lucide-react";
import { useState } from "react";

const accounts: WalletAccount[] = [
  {
    balance: 4820.42,
    currency: "USD",
    expiry: "08/29",
    gradient:
      "bg-[linear-gradient(145deg,oklch(0.5_0.13_268),oklch(0.25_0.08_268))]",
    holder: "Ada Fontaine",
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
    holder: "Ada Fontaine",
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
    holder: "Ada Fontaine",
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
    holder: "Ada Fontaine",
    id: "reserve",
    label: "Reserve",
    last4: "7731",
    network: "generic",
  },
];

const members: WalletMember[] = [
  { id: "m1", name: "Ada Fontaine" },
  { id: "m2", name: "Kenji Osei" },
  { id: "m3", name: "Priya Nair" },
  { id: "m4", name: "Lucas Meyer" },
  { id: "m5", name: "Sofia Reyes" },
  { id: "m6", name: "Tomas Ilic" },
];

export default function WalletCardDemo() {
  const [activeId, setActiveId] = useState("everyday");
  const [hidden, setHidden] = useState(false);

  return (
    <div className="flex w-full items-center justify-center gap-6 py-10 sm:gap-9">
      <WalletCard
        accounts={accounts}
        actions={
          <div className="flex gap-2">
            <SmoothButton
              prefix={<Plus />}
              shape="pill"
              size="sm"
              variant="outline"
            >
              Add
            </SmoothButton>
            <SmoothButton
              color="accent"
              shape="pill"
              size="sm"
              suffix={<ArrowUpRight />}
              variant="candy"
            >
              Send
            </SmoothButton>
          </div>
        }
        activeId={activeId}
        className="w-[280px] shrink-0 sm:w-[320px]"
        hidden={hidden}
        members={members}
        onActiveChange={setActiveId}
        onHiddenChange={setHidden}
      />

      <div className="hidden w-[178px] shrink-0 flex-col gap-1.5 sm:flex">
        <p className="pb-1 font-medium text-[11px] text-muted-foreground">
          Switch card
        </p>
        {accounts.map((account) => {
          const isActive = account.id === activeId;

          return (
            <button
              className={`ease flex cursor-pointer items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring ${
                isActive
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:bg-muted"
              }`}
              key={account.id}
              onClick={() => setActiveId(account.id)}
              type="button"
            >
              <span className="font-medium text-[12px]">{account.label}</span>
              <span className="text-[11px] tabular-nums">
                &bull;&bull;&bull;&bull; {account.last4}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
