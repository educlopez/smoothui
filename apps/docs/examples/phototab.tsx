import { PHOTO_TABS, sceneSrc } from "@docs/examples/shared/demo-fixtures";
import Phototab, { type PhototabTab } from "@repo/smoothui/components/phototab";
import { Mountain, TreePine, Waves } from "lucide-react";

const ICONS = [<Mountain key="m" />, <Waves key="w" />, <TreePine key="t" />];

const tabs: PhototabTab[] = PHOTO_TABS.map((tab, index) => ({
  icon: ICONS[index],
  image: sceneSrc(tab.scene, "w-600,h-600"),
  name: tab.name,
}));

export default function PhototabDemo() {
  return (
    <div className="mx-auto max-w-md">
      {/* No defaultTab on purpose: the component falls back to the first
          tab's real name. A stale name here selects nothing and Radix then
          mounts no panel at all — the demo renders without any photo. */}
      <Phototab height={300} tabs={tabs} />
    </div>
  );
}
