import { cn } from "@repo/shadcn-ui/lib/utils";

export function BgLines({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "!max-w-content pointer-events-none absolute inset-0 z-0 mx-auto h-full w-full overflow-hidden bg-lines-page object-none opacity-[0.04]",
        className
      )}
    />
  );
}
