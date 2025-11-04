"use client";

import { Button } from "@repo/shadcn-ui/components/ui/button";
import { cn } from "@repo/shadcn-ui/lib/utils";
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { useCopyButton } from "fumadocs-ui/utils/use-copy-button";
import { Check, Copy } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import shadcn from "../public/shadcn.svg";

type InstallerProps = {
  packageName: string;
};

export const Installer = ({ packageName }: InstallerProps) => {
  const code = `npx shadcn add @smoothui/${packageName}`;
  const [checked, onCopy] = useCopyButton(async () => {
    await navigator.clipboard.writeText(code);
    toast.success("Copied to clipboard");
  });

  return (
    <div className="group not-prose shiki shiki-themes catppuccin-latte catppuccin-mocha w-full overflow-hidden rounded-md border">
      <div className="flex flex-row items-center justify-between border-b bg-secondary p-1">
        <div className="flex items-center gap-1.5 px-2">
          <Image
            alt="shadcn"
            className="dark:invert"
            height={14}
            src={shadcn}
            width={14}
          />
          <span className="text-sm">shadcn CLI</span>
        </div>
        <Button
          className={cn(
            "shrink-0 opacity-0 transition-opacity group-hover:opacity-100",
            "h-8 w-8"
          )}
          onClick={onCopy}
          size="icon"
          variant="ghost"
        >
          {checked ? <Check size={14} /> : <Copy size={14} />}
        </Button>
      </div>
      <div className="bg-background p-0 text-sm">
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
    </div>
  );
};
