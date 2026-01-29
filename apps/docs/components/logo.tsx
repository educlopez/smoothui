"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { Icon } from "./icon";
import {
  LogoContextMenuProvider,
  useLogoContextMenu,
} from "./logo-context-menu";

function LogoContent({
  classNameIcon,
  className,
}: {
  classNameIcon?: string;
  className?: string;
}) {
  const { openMenu } = useLogoContextMenu();

  return (
    <button
      className="flex cursor-pointer items-center gap-2 border-none bg-transparent"
      onContextMenu={openMenu}
      type="button"
    >
      <Icon className={cn("h-6 w-auto cursor-grabbing", classNameIcon)} />
      <span
        className={cn(
          "mt-0.5 select-none text-center font-medium font-title text-foreground text-xl transition",
          className
        )}
      >
        Smooth<span className="text-brand">UI</span>
      </span>
    </button>
  );
}

export default function Logo({
  classNameIcon,
  className,
}: {
  classNameIcon?: string;
  className?: string;
}) {
  return (
    <LogoContextMenuProvider>
      <LogoContent className={className} classNameIcon={classNameIcon} />
    </LogoContextMenuProvider>
  );
}
