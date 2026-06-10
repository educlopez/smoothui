import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { cache } from "react";
import type { RegistryItem } from "shadcn/schema";

export const SKILL_ITEM_NAME = "skill";

// The SmoothUI skill: a SKILL.md installed into the user's project so AI
// assistants know how to install and extend SmoothUI correctly.
export const getSkill = cache(async (): Promise<RegistryItem> => {
  const skillPath = join(process.cwd(), "registry-assets", "SKILL.md");
  const content = await readFile(skillPath, "utf-8");

  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: SKILL_ITEM_NAME,
    type: "registry:item",
    title: "SmoothUI Skill",
    description:
      "Teaches AI coding assistants how to install SmoothUI components, blocks, and themes, and how to follow SmoothUI animation conventions.",
    author: "Eduardo Calvo <educlopez93@gmail.com>",
    files: [
      {
        path: "SKILL.md",
        type: "registry:file",
        content,
        target: ".claude/skills/smoothui/SKILL.md",
      },
    ],
  };
});
