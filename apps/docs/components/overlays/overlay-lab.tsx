"use client";

import ComboboxDemo from "@docs/examples/combobox";
import CommandDemo from "@docs/examples/command";
import ContextMenuDemo from "@docs/examples/context-menu";
import DropdownMenuDemo from "@docs/examples/dropdown-menu";
import MenubarDemo from "@docs/examples/menubar";
import NavigationMenuDemo from "@docs/examples/navigation-menu";
import PopoverDemo from "@docs/examples/popover";
import PreviewCardDemo from "@docs/examples/preview-card";
import SelectDemo from "@docs/examples/select";
import ToastDemo from "@docs/examples/toast";
import TooltipDemo from "@docs/examples/tooltip";
import SmoothButton from "@repo/smoothui/components/smooth-button";
import Toaster, { ToastIcon, toast } from "@repo/smoothui/components/toast";
import { cn } from "@repo/smoothui-utils";
import {
  ArrowRight,
  Ellipsis,
  MessageSquare,
  RotateCcw,
  Search,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import { useTheme } from "next-themes";
import { type ReactNode, useEffect, useState } from "react";

const Segmented = <T extends string>({
  label,
  onChange,
  options,
  value,
}: {
  label: string;
  onChange: (v: T) => void;
  options: { label: string; value: T }[];
  value: T;
}) => (
  <fieldset className="flex items-center gap-2">
    <legend className="sr-only">{label}</legend>
    <span className="text-muted-foreground text-sm">{label}</span>
    <div className="flex rounded-lg border border-border bg-card p-0.5">
      {options.map((o) => (
        <button
          aria-pressed={value === o.value}
          className={cn(
            "state-transition focus-ring rounded-md px-3 py-1 text-sm outline-none",
            value === o.value
              ? "bg-primary text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
          key={o.value}
          onClick={() => onChange(o.value)}
          type="button"
        >
          {o.label}
        </button>
      ))}
    </div>
  </fieldset>
);

const PanelHeader = ({ icon, title }: { icon: ReactNode; title: string }) => (
  <div className="flex items-center gap-2 border-border border-b px-3 py-2.5 text-sm">
    <span aria-hidden="true" className="text-muted-foreground">
      {icon}
    </span>
    <span className="font-medium">{title}</span>
    <Ellipsis
      aria-hidden="true"
      className="ml-auto size-4 text-muted-foreground"
    />
  </div>
);

/* Static specimens: the anatomy from the reference, built on the same
   `overlay-surface bg-popover` scope the real components use. */
const Specimens = () => (
  <div className="grid gap-6 md:grid-cols-2">
    <Stage label="Selection toolbar">
      <div className="overlay-surface w-full max-w-sm rounded-xl border bg-popover text-popover-foreground">
        <PanelHeader
          icon={<Sparkles className="size-4" />}
          title="Auto AI detect context"
        />
        <div className="flex items-center gap-1 p-1.5 text-sm">
          <button
            aria-label="Undo"
            className="focus-ring grid size-8 place-items-center rounded-md text-muted-foreground outline-none hover:bg-muted"
            type="button"
          >
            <RotateCcw aria-hidden="true" className="size-4" />
          </button>
          <span aria-hidden="true" className="mx-1 h-5 w-px bg-border" />
          {["Refine", "Deepen", "Enhance"].map((t, i) => (
            <button
              className={cn(
                "focus-ring inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 outline-none hover:bg-muted",
                i === 0 ? "bg-muted" : "text-muted-foreground"
              )}
              key={t}
              type="button"
            >
              {i === 1 ? (
                <Search aria-hidden="true" className="size-4" />
              ) : (
                <WandSparkles aria-hidden="true" className="size-4" />
              )}
              {t}
            </button>
          ))}
        </div>
      </div>
    </Stage>

    <Stage label="Menu">
      <div className="overlay-surface w-56 rounded-xl border bg-popover text-popover-foreground">
        <PanelHeader
          icon={<MessageSquare className="size-4" />}
          title="Writing options"
        />
        <ul className="p-1 text-sm">
          {[
            "Continue paragraph",
            "Describe scene",
            "Add dialogue",
            "Show emotions",
          ].map((t, i) => (
            <li
              className={cn(
                "rounded-md px-2.5 py-1.5",
                i === 1 ? "bg-accent text-accent-foreground" : ""
              )}
              key={t}
            >
              {t}
            </li>
          ))}
          <li className="rounded-md px-2.5 py-1.5 text-muted-foreground opacity-50">
            Add symbols (disabled)
          </li>
        </ul>
      </div>
    </Stage>

    <Stage label="Form popover">
      <div className="overlay-surface w-72 rounded-xl border bg-popover text-popover-foreground">
        <PanelHeader
          icon={<MessageSquare className="size-4" />}
          title="Add inputs"
        />
        <div className="flex flex-col gap-2 p-3">
          <label className="sr-only" htmlFor="ov-title">
            Title
          </label>
          <input
            className="focus-ring h-9 rounded-md border border-input bg-background px-3 text-base outline-none placeholder:text-muted-foreground md:text-sm"
            id="ov-title"
            placeholder="Title field"
          />
          <label className="sr-only" htmlFor="ov-body">
            Body
          </label>
          <textarea
            className="focus-ring min-h-20 rounded-md border border-input bg-background px-3 py-2 text-base outline-none placeholder:text-muted-foreground md:text-sm"
            id="ov-body"
            placeholder="Type anything here"
          />
          <div className="mt-1 grid grid-cols-2 gap-2">
            <button
              className="focus-ring h-9 rounded-md bg-muted text-sm outline-none hover:bg-muted/80"
              type="button"
            >
              Cancel
            </button>
            <button
              className="focus-ring h-9 rounded-md bg-foreground font-medium text-popover text-sm outline-none hover:bg-foreground/90"
              type="button"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </Stage>

    <div className="md:col-span-2">
      <Stage label="Toasts and tooltip">
        <div className="flex w-full flex-col items-center gap-6">
          <ToastSpecimens />
          <span className="overlay-surface rounded-md border bg-popover px-3 py-1.5 text-popover-foreground text-xs">
            Tooltip surface
          </span>
        </div>
      </Stage>
    </div>

    <Stage label="Context card">
      <div className="overlay-surface w-72 rounded-xl border bg-popover text-popover-foreground">
        <PanelHeader
          icon={<Sparkles className="size-4" />}
          title="Auto AI detect context"
        />
        <p className="px-3 pt-3 text-muted-foreground text-sm">
          Companies are spending heavily on increasingly powerful models, but
          many are discovering an uncomfortable truth.
        </p>
        <div className="p-1.5 pt-3">
          <button
            className="focus-ring inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-md bg-muted text-sm outline-none hover:bg-accent"
            type="button"
          >
            Review with AI
            <ArrowRight aria-hidden="true" className="size-4" />
          </button>
        </div>
      </div>
    </Stage>
  </div>
);

const KINDS = [
  { description: "Your changes are live.", title: "Saved", type: "success" },
  {
    description: "The file is larger than 10 MB.",
    title: "Upload failed",
    type: "error",
  },
  {
    description: "Your plan renews in 3 days.",
    title: "Card expiring",
    type: "warning",
  },
  {
    description: "Version 2.4 is available.",
    title: "Update ready",
    type: "info",
  },
  { description: "Uploading 3 files.", title: "Saving", type: "loading" },
  {
    description: "No icon on the default kind.",
    title: "Default",
    type: "default",
  },
] as const;

const ToastKinds = () => (
  <Toaster>
    <div className="flex flex-wrap justify-center gap-2">
      {KINDS.map((k) => (
        <SmoothButton
          key={k.type}
          onClick={() =>
            toast({ description: k.description, title: k.title, type: k.type })
          }
          size="sm"
          type="button"
          variant="outline"
        >
          {k.type}
        </SmoothButton>
      ))}
    </div>
  </Toaster>
);

/* Static toasts, same classes as ToastRoot, so every kind is visible at once. */
const ToastSpecimens = () => (
  <div className="grid w-full gap-2 sm:grid-cols-2">
    {KINDS.map((k) => (
      <div
        className="overlay-surface flex items-start gap-3 rounded-lg border bg-popover p-4 text-popover-foreground"
        key={k.type}
      >
        <ToastIcon type={k.type} />
        <div className="min-w-0 flex-1">
          <p className="font-medium text-sm leading-5">{k.title}</p>
          <p className="text-muted-foreground text-sm leading-5">
            {k.description}
          </p>
        </div>
      </div>
    ))}
  </div>
);

const Stage = ({ children, label }: { children: ReactNode; label: string }) => (
  <section className="flex flex-col gap-3">
    <h3 className="font-medium text-muted-foreground text-sm">{label}</h3>
    <div className="flex min-h-56 items-center justify-center rounded-2xl border border-border bg-background p-8">
      {children}
    </div>
  </section>
);

const LIVE = [
  { name: "Popover", node: <PopoverDemo /> },
  { name: "Dropdown menu", node: <DropdownMenuDemo /> },
  { name: "Context menu", node: <ContextMenuDemo /> },
  { name: "Menubar", node: <MenubarDemo /> },
  { name: "Select", node: <SelectDemo /> },
  { name: "Combobox", node: <ComboboxDemo /> },
  { name: "Command", node: <CommandDemo /> },
  { name: "Navigation menu", node: <NavigationMenuDemo /> },
  { name: "Preview card", node: <PreviewCardDemo /> },
  { name: "Toast", node: <ToastDemo /> },
  { name: "Toast kinds", node: <ToastKinds /> },
  { name: "Tooltip", node: <TooltipDemo /> },
];

export function OverlayLab() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const mode = mounted && resolvedTheme === "dark" ? "dark" : "light";

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-12 px-4 pt-28 pb-32 sm:px-8">
      <header className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="font-semibold font-title text-3xl">
            Overlay surfaces
          </h1>
          <p className="max-w-[70ch] text-pretty text-muted-foreground">
            Every component that wears the <code>overlay-surface</code> panel.{" "}
            Switch the mode to check both. The live examples open on click.
          </p>
        </div>
        <div className="sticky top-20 z-40 flex flex-wrap gap-4 self-start rounded-xl border border-border bg-card/90 p-2 backdrop-blur">
          <Segmented
            label="Mode"
            onChange={(v) => setTheme(v)}
            options={[
              { label: "Light", value: "light" },
              { label: "Dark", value: "dark" },
            ]}
            value={mode}
          />
        </div>
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="font-semibold text-xl">Anatomy</h2>
        <Specimens />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-semibold text-xl">Live components</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {LIVE.map((item) => (
            <Stage key={item.name} label={item.name}>
              {item.node}
            </Stage>
          ))}
        </div>
      </section>
    </main>
  );
}
