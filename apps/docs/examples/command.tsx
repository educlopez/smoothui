"use client";

import Command, {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@repo/smoothui/components/command";
import Kbd from "@repo/smoothui/components/kbd";
import SmoothButton from "@repo/smoothui/components/smooth-button";
import { useEffect, useState } from "react";

const FeaturesDemo = () => (
  <div className="w-full max-w-md overflow-hidden rounded-lg border shadow-sm">
    <Command>
      <CommandInput aria-label="Type a command" placeholder="Type a command…" />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>
            Calendar
            <CommandShortcut>
              <Kbd>C</Kbd>
            </CommandShortcut>
          </CommandItem>
          <CommandItem>
            Search docs
            <CommandShortcut>
              <Kbd>⌘</Kbd>
              <Kbd>K</Kbd>
            </CommandShortcut>
          </CommandItem>
          <CommandItem>Settings</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  </div>
);

const DialogDemo = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "j" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((current) => !current);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="flex flex-col items-center gap-3 p-8">
      <CommandDialog
        onOpenChange={setOpen}
        open={open}
        trigger={
          <SmoothButton size="sm" type="button" variant="outline">
            Open palette
            <span className="ml-2 inline-flex gap-1">
              <Kbd>⌘</Kbd>
              <Kbd>J</Kbd>
            </span>
          </SmoothButton>
        }
      >
        <CommandInput
          aria-label="Search commands"
          placeholder="Search commands…"
        />
        <CommandList>
          <CommandEmpty>No results.</CommandEmpty>
          <CommandGroup heading="Actions">
            <CommandItem onSelect={() => setOpen(false)}>New file</CommandItem>
            <CommandItem onSelect={() => setOpen(false)}>
              Open project
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
};

export const demoScenes = {
  Dialog: DialogDemo,
  Features: FeaturesDemo,
};

export default function CommandDemo() {
  return <FeaturesDemo />;
}
