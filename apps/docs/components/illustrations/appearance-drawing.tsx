import { cn } from "@repo/shadcn-ui/lib/utils";
import { IconCheckFill24 } from "nucleo-core-fill-24";
import { GHOST, INK } from "./ink";

type Appearance = "system" | "dark" | "light";

/** Overlapping token chips — accent rides on a neutral. */
const TokenDots = ({
  accent,
  neutral,
}: {
  accent: string;
  neutral: string;
}) => (
  <span className="relative inline-flex size-5 shrink-0">
    <span
      className="absolute top-0 left-0 size-3.5 rounded-full shadow-sm ring-1 ring-black/10"
      style={{ background: neutral }}
    />
    <span
      className="absolute right-0 bottom-0 size-3.5 rounded-full shadow-sm ring-1 ring-black/15"
      style={{ background: accent }}
    />
  </span>
);

/**
 * Appearance card drawing — control tray at theme-settings scale:
 * recognisable controls on a surface that reads System / Dark / Light.
 */
export const AppearanceDrawing = ({
  mode,
  accent,
  selected,
}: {
  mode: Appearance;
  accent: string;
  selected: boolean;
}) => {
  const isSystem = mode === "system";
  const isLight = mode === "light";
  const isDark = mode === "dark";
  const typeOnDark = isSystem || isDark;

  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative flex h-[5.25rem] w-full flex-col overflow-hidden rounded-xl border shadow-xs transition-colors",
        selected ? "border-brand ring-1 ring-brand/30" : "border-border"
      )}
    >
      {isSystem ? (
        <>
          <span className="absolute inset-y-0 left-0 w-1/2 bg-zinc-950" />
          <span className="absolute inset-y-0 right-0 w-1/2 bg-zinc-50" />
        </>
      ) : (
        <span
          className={cn(
            "absolute inset-0",
            isLight ? "bg-zinc-50" : "bg-zinc-950"
          )}
        />
      )}

      <span className="relative z-10 flex h-full flex-col gap-1.5 p-2">
        {/* Type sample */}
        <span
          className={cn(
            "font-semibold text-[12px] leading-none tracking-tight",
            typeOnDark ? "text-zinc-100" : "text-zinc-800"
          )}
        >
          Aa
        </span>

        {/* Control tray — compressed components language */}
        <span className="grid grid-cols-3 gap-1">
          <span
            className={cn(
              "flex h-6 items-center justify-center rounded-md border",
              isLight
                ? "border-zinc-200 bg-white"
                : "border-zinc-700/70 bg-zinc-900/80"
            )}
          >
            <span
              className="h-2.5 w-7 rounded-full"
              style={{ background: accent }}
            />
          </span>
          <span
            className={cn(
              "flex h-6 items-center justify-center rounded-md border",
              isLight
                ? "border-zinc-200 bg-white"
                : "border-zinc-700/70 bg-zinc-900/80"
            )}
          >
            <span
              className={cn(
                "flex h-2.5 w-5 items-center rounded-full p-px",
                typeOnDark ? "bg-zinc-600" : "bg-zinc-300"
              )}
            >
              <span
                className="size-2 translate-x-2 rounded-full"
                style={{ background: accent }}
              />
            </span>
          </span>
          <span
            className={cn(
              "flex h-6 items-center justify-center rounded-md border",
              isLight
                ? "border-zinc-200 bg-white"
                : "border-zinc-700/70 bg-zinc-900/80"
            )}
          >
            <span
              className="flex size-3.5 items-center justify-center rounded-[4px]"
              style={{ background: accent }}
            >
              <IconCheckFill24 className="text-white" size={9} />
            </span>
          </span>
        </span>

        {/* Soft content block */}
        <span
          className={cn(
            "mt-auto flex items-center gap-1.5 rounded-md border px-1.5 py-1",
            isLight
              ? "border-zinc-200/90 bg-white"
              : "border-zinc-700/50 bg-zinc-900/60"
          )}
        >
          <span className={cn("h-1.5 flex-1 rounded-full", GHOST)} />
          <span className={cn("h-1.5 w-4 rounded-full", INK)} />
          <TokenDots accent={accent} neutral={isDark ? "#71717a" : "#d4d4d8"} />
        </span>
      </span>
    </span>
  );
};
