"use client";

import AnimatedTabs from "@repo/smoothui/components/animated-tabs";
import { useState } from "react";

const HomeSvg = () => (
  <svg
    className="size-4"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const UserSvg = () => (
  <svg
    className="size-4"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const SettingsSvg = () => (
  <svg
    className="size-4"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const baseTabs = [
  { id: "home", label: "Home" },
  { id: "profile", label: "Profile" },
  { id: "settings", label: "Settings" },
];

const tabsWithIcons = [
  { id: "home", label: "Home", icon: <HomeSvg /> },
  { id: "profile", label: "Profile", icon: <UserSvg /> },
  { id: "settings", label: "Settings", icon: <SettingsSvg /> },
];

export default function AnimatedTabsDemo() {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-2">
        <p className="text-muted-foreground text-sm">Underline variant</p>
        <AnimatedTabs
          activeTab={activeTab}
          layoutId="underline-demo"
          onChange={setActiveTab}
          tabs={baseTabs}
          variant="underline"
        />
      </div>

      <div className="space-y-2">
        <p className="text-muted-foreground text-sm">Pill variant</p>
        <AnimatedTabs
          activeTab={activeTab}
          layoutId="pill-demo"
          onChange={setActiveTab}
          tabs={baseTabs}
          variant="pill"
        />
      </div>

      <div className="space-y-2">
        <p className="text-muted-foreground text-sm">Segment variant</p>
        <AnimatedTabs
          activeTab={activeTab}
          layoutId="segment-demo"
          onChange={setActiveTab}
          tabs={baseTabs}
          variant="segment"
        />
      </div>

      <div className="space-y-2">
        <p className="text-muted-foreground text-sm">With icons</p>
        <AnimatedTabs
          activeTab={activeTab}
          layoutId="icons-demo"
          onChange={setActiveTab}
          tabs={tabsWithIcons}
          variant="pill"
        />
      </div>
    </div>
  );
}
