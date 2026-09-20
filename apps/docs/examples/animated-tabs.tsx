"use client";

import AnimatedTabs from "@repo/smoothui/components/animated-tabs";
import { useState } from "react";

const tabs = [
  { id: "home", label: "Home" },
  { id: "profile", label: "Profile" },
  { id: "settings", label: "Settings" },
];

const UnderlineDemo = () => {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <AnimatedTabs
      activeTab={activeTab}
      layoutId="underline-demo"
      onChange={setActiveTab}
      tabs={tabs}
      variant="underline"
    />
  );
};

const PillDemo = () => {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <AnimatedTabs
      activeTab={activeTab}
      layoutId="pill-demo"
      onChange={setActiveTab}
      tabs={tabs}
      variant="pill"
    />
  );
};

const SegmentDemo = () => {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <AnimatedTabs
      activeTab={activeTab}
      layoutId="segment-demo"
      onChange={setActiveTab}
      tabs={tabs}
      variant="segment"
    />
  );
};

export const demoScenes = {
  Features: UnderlineDemo,
  Pill: PillDemo,
  Segment: SegmentDemo,
  Underline: UnderlineDemo,
};

export default function AnimatedTabsDemo() {
  return <UnderlineDemo />;
}
