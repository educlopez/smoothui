"use client";

import {
  Snippet,
  SnippetCopyButton,
  SnippetHeader,
  SnippetTabsContent,
  SnippetTabsList,
  SnippetTabsTrigger,
} from "@repo/smoothui/components/snippet";

import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import Smoothui from "../public/logomark.svg";
import shadcn from "../public/shadcn.svg";

type InstallerProps = {
  packageName: string;
};

export const Installer = ({ packageName }: InstallerProps) => {
  const [value, setValue] = useState("smoothui");

  const commands = {
    smoothui: {
      label: "SmoothUI CLI",
      image: Smoothui,
      code: `npx smoothui add ${packageName}`,
    },
    shadcn: {
      label: "shadcn CLI",
      image: shadcn,
      code: `npx shadcn add @smoothui/${packageName}`,
    },
  };

  return (
    <Snippet
      className="not-prose shiki shiki-themes github-light github-dark"
      onValueChange={setValue}
      value={value}
    >
      <SnippetHeader>
        <SnippetTabsList>
          {Object.entries(commands).map(([key, command]) => (
            <SnippetTabsTrigger className="basis-auto" key={key} value={key}>
              <Image
                alt=""
                className="dark:invert"
                height={14}
                src={command.image}
                width={14}
              />
              {command.label}
            </SnippetTabsTrigger>
          ))}
        </SnippetTabsList>
        <SnippetCopyButton
          onCopy={() => {
            toast.success("Copied to clipboard");
          }}
          onError={() => toast.error("Failed to copy to clipboard")}
          value={commands[value as keyof typeof commands].code}
        />
      </SnippetHeader>
      {Object.entries(commands).map(([key, command]) => (
        <SnippetTabsContent key={key} value={key}>
          {command.code}
        </SnippetTabsContent>
      ))}
    </Snippet>
  );
};
