"use client";

import ButtonCopy from "@repo/smoothui/components/button-copy";
import {
  IconCheckFill24,
  IconCopy2Fill24,
  IconDotsLoaderFill24,
} from "nucleo-core-fill-24";

export function InstallCopyButton({ slug }: { slug: string }) {
  const command = `npx shadcn@latest add @smoothui/${slug}`;

  return (
    <span title={command}>
      <ButtonCopy
        className="grid size-7! min-h-7! min-w-7! shrink-0 place-items-center rounded-md p-0! text-foreground transition-colors hover:bg-primary"
        idleIcon={<IconCopy2Fill24 className="size-3.5" />}
        loadingIcon={<IconDotsLoaderFill24 className="size-3.5 animate-spin" />}
        onCopy={() => navigator.clipboard.writeText(command)}
        successIcon={<IconCheckFill24 className="size-3.5" />}
      />
    </span>
  );
}
