"use client";

import { cn } from "@repo/smoothui-utils";
import { Avatar as AvatarPrimitive } from "radix-ui";
import {
  Children,
  type ComponentProps,
  createContext,
  type ReactNode,
  useContext,
} from "react";

export type AvatarSize = "sm" | "md" | "lg";
export type AvatarStatusValue = "online" | "away" | "busy" | "offline";

export interface AvatarProps {
  /** Alt text for the image (also used for the accessible name) */
  alt?: string;
  /** Optional CSS class names */
  className?: string;
  /** Content shown while the image loads or when it fails (e.g. initials) */
  fallback?: ReactNode;
  /** Avatar diameter: `sm` 24px, `md` 32px (default), `lg` 40px */
  size?: AvatarSize;
  /** Image URL */
  src?: string;
  /** Optional presence dot rendered at the bottom-right */
  status?: AvatarStatusValue;
}

export interface AvatarGroupProps {
  /** Accessible label for the group, e.g. "Project members" */
  "aria-label"?: string;
  /** `Avatar` children (or any avatar-sized nodes) */
  children?: ReactNode;
  /** Optional CSS class names */
  className?: string;
  /** Show at most this many avatars, then a `+N` overflow chip */
  max?: number;
  /** Size applied to every avatar in the group */
  size?: AvatarSize;
}

export interface AvatarGroupOverflowProps {
  /** Optional CSS class names */
  className?: string;
  /** Number of hidden avatars */
  count: number;
}

export interface AvatarStatusProps {
  /** Optional CSS class names */
  className?: string;
  /** Presence state; also announced to assistive tech */
  status: AvatarStatusValue;
}

const SIZE_CLASS: Record<AvatarSize, string> = {
  lg: "size-10 text-sm",
  md: "size-8 text-xs",
  sm: "size-6 text-[10px]",
};

const STATUS_DOT_SIZE: Record<AvatarSize, string> = {
  lg: "size-3",
  md: "size-2.5",
  sm: "size-2",
};

const STATUS_COLOR: Record<AvatarStatusValue, string> = {
  away: "bg-amber-500",
  busy: "bg-destructive",
  offline: "bg-zinc-400 dark:bg-zinc-600",
  online: "bg-emerald-500",
};

const GROUP_RING =
  "[&>[data-slot=avatar-group-overflow]]:ring-2 [&>[data-slot=avatar-group-overflow]]:ring-background [&>[data-slot=avatar]]:ring-2 [&>[data-slot=avatar]]:ring-background";

interface AvatarGroupContextValue {
  size: AvatarSize | undefined;
}

const AvatarGroupContext = createContext<AvatarGroupContextValue>({
  size: undefined,
});
const AvatarSizeContext = createContext<AvatarSize>("md");

export type AvatarRootProps = Omit<
  ComponentProps<typeof AvatarPrimitive.Root>,
  "className"
> & {
  className?: string;
  size?: AvatarSize;
};
export type AvatarImageProps = Omit<
  ComponentProps<typeof AvatarPrimitive.Image>,
  "className"
> & {
  className?: string;
};
export type AvatarFallbackProps = Omit<
  ComponentProps<typeof AvatarPrimitive.Fallback>,
  "className"
> & {
  className?: string;
};

export const AvatarRoot = ({ className, size, ...props }: AvatarRootProps) => {
  const group = useContext(AvatarGroupContext);
  const resolved = size ?? group.size ?? "md";

  return (
    <AvatarSizeContext.Provider value={resolved}>
      <AvatarPrimitive.Root
        className={cn(
          "relative inline-flex shrink-0 select-none items-center justify-center align-middle",
          SIZE_CLASS[resolved],
          className
        )}
        data-size={resolved}
        data-slot="avatar"
        {...props}
      />
    </AvatarSizeContext.Provider>
  );
};

export const AvatarImage = ({ className, ...props }: AvatarImageProps) => (
  <AvatarPrimitive.Image
    className={cn(
      "aspect-square size-full rounded-full object-cover",
      className
    )}
    data-slot="avatar-image"
    {...props}
  />
);

export const AvatarFallback = ({
  className,
  ...props
}: AvatarFallbackProps) => (
  <AvatarPrimitive.Fallback
    className={cn(
      "flex size-full items-center justify-center rounded-full bg-foreground/10 font-medium text-muted-foreground uppercase ring-1 ring-foreground/10 ring-inset",
      className
    )}
    data-slot="avatar-fallback"
    {...props}
  />
);

/** Presence dot — place inside `AvatarRoot`. */
export const AvatarStatus = ({ className, status }: AvatarStatusProps) => {
  const size = useContext(AvatarSizeContext);

  return (
    <span
      aria-label={status}
      className={cn(
        "absolute right-0 bottom-0 rounded-full ring-2 ring-background",
        STATUS_DOT_SIZE[size],
        STATUS_COLOR[status],
        className
      )}
      data-slot="avatar-status"
      data-status={status}
      role="img"
    />
  );
};

/** `+N` chip for avatars hidden by `AvatarGroup max`. */
export const AvatarGroupOverflow = ({
  className,
  count,
}: AvatarGroupOverflowProps) => {
  const group = useContext(AvatarGroupContext);

  return (
    <span
      aria-label={`${count} more`}
      className={cn(
        "inline-flex shrink-0 select-none items-center justify-center rounded-full bg-foreground/10 font-medium text-muted-foreground tabular-nums ring-1 ring-foreground/10 ring-inset",
        SIZE_CLASS[group.size ?? "md"],
        className
      )}
      data-slot="avatar-group-overflow"
      role="img"
    >
      +{count}
    </span>
  );
};

/**
 * Overlapping stack of avatars with an optional `+N` overflow chip.
 */
export const AvatarGroup = ({
  "aria-label": ariaLabel,
  children,
  className,
  max,
  size,
}: AvatarGroupProps) => {
  const items = Children.toArray(children);
  const hasLimit = typeof max === "number" && max >= 0 && items.length > max;
  const visible = hasLimit ? items.slice(0, max) : items;
  const hidden = hasLimit ? items.length - visible.length : 0;

  return (
    <AvatarGroupContext.Provider value={{ size }}>
      <div
        aria-label={ariaLabel}
        className={cn(
          "flex min-w-0 items-center -space-x-2",
          GROUP_RING,
          className
        )}
        data-slot="avatar-group"
        role="group"
      >
        {visible}
        {hidden > 0 ? <AvatarGroupOverflow count={hidden} /> : null}
      </div>
    </AvatarGroupContext.Provider>
  );
};

/**
 * SmoothUI Avatar — Radix twin.
 * Same public props as the Base UI twin; headless via `radix-ui` Avatar.
 * Convenience API: `src` + `fallback` (+ optional `status`); use the compound
 * parts for custom layouts.
 */
export default function Avatar({
  alt = "",
  className,
  fallback,
  size,
  src,
  status,
}: AvatarProps) {
  return (
    <AvatarRoot className={className} size={size}>
      {src ? <AvatarImage alt={alt} src={src} /> : null}
      <AvatarFallback>{fallback}</AvatarFallback>
      {status ? <AvatarStatus status={status} /> : null}
    </AvatarRoot>
  );
}
