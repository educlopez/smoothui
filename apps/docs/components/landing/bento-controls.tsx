"use client";

import {
  AtSign,
  Bell,
  BellOff,
  Check,
  Inbox,
  Layers,
  SlidersHorizontal,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useId, useState } from "react";

export function BentoSegments({
  options,
  value,
  onChange,
  label,
}: {
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
  label: string;
}) {
  const id = useId();
  const reduced = useReducedMotion();
  return (
    <div
      aria-label={label}
      role="group"
      className="flex rounded-lg border border-border/60 bg-muted/70 p-1 shadow-[inset_0_1px_2px_#00000006]"
    >
      {options.map((option) => (
        <button
          type="button"
          key={option}
          aria-pressed={value === option}
          onClick={() => onChange(option)}
          className="relative flex min-h-10 flex-1 items-center justify-center rounded-md px-2 text-xs capitalize focus-visible:outline-2 focus-visible:outline-ring"
        >
          {value === option ? (
            <motion.span
              layoutId={id}
              transition={{ duration: reduced ? 0 : 0.18 }}
              className="absolute inset-0 rounded-md border border-border/70 bg-background shadow-sm"
            />
          ) : null}
          <span
            className={`relative ${value === option ? "text-foreground" : "text-muted-foreground"}`}
          >
            {option}
          </span>
        </button>
      ))}
    </div>
  );
}

export function ReactSettingsIllustration() {
  const [enabled, setEnabled] = useState(true);
  const reduced = useReducedMotion();
  const Icon = enabled ? Bell : BellOff;
  return (
    <div
      data-react-settings
      className="relative rounded-xl border border-border/70 bg-muted/50 p-5 pb-12 shadow-[inset_0_1px_3px_#00000004]"
    >
      <motion.div
        animate={{ y: enabled ? 0 : 3 }}
        transition={{ duration: reduced ? 0 : 0.2 }}
        className="mx-auto max-w-sm overflow-hidden rounded-xl border border-border bg-background shadow-[0_2px_3px_#00000004,0_12px_22px_-10px_#00000020]"
      >
        <div className="flex items-center gap-2 border-b px-3 py-2.5">
          <Inbox size={14} />
          <span className="flex-1 font-medium text-xs">Inbox</span>
          <span className="rounded border px-1.5 font-mono text-[10px] text-muted-foreground">
            {enabled ? "02" : "00"}
          </span>
        </div>
        {[
          {
            icon: AtSign,
            text: "A new mention in Components",
            title: "Design review",
          },
          {
            icon: Layers,
            text: "Your changes, all in one place",
            title: "Ready to share",
          },
        ].map((item, index) => (
          <motion.div
            key={item.title}
            animate={{ opacity: enabled ? 1 : 0.45 }}
            transition={{
              delay: reduced ? 0 : index * 0.04,
              duration: reduced ? 0 : 0.18,
            }}
            className="flex items-center gap-3 border-border/60 border-b px-3 py-3 last:border-0"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border/80 bg-muted/40 shadow-[inset_0_1px_0_#ffffff80]">
              <item.icon size={14} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-xs">{item.title}</p>
              <p className="mt-0.5 truncate text-[10px] text-muted-foreground">
                {item.text}
              </p>
            </div>
            {enabled ? (
              <span className="size-1.5 rounded-full bg-brand" />
            ) : null}
          </motion.div>
        ))}
      </motion.div>
      <div className="absolute bottom-3 left-1/2 flex max-w-[calc(100%-16px)] -translate-x-1/2 items-center gap-3 whitespace-nowrap rounded-full border border-border bg-background py-1 pr-1 pl-3 shadow-[0_2px_3px_#00000005,0_5px_12px_#00000006]">
        <Icon size={13} />
        <span className="min-w-0 truncate text-[11px]">
          {enabled ? "Activity updates" : "Notifications are paused"}
        </span>
        <button
          role="switch"
          aria-label="Activity updates"
          aria-checked={enabled}
          type="button"
          onClick={() => setEnabled((v) => !v)}
          className="flex size-10 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-ring"
        >
          <span
            className={`flex h-5 w-8 items-center rounded-full p-0.5 ${enabled ? "bg-foreground" : "bg-muted-foreground/30"}`}
          >
            <motion.span
              animate={{ x: enabled ? 12 : 0 }}
              transition={{ duration: reduced ? 0 : 0.18 }}
              className="size-4 rounded-full bg-background shadow-sm"
            />
          </span>
        </button>
      </div>
    </div>
  );
}

export function TokenIllustration() {
  const [radius, setRadius] = useState("soft");
  const [selected, setSelected] = useState(false);
  const reduced = useReducedMotion();
  const corners = { crisp: 4, round: 28, soft: 14 };
  return (
    <div
      data-token-preview
      className="rounded-xl border border-border/70 bg-muted/50 p-3 shadow-[inset_0_1px_3px_#00000004]"
    >
      <div className="flex items-center justify-between px-1 pb-3 text-muted-foreground">
        <SlidersHorizontal size={13} />
        <span className="font-mono text-[10px]">
          radius / {corners[radius as keyof typeof corners]}
        </span>
      </div>
      <div className="px-2 pb-4">
        <motion.button
          type="button"
          aria-label={selected ? "Selected" : "Select item"}
          aria-pressed={selected}
          onClick={() => setSelected((v) => !v)}
          animate={{ borderRadius: corners[radius as keyof typeof corners] }}
          transition={{ duration: reduced ? 0 : 0.2 }}
          className="flex min-h-24 w-full items-center gap-3 border border-border bg-background p-3 text-left shadow-[0_2px_3px_#00000004,0_10px_15px_-8px_#00000015] focus-visible:outline-2 focus-visible:outline-ring"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-muted/50">
            <Layers size={17} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-medium text-xs">Surface</span>
            <span className="mt-1 block text-[10px] text-muted-foreground">
              Your own details
            </span>
          </span>
          <span
            className={`flex size-4 shrink-0 items-center justify-center rounded-full border ${selected ? "border-foreground bg-foreground" : "border-border"}`}
          >
            {selected ? <Check size={10} className="text-background" /> : null}
          </span>
        </motion.button>
      </div>
      <BentoSegments
        options={["crisp", "soft", "round"]}
        value={radius}
        onChange={setRadius}
        label="Preview corner radius"
      />
      <p className="sr-only">
        border-radius: {corners[radius as keyof typeof corners]}px
      </p>
    </div>
  );
}
