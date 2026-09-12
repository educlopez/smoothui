"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { useEffect, useRef } from "react";
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
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const logo = ref.current;
    if (!logo) {
      return;
    }
    const target = logo.closest("a, button") ?? logo;
    const contextMenu = (event: Event) => {
      if (event instanceof MouseEvent) {
        openMenu(event);
      }
    };
    const keyboardMenu = (event: Event) => {
      if (
        !(
          event instanceof KeyboardEvent &&
          (event.key === "ContextMenu" ||
            (event.shiftKey && event.key === "F10"))
        )
      ) {
        return;
      }
      const rect = target.getBoundingClientRect();
      openMenu({
        clientX: rect.left,
        clientY: rect.bottom,
        preventDefault: () => event.preventDefault(),
      });
    };
    target.addEventListener("contextmenu", contextMenu);
    target.addEventListener("keydown", keyboardMenu);
    return () => {
      target.removeEventListener("contextmenu", contextMenu);
      target.removeEventListener("keydown", keyboardMenu);
    };
  }, [openMenu]);

  return (
    <span
      className="flex cursor-pointer items-center gap-2 border-none bg-transparent"
      ref={ref}
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
    </span>
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
