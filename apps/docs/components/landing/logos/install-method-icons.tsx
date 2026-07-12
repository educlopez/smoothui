import { cn } from "@repo/shadcn-ui/lib/utils";
import type { SVGProps } from "react";

type InstallMethodIconProps = SVGProps<SVGSVGElement>;

export function BrewInstallIcon({
  className,
  ...props
}: InstallMethodIconProps) {
  return (
    <svg
      aria-hidden
      className={cn("size-[15px] shrink-0", className)}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.75"
      viewBox="0 0 24 24"
      {...props}
    >
      <path d="M12 2 21 7v10l-9 5-9-5V7z" />
    </svg>
  );
}

export function NpxInstallIcon({
  className,
  ...props
}: InstallMethodIconProps) {
  return (
    <svg
      aria-hidden
      className={cn("size-[15px] shrink-0", className)}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.75"
      viewBox="0 0 24 24"
      {...props}
    >
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  );
}

export function ClaudeInstallIcon({
  className,
  ...props
}: InstallMethodIconProps) {
  return (
    <svg
      aria-hidden
      className={cn("size-[15px] shrink-0", className)}
      fill="currentColor"
      viewBox="0 0 24 24"
      {...props}
    >
      <path d="M4.7 15.9 9 13.4l.07-.2-.07-.13H8.8l-.7-.04-2.4-.06-2.06-.08-2-.1-.5-.1L.8 12l.05-.3.42-.3.6.05 1.33.1 2 .14 1.45.08 2.15.23h.34l.05-.14-.12-.08-.1-.08L6.9 10.6 4.66 9.12l-1.2-.86-.63-.43-.32-.4-.14-.88.57-.63.76.05.2.05.78.6 1.66 1.28 2.18 1.6.32.27.13-.09.02-.06-.14-.24L7.5 7.78 6.26 5.6l-.56-.9-.15-.53a2.6 2.6 0 0 1-.09-.64l.65-.88.36-.12.87.12.37.32.54 1.24.88 1.95 1.36 2.65.4.79.21.73.08.22h.14v-.13l.1-1.48.2-1.82.2-2.34.06-.66.32-.78.64-.42.5.24.42.6-.06.39-.25 1.6-.48 2.52-.32 1.68h.18l.21-.21.85-1.13 1.43-1.79.63-.71.74-.78.47-.38h.9l.66 1-.3 1.02-.92 1.16-.76 1-1.1 1.47-.68.93.06.1.16-.02 2.45-.52 1.32-.24 1.58-.27.72.33.08.34-.29.7-1.7.42-2 .4-2.97.7-.04.03.04.05 1.34.13.57.03h1.4l2.6.2.68.44.4.55-.07.42-1.05.53-1.42-.33-3.3-.78-1.13-.28h-.16v.1l.94.92 1.72 1.55 2.16 2 .1.5-.27.4-.3-.05-1.9-1.43-.73-.64-1.65-1.4h-.11v.16l.38.56 2.01 3.02.1.93-.14.3-.52.19-.58-.1-1.18-1.66-1.22-1.87-.99-1.67-.12.07-.58 6.27-.27.32-.63.24-.52-.4-.27-.63.27-1.27.33-1.66.27-1.32.24-1.64.14-.54v-.04h-.14L5.99 16l-1.9 2.54-1.5 1.6-.36.14-.62-.32.06-.57.34-.5 2.06-2.62z" />
    </svg>
  );
}
