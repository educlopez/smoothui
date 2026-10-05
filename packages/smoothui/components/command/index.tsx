"use client";

import Dialog, { DialogDescription, DialogTitle } from "@repo/dialog";
import { cn } from "@repo/smoothui-utils";
import { Command as CommandPrimitive } from "cmdk";
import { SearchIcon } from "lucide-react";
import {
  type ComponentProps,
  createContext,
  type ReactNode,
  type RefObject,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";
import {
  type UseFluidHoverReturn,
  useFluidHover,
} from "../../hooks/use-fluid-hover";
import { FluidHoverHighlight } from "../fluid-hover-highlight";

export type CommandProps = ComponentProps<typeof CommandPrimitive>;
export type CommandInputProps = ComponentProps<typeof CommandPrimitive.Input>;
export type CommandListProps = ComponentProps<typeof CommandPrimitive.List>;
export type CommandEmptyProps = ComponentProps<typeof CommandPrimitive.Empty>;
export type CommandGroupProps = ComponentProps<typeof CommandPrimitive.Group>;
export type CommandItemProps = ComponentProps<typeof CommandPrimitive.Item>;
export type CommandSeparatorProps = ComponentProps<
  typeof CommandPrimitive.Separator
>;
export type CommandShortcutProps = ComponentProps<"span">;

export interface CommandDialogProps {
  children?: ReactNode;
  className?: string;
  description?: string;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  title?: string;
  trigger?: ReactNode;
}

type FluidHoverListContextValue = {
  claimIndex: () => number;
  registerItem: UseFluidHoverReturn["registerItem"];
};

const FluidHoverListContext = createContext<FluidHoverListContextValue | null>(
  null
);

/**
 * SmoothUI Command — cmdk root. Compose with Dialog via CommandDialog.
 */
export default function Command({ className, ...props }: CommandProps) {
  return (
    <CommandPrimitive
      className={cn(
        "flex w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
        className
      )}
      data-slot="command"
      {...props}
    />
  );
}

/**
 * Command palette in a dialog. Title/description are screen-reader only
 * (same pattern as shadcn CommandDialog) so `p-0` chrome stays clean.
 */
export const CommandDialog = ({
  children,
  className,
  description = "Search for a command to run…",
  onOpenChange,
  open,
  title = "Command Palette",
  trigger,
}: CommandDialogProps) => (
  <Dialog
    className={cn("gap-0 overflow-hidden p-0 sm:max-w-lg", className)}
    onOpenChange={onOpenChange}
    open={open}
    showCloseButton={false}
    trigger={trigger}
  >
    <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]]:px-2 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3">
      <DialogTitle className="sr-only">{title}</DialogTitle>
      <DialogDescription className="sr-only">{description}</DialogDescription>
      {children}
    </Command>
  </Dialog>
);

export const CommandInput = ({ className, ...props }: CommandInputProps) => (
  <div
    className="flex h-10 items-center gap-2 border-foreground/10 border-b px-3"
    data-slot="command-input-wrapper"
  >
    <SearchIcon aria-hidden className="size-4 shrink-0 opacity-50" />
    <CommandPrimitive.Input
      className={cn(
        "flex h-full w-full rounded-md bg-transparent text-sm outline-hidden placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      data-slot="command-input"
      {...props}
    />
  </div>
);

/**
 * Command list with Fluid Functionalism nearest-item hover.
 * Highlight lives outside cmdk List so it never participates in cmdk layout.
 */
export const CommandList = ({
  children,
  className,
  ...props
}: CommandListProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const hover = useFluidHover(containerRef as RefObject<HTMLElement | null>);
  const nextIndexRef = useRef(0);
  // Renumber from 0 each render so filtered remounts reclaim a dense range.
  nextIndexRef.current = 0;

  const claimIndex = useCallback(() => {
    const index = nextIndexRef.current;
    nextIndexRef.current += 1;
    return index;
  }, []);

  const listCtx = useMemo(
    () => ({
      claimIndex,
      registerItem: hover.registerItem,
    }),
    [claimIndex, hover.registerItem]
  );

  return (
    <FluidHoverListContext.Provider value={listCtx}>
      <div
        className="relative"
        data-slot="command-list-scope"
        ref={containerRef}
        {...hover.handlers}
      >
        <FluidHoverHighlight
          className="z-0 rounded-sm bg-foreground/10"
          hover={hover}
        />
        <CommandPrimitive.List
          className={cn(
            "scroll-fade z-10 max-h-72 scroll-py-1 overflow-y-auto overflow-x-hidden",
            className
          )}
          data-slot="command-list"
          {...props}
        >
          {children}
        </CommandPrimitive.List>
      </div>
    </FluidHoverListContext.Provider>
  );
};

export const CommandEmpty = ({ className, ...props }: CommandEmptyProps) => (
  <CommandPrimitive.Empty
    className={cn("py-6 text-center text-sm", className)}
    data-slot="command-empty"
    {...props}
  />
);

export const CommandGroup = ({ className, ...props }: CommandGroupProps) => (
  <CommandPrimitive.Group
    className={cn(
      "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:text-xs",
      className
    )}
    data-slot="command-group"
    {...props}
  />
);

export const CommandSeparator = ({
  className,
  ...props
}: CommandSeparatorProps) => (
  <CommandPrimitive.Separator
    className={cn("-mx-1 h-px bg-foreground/10", className)}
    data-slot="command-separator"
    {...props}
  />
);

export const CommandItem = ({ className, ...props }: CommandItemProps) => {
  const list = useContext(FluidHoverListContext);
  const itemRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    if (!list) {
      return;
    }
    if (indexRef.current === null) {
      indexRef.current = list.claimIndex();
    }
    list.registerItem(indexRef.current, itemRef.current);
    return () => {
      if (indexRef.current !== null) {
        list.registerItem(indexRef.current, null);
        indexRef.current = null;
      }
    };
  }, [list]);

  return (
    <CommandPrimitive.Item
      className={cn(
        "relative z-10 flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden data-[disabled=true]:pointer-events-none data-[selected=true]:bg-foreground/10 data-[disabled=true]:text-muted-foreground/60 data-[selected=true]:text-foreground [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      )}
      data-slot="command-item"
      ref={itemRef}
      {...props}
    />
  );
};

export const CommandShortcut = ({
  className,
  ...props
}: CommandShortcutProps) => (
  <span
    className={cn(
      "ml-auto text-muted-foreground text-xs tracking-widest",
      className
    )}
    data-slot="command-shortcut"
    {...props}
  />
);
