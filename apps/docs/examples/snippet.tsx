"use client";

import {
  Snippet,
  SnippetCopyButton,
  SnippetHeader,
  SnippetTabsContent,
  SnippetTabsList,
  SnippetTabsTrigger,
} from "@repo/smoothui/components/snippet";
import { useState } from "react";

export default function SnippetDemo() {
  const [tab, setTab] = useState("npm");

  const commands: Record<string, string> = {
    npm: "npm install @repo/smoothui",
    pnpm: "pnpm add @repo/smoothui",
    yarn: "yarn add @repo/smoothui",
  };

  return (
    <div className="max-w-2xl">
      <Snippet defaultValue="npm" onValueChange={setTab} value={tab}>
        <SnippetHeader>
          <SnippetTabsList>
            <SnippetTabsTrigger value="npm">npm</SnippetTabsTrigger>
            <SnippetTabsTrigger value="pnpm">pnpm</SnippetTabsTrigger>
            <SnippetTabsTrigger value="yarn">yarn</SnippetTabsTrigger>
          </SnippetTabsList>
          <SnippetCopyButton aria-label="Copy command" value={commands[tab]} />
        </SnippetHeader>

        <SnippetTabsContent value="npm">{commands.npm}</SnippetTabsContent>
        <SnippetTabsContent value="pnpm">{commands.pnpm}</SnippetTabsContent>
        <SnippetTabsContent value="yarn">{commands.yarn}</SnippetTabsContent>
      </Snippet>
    </div>
  );
}
