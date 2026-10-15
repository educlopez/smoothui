"use client";

import Kbd from "@repo/smoothui/components/kbd";

const FeaturesDemo = () => (
  <div className="flex items-center gap-2 p-8 text-muted-foreground text-sm">
    <span>Open command palette</span>
    <Kbd>⌘</Kbd>
    <Kbd>K</Kbd>
  </div>
);

const KeysDemo = () => (
  <div className="flex flex-wrap items-center gap-2 p-8">
    <Kbd>Esc</Kbd>
    <Kbd>↵</Kbd>
    <Kbd>⇧</Kbd>
    <Kbd>⌥</Kbd>
    <Kbd>⌃</Kbd>
  </div>
);

export const demoScenes = {
  Features: FeaturesDemo,
  Keys: KeysDemo,
};

export default function KbdDemo() {
  return <FeaturesDemo />;
}
