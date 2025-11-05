"use client";

import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";

type InstallerProps = {
  packageName: string;
};

export const Installer = ({ packageName }: InstallerProps) => {
  const code = `npx shadcn add @smoothui/${packageName}`;

  return (
    <div className="[&_figure]:rounded-md">
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
    </div>
  );
};
