"use client";

import ButtonCopy from "@repo/smoothui/components/button-copy";
import { Check, Copy, LoaderCircle } from "lucide-react";

export function InstallCopyButton({ slug }: { slug: string }) {
  const command = `npx shadcn@latest add @smoothui/${slug}`;

  return (
    <span title={command}>
      <ButtonCopy
        className="grid size-7 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        idleIcon={<Copy size={14} />}
        loadingIcon={<LoaderCircle className="animate-spin" size={14} />}
        onCopy={() => navigator.clipboard.writeText(command)}
        successIcon={<Check size={14} />}
      />
    </span>
  );
}
