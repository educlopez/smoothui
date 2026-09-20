"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import Select from "@repo/smoothui/components/select";

/**
 * Headings that drive the demo via scroll but should not become picker options.
 * Features is the default scene; overview/meta sections stay in the prose.
 */
const HIDDEN_CHIP_SCENES = new Set([
  "default",
  "Features",
  "Variants",
  "Modes",
  "Examples",
  "Usage",
  "Installation",
  "Props",
  "Accessibility",
]);

export const chipScenesOf = (scenes: string[]): string[] =>
  scenes.filter((scene) => !HIDDEN_CHIP_SCENES.has(scene));

export interface SceneTabsProps {
  activeScene: string | null;
  className?: string;
  onSelect: (scene: string) => void;
  scenes: string[];
}

/**
 * Scene picker for the sticky preview. SmoothUI Select at the bottom-right —
 * clear of the float-nav; the library Select flips open above when needed.
 */
export const SceneTabs = ({
  scenes,
  activeScene,
  onSelect,
  className,
}: SceneTabsProps) => {
  const chips = chipScenesOf(scenes);
  if (chips.length < 2) {
    return null;
  }

  const active = activeScene && chips.includes(activeScene) ? activeScene : "";

  return (
    <div className={cn("absolute right-3 bottom-3 z-20 w-36", className)}>
      <Select
        aria-label="Examples"
        className="w-full border-border/60 bg-background/85 shadow-black/5 shadow-sm backdrop-blur-md"
        onValueChange={onSelect}
        options={chips.map((scene) => ({ label: scene, value: scene }))}
        placeholder="Example"
        size="sm"
        value={active}
      />
    </div>
  );
};
