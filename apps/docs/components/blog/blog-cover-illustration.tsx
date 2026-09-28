import { CANDY, GHOST, INK } from "@docs/components/illustrations/ink";
import type { BlogCoverKind } from "@docs/lib/blog-cover";
import { cn } from "@repo/shadcn-ui/lib/utils";
import Image from "next/image";
import { IconCheckFill24 } from "nucleo-core-fill-24";

/** Floating panel — Oat white card on the vivid stage. */
const Panel = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "rounded-xl border border-border bg-background shadow-sm",
      className
    )}
  >
    {children}
  </div>
);

const Bar = ({
  className,
  tone = "ghost",
}: {
  className?: string;
  tone?: "ink" | "ghost" | "candy";
}) => (
  <div
    className={cn(
      "h-2 rounded-full",
      tone === "ink" && INK,
      tone === "ghost" && GHOST,
      tone === "candy" && CANDY,
      className
    )}
  />
);

const UiCraftLogo = ({ size = 40 }: { size?: number }) => (
  <Image
    alt=""
    aria-hidden
    className="rounded-xl shadow-black/20 shadow-md ring-1 ring-white/40"
    draggable={false}
    height={size}
    src="/icon-ui-craft.png"
    width={size}
  />
);

function AuditDrawing() {
  return (
    <div className="flex w-full max-w-[15rem] items-center gap-2.5">
      <Panel className="flex flex-1 flex-col gap-2 p-3 opacity-50">
        <Bar className="w-3/4" />
        <Bar className="w-full" />
        <Bar className="w-1/2" />
        <div className={cn("mt-1 h-8 w-full rounded-lg", GHOST)} />
      </Panel>
      <div className="flex size-7 shrink-0 items-center justify-center">
        <div className={cn("size-1.5 rounded-full", CANDY)} />
      </div>
      <Panel className="relative flex flex-1 flex-col gap-2 p-3 shadow-md">
        <div className="absolute -top-2 -right-2">
          <UiCraftLogo size={28} />
        </div>
        <div
          className={cn(
            "flex size-7 items-center justify-center rounded-lg",
            CANDY
          )}
        >
          <IconCheckFill24 className="text-white" size={14} />
        </div>
        <Bar className="w-4/5" tone="ink" />
        <Bar className="w-3/5" />
      </Panel>
    </div>
  );
}

function LibrariesDrawing() {
  return (
    <div className="flex items-end justify-center gap-2">
      {[0, 1, 2].map((index) => (
        <Panel
          className={cn(
            "flex w-16 flex-col gap-1.5 p-2",
            index === 1 ? "h-28 shadow-md" : "h-20"
          )}
          key={index}
        >
          <div
            className={cn("size-6 rounded-md", index === 1 ? CANDY : GHOST)}
          />
          <Bar className="w-full" tone={index === 1 ? "ink" : "ghost"} />
          <Bar className="w-2/3" />
          {index === 1 ? <Bar className="mt-auto w-1/2" tone="candy" /> : null}
        </Panel>
      ))}
    </div>
  );
}

function TabsDrawing() {
  return (
    <Panel className="w-full max-w-[15rem] p-2.5">
      <div className="mb-3 flex gap-1 rounded-lg bg-muted p-1">
        <div className="h-6 flex-1 rounded-md" />
        <div className={cn("h-6 flex-1 rounded-md", CANDY)} />
        <div className="h-6 flex-1 rounded-md" />
      </div>
      <div className="space-y-2 px-1 pb-1">
        <Bar className="w-3/4" tone="ink" />
        <Bar className="w-full" />
        <Bar className="w-2/5" />
      </div>
    </Panel>
  );
}

function MagneticDrawing() {
  return (
    <div className="relative flex size-36 items-center justify-center">
      <div className="absolute inset-4 rounded-full border border-border/80 border-dashed" />
      <div className="absolute inset-8 rounded-full border border-border/50" />
      <div
        className={cn(
          "relative z-10 h-10 w-24 -translate-x-1 translate-y-1 rotate-[-6deg] rounded-xl shadow-md",
          CANDY
        )}
      />
      <div className="absolute right-4 bottom-6 size-3 rotate-12 rounded-sm border border-border bg-background shadow-sm" />
    </div>
  );
}

function NumbersDrawing() {
  return (
    <Panel className="flex items-center gap-1.5 px-3 py-3">
      {["1", "2", "4"].map((digit, index) => (
        <div
          className={cn(
            "flex h-14 w-10 flex-col items-center justify-center overflow-hidden rounded-lg border border-border",
            index === 2 ? "bg-muted shadow-inner" : "bg-background"
          )}
          key={digit}
        >
          <span
            className={cn(
              "font-mono font-semibold text-lg tabular-nums",
              index === 2 ? "text-foreground" : "text-muted-foreground"
            )}
          >
            {digit}
          </span>
          {index === 2 ? (
            <div className={cn("mt-0.5 h-0.5 w-4 rounded-full", CANDY)} />
          ) : null}
        </div>
      ))}
      <div className="ml-1 flex flex-col gap-1">
        <div className={cn("size-2.5 rotate-45 rounded-[2px]", CANDY)} />
        <div className={cn("size-2.5 rotate-45 rounded-[2px]", GHOST)} />
      </div>
    </Panel>
  );
}

