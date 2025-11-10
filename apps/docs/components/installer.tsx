"use client";

import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";

type InstallerProps = {
  packageName: string;
};

export const Installer = ({ packageName }: InstallerProps) => {
  const commands = {
    pnpm: `pnpm dlx shadcn add @smoothui/${packageName}`,
    npm: `npx shadcn@latest add @smoothui/${packageName}`,
    yarn: `yarn dlx shadcn add @smoothui/${packageName}`,
    bun: `bunx shadcn add @smoothui/${packageName}`,
  };

  return (
    <div className="[&_figure]:rounded-md [&_figure]:shadow-none">
      <Tabs defaultIndex={0} items={["pnpm", "npm", "yarn", "bun"]}>
        {Object.entries(commands).map(([key, code]) => (
          <Tab key={key} value={key}>
            <DynamicCodeBlock
              code={code}
              lang="bash"
              options={{
                themes: {
                  light: "catppuccin-latte",
                  dark: "catppuccin-mocha",
                },
              }}
            />
          </Tab>
        ))}
      </Tabs>
    </div>
  );
};
