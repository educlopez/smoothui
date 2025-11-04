"use client";

import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";

type PreviewCodeProps = {
  code: string;
  language: string;
  filename: string;
};

export const PreviewCode = ({ code, language }: PreviewCodeProps) => (
  <div className="relative">
    <DynamicCodeBlock
      code={code}
      lang={language}
      options={{
        themes: {
          light: "catppuccin-latte",
          dark: "catppuccin-mocha",
        },
      }}
    />
  </div>
);