function PopoverDrawing() {
  return (
    <div className="relative flex w-full max-w-[14rem] flex-col items-start gap-2">
      <div className="h-8 w-24 rounded-full border border-border bg-background shadow-sm" />
      <Panel className="w-full p-3 shadow-md">
        <div className={cn("mb-2 h-12 w-full rounded-lg", GHOST)} />
        <Bar className="mb-1.5 w-4/5" tone="ink" />
        <Bar className="w-3/5" />
      </Panel>
    </div>
  );
}

function ScrambleDrawing() {
  return (
    <Panel className="flex w-full max-w-[15rem] flex-col gap-3 p-3">
      <div className="flex gap-1">
        {(
          [
            { id: "a", tone: CANDY },
            { id: "b", tone: INK },
            { id: "c", tone: GHOST },
            { id: "d", tone: CANDY },
            { id: "e", tone: INK },
            { id: "f", tone: GHOST },
            { id: "g", tone: CANDY },
            { id: "h", tone: INK },
          ] as const
        ).map((cell) => (
          <div
            className={cn("h-5 flex-1 rounded-sm", cell.tone)}
            key={cell.id}
          />
        ))}
      </div>
      <div className="flex gap-1.5">
        <Bar className="w-10" tone="ink" />
        <Bar className="w-14" />
        <Bar className="w-8" tone="ink" />
        <Bar className="w-12" />
      </div>
    </Panel>
  );
}

function SocialDrawing() {
  return (
    <Panel className="flex w-full max-w-[15rem] gap-1 p-1.5">
      {[0, 1, 2].map((index) => (
        <div
          className={cn(
            "flex h-12 flex-1 items-center justify-center rounded-lg",
            index === 1 ? cn(CANDY, "shadow-sm") : "bg-muted"
          )}
          key={index}
        >
          <div
            className={cn(
              "size-4 rounded-md",
              index === 1 ? "bg-white/30" : GHOST
            )}
          />
        </div>
      ))}
    </Panel>
  );
}

function AccountDrawing() {
  return (
    <div className="flex w-full max-w-[15rem] items-start gap-2.5">
      <div
        className={cn(
          "size-11 shrink-0 rounded-full border-2 border-background shadow-sm",
          INK
        )}
      />
      <Panel className="flex flex-1 flex-col gap-2 p-2.5 shadow-md">
        <div className="flex items-center gap-2">
          <div className={cn("size-5 rounded-full", CANDY)} />
          <Bar className="w-16" tone="ink" />
        </div>
        <div className="h-px bg-border" />
        <div className="flex items-center gap-2">
          <div className={cn("size-3.5 rounded", GHOST)} />
          <Bar className="w-20" />
        </div>
        <div className="flex items-center gap-2">
          <div className={cn("size-3.5 rounded", GHOST)} />
          <Bar className="w-14" />
        </div>
      </Panel>
    </div>
  );
}

function MotionDrawing() {
  return (
    <div className="relative flex h-28 w-full max-w-[15rem] items-center justify-center">
      <svg
        aria-hidden="true"
        className="absolute inset-x-2 top-1/2 h-16 -translate-y-1/2 text-border"
        fill="none"
        focusable="false"
        viewBox="0 0 200 64"
      >
        <path
          d="M8 48C48 48 52 12 100 12s52 36 92 36"
          stroke="currentColor"
          strokeDasharray="4 6"
          strokeWidth="2"
        />
        <path
          className="text-brand"
          d="M8 48C48 48 52 12 100 12"
          stroke="currentColor"
          strokeWidth="2.5"
        />
      </svg>
      <div className="absolute bottom-6 left-3 size-6 rounded-md border border-border bg-background shadow-sm" />
      <div
        className={cn(
          "absolute top-4 left-1/2 size-8 -translate-x-1/2 rotate-12 rounded-lg shadow-md",
          CANDY
        )}
      />
      <div className="absolute right-3 bottom-6 size-6 rounded-md border border-border bg-background shadow-sm" />
    </div>
  );
}

function CraftDrawing() {
  return (
    <Panel className="flex w-full max-w-[12rem] flex-col items-center gap-3 p-4 shadow-md">
      <UiCraftLogo size={48} />
      <div className="flex w-full flex-col items-center gap-1.5">
        <Bar className="w-16" tone="ink" />
        <Bar className="w-24" />
      </div>
      <div className={cn("h-7 w-full rounded-lg", CANDY)} />
    </Panel>
  );
}

