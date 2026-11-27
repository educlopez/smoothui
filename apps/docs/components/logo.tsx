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
  mark = false,
}: {
  classNameIcon?: string;
  className?: string;
  mark?: boolean;
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
      <Icon className={cn("h-6 w-auto", classNameIcon)} />
      {mark ? null : (
        <span
          className={cn(
            "select-none text-center font-allo-wordmark text-2xl text-foreground leading-none sm:text-3xl",
            className
          )}
        >
          Smooth<span className="text-brand">UI</span>
        </span>
      )}
    </span>
  );
}

export default function Logo({
  classNameIcon,
  className,
  mark = false,
}: {
  classNameIcon?: string;
  className?: string;
  mark?: boolean;
}) {
  return (
    <LogoContextMenuProvider>
      <LogoContent
        className={className}
        classNameIcon={classNameIcon}
        mark={mark}
      />
    </LogoContextMenuProvider>
  );
}
