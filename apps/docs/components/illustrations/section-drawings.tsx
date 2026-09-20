import { cn } from "@repo/shadcn-ui/lib/utils";
import { IconCheckFill24 } from "nucleo-core-fill-24";
import { CANDY, GHOST, INK } from "./ink";

/** One tile in the components tray. */
const Tile = ({ children }: { children: React.ReactNode }) => (
  <div className="flex h-14 items-center justify-center rounded-xl border border-border bg-background">
    {children}
  </div>
);

/** Components: a tray of parts, recognisable by shape alone. */
export const ComponentsDrawing = () => (
  <div className="grid w-56 grid-cols-3 gap-2">
    <Tile>
      <div className={cn("h-5 w-12 rounded-full", CANDY)} />
    </Tile>
    <Tile>
      <div
        className={cn("flex h-4 w-8 items-center rounded-full p-0.5", CANDY)}
      >
        <div className="size-3 translate-x-3.5 rounded-full bg-white shadow-sm" />
      </div>
    </Tile>
    <Tile>
      <div
        className={cn(
          "flex size-4 items-center justify-center rounded-[5px]",
          CANDY
        )}
      >
        <IconCheckFill24 className="text-white" size={11} />
      </div>
    </Tile>
    <Tile>
      <div className="flex -space-x-1.5">
        <div
          className={cn("size-5 rounded-full border-2 border-background", INK)}
        />
        <div
          className={cn(
            "size-5 rounded-full border-2 border-background",
            GHOST
          )}
        />
      </div>
    </Tile>
    <Tile>
      <div className="flex h-5 w-14 items-center rounded-md border border-border px-1.5">
        <div className="h-2.5 w-px bg-brand" />
      </div>
    </Tile>
    <Tile>
      <div className={cn("h-4 w-10 rounded-full", INK)} />
    </Tile>
  </div>
);

/** Blocks: layout sketch — no dashed outer shell. */
export const BlocksDrawing = () => (
  <div className="flex h-36 w-56 gap-2">
    <div className={cn("w-8 shrink-0 rounded-lg", GHOST)} />
    <div className="flex min-w-0 flex-1 flex-col gap-2">
      <div className={cn("h-3.5 shrink-0 rounded-md", GHOST)} />
      <div className="flex flex-1 flex-col gap-2 rounded-lg border border-border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-3 gap-1.5">
          {[0, 1, 2].map((index) => (
            <div
              className="flex flex-col gap-1 rounded-md border border-border p-1.5"
              key={index}
            >
              <div className={cn("h-1.5 w-2/3 rounded-full", GHOST)} />
              <div className={cn("h-2 w-full rounded-full", INK)} />
            </div>
          ))}
        </div>
        <div className="flex flex-1 items-end gap-1">
          {[60, 85, 45, 100, 70, 90].map((height, index) => (
            <div
              className={cn(
                "flex-1 rounded-t-sm",
                index % 2 ? GHOST : index === 3 ? CANDY : INK
              )}
              key={height}
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  </div>
);

/** Templates: whole pages, overlapping, each complete on its own. */
export const TemplatesDrawing = () => {
  const pages = [
    { lift: 6, rotate: -5 },
    { lift: -2, rotate: 3 },
  ];

  return (
    <div className="flex items-center justify-center [&>*:not(:first-child)]:-ml-16">
      {pages.map((page) => (
        <div
          className="h-32 w-44 shrink-0 overflow-hidden rounded-xl border border-border bg-background shadow-sm"
          key={page.rotate}
          style={{
            rotate: `${page.rotate}deg`,
            translate: `0 ${page.lift}px`,
          }}
        >
          <div className="flex h-3.5 items-center gap-1 border-border border-b px-2">
            {[0, 1, 2].map((dot) => (
              <div className={cn("size-1 rounded-full", GHOST)} key={dot} />
            ))}
          </div>
          <div className="flex flex-col items-center gap-1.5 px-3 pt-4">
            <div className={cn("h-2.5 w-24 rounded-full", CANDY)} />
            <div className={cn("h-1.5 w-16 rounded-full", GHOST)} />
            <div className={cn("h-1.5 w-12 rounded-full", GHOST)} />
            <div className="mt-2 grid w-full grid-cols-3 gap-1.5">
              {[0, 1, 2].map((cell) => (
                <div className={cn("h-7 rounded-md", GHOST)} key={cell} />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const SECTION_DRAWINGS = {
  blocks: BlocksDrawing,
  components: ComponentsDrawing,
  templates: TemplatesDrawing,
} as const;

export type SectionDrawingId = keyof typeof SECTION_DRAWINGS;