function HoverDrawing() {
  return (
    <div className="relative flex size-32 items-center justify-center">
      <Panel className="absolute h-20 w-24 -rotate-6 opacity-40" />
      <Panel className="absolute h-20 w-24 rotate-6 opacity-60" />
      <Panel className="relative z-10 flex h-20 w-24 flex-col gap-2 p-2.5 shadow-md">
        <div className={cn("size-6 rounded-md", CANDY)} />
        <Bar className="w-full" tone="ink" />
        <Bar className="w-2/3" />
      </Panel>
      <div className="absolute right-2 bottom-2 z-20 size-3.5 rotate-12 rounded-[2px] border border-border bg-background shadow-sm" />
    </div>
  );
}

function ShadcnDrawing() {
  return (
    <div className="grid w-full max-w-[14rem] grid-cols-2 gap-2">
      <Panel className="col-span-2 flex items-center gap-2 px-3 py-2.5">
        <div className={cn("h-7 w-16 rounded-lg", CANDY)} />
        <div className="h-7 flex-1 rounded-md border border-border bg-muted" />
      </Panel>
      <Panel className="flex h-14 items-center justify-center">
        <div
          className={cn(
            "flex size-5 items-center justify-center rounded-[5px]",
            CANDY
          )}
        >
          <IconCheckFill24 className="text-white" size={12} />
        </div>
      </Panel>
      <Panel className="flex h-14 items-center justify-center gap-1">
        <div className={cn("size-4 rounded-full", INK)} />
        <div className={cn("size-4 rounded-full", GHOST)} />
        <div className={cn("size-4 rounded-full", GHOST)} />
      </Panel>
    </div>
  );
}

function KeyframesDrawing() {
  return (
    <Panel className="w-full max-w-[15rem] px-3 py-4">
      <div className="relative h-12">
        <div className="absolute inset-x-0 top-1/2 h-px bg-border" />
        <svg
          aria-hidden="true"
          className="absolute inset-0 size-full text-brand"
          fill="none"
          focusable="false"
          viewBox="0 0 200 48"
        >
          <path
            d="M12 36C48 36 52 12 100 12s52 24 88 24"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
        {[12, 50, 88].map((left) => (
          <div
            className={cn(
              "absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-[2px]",
              left === 50 ? CANDY : INK
            )}
            key={left}
            style={{ left: `${left}%` }}
          />
        ))}
      </div>
    </Panel>
  );
}

function ComponentsDrawing() {
  return (
    <div className="grid w-full max-w-[14rem] grid-cols-3 gap-2">
      <Panel className="col-span-2 flex h-12 items-center px-2.5">
        <div className={cn("h-6 w-14 rounded-full", CANDY)} />
      </Panel>
      <Panel className="flex h-12 items-center justify-center">
        <div
          className={cn("flex h-5 w-8 items-center rounded-full p-0.5", CANDY)}
        >
          <div className="size-4 translate-x-3 rounded-full bg-white shadow-sm" />
        </div>
      </Panel>
      <Panel className="flex h-12 items-center justify-center">
        <div
          className={cn(
            "flex size-5 items-center justify-center rounded-[5px]",
            CANDY
          )}
        >
          <IconCheckFill24 className="text-white" size={11} />
        </div>
      </Panel>
      <Panel className="col-span-2 flex h-12 flex-col justify-center gap-1.5 px-2.5">
        <Bar className="w-4/5" tone="ink" />
        <Bar className="w-3/5" />
      </Panel>
    </div>
  );
}

function NotesDrawing() {
  return (
    <Panel className="flex w-full max-w-[11rem] flex-col gap-2 p-3 shadow-md">
      <div className={cn("mb-1 h-10 w-full rounded-lg", GHOST)} />
      <Bar className="w-full" tone="ink" />
      <Bar className="w-4/5" />
      <Bar className="w-3/5" />
    </Panel>
  );
}

function Illustration({ kind }: { kind: BlogCoverKind }) {
  switch (kind) {
    case "audit":
      return <AuditDrawing />;
    case "libraries":
      return <LibrariesDrawing />;
    case "tabs":
      return <TabsDrawing />;
    case "magnetic":
      return <MagneticDrawing />;
    case "numbers":
      return <NumbersDrawing />;
    case "popover":
      return <PopoverDrawing />;
    case "scramble":
      return <ScrambleDrawing />;
    case "social":
      return <SocialDrawing />;
    case "account":
      return <AccountDrawing />;
    case "motion":
      return <MotionDrawing />;
    case "craft":
      return <CraftDrawing />;
    case "hover":
      return <HoverDrawing />;
    case "shadcn":
      return <ShadcnDrawing />;
    case "keyframes":
      return <KeyframesDrawing />;
    case "components":
      return <ComponentsDrawing />;
    default:
      return <NotesDrawing />;
  }
}

/** Oat fragment for a blog cover — no titles, subject readable by shape. */
export function BlogCoverIllustration({ kind }: { kind: BlogCoverKind }) {
  return (
    <div
      aria-hidden="true"
      className="flex w-full max-w-[min(100%,18rem)] items-center justify-center"
      data-blog-illustration={kind}
    >
      <Illustration kind={kind} />
    </div>
  );
}
