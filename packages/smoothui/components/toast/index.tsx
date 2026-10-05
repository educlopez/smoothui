"use client";

import { Toast as ToastPrimitive } from "@base-ui/react/toast";
import { cn } from "@repo/smoothui-utils";
import { motion, useReducedMotion } from "motion/react";
import type { ComponentProps, ReactNode } from "react";
import { SPRING_DEFAULT } from "../../lib/animation";

export type ToastKind = "default" | "success" | "error" | "loading";

export interface ToastOptions {
  /** Extra props for the action button, e.g. `{ children: "Undo", onClick }` */
  actionProps?: ComponentProps<"button">;
  /** Secondary text under the title */
  description?: ReactNode;
  /** Auto-dismiss delay in ms. `0` keeps the toast until closed. Default 5000. */
  timeout?: number;
  /** Primary text */
  title?: ReactNode;
  /** Visual / semantic kind */
  type?: ToastKind | (string & {});
}

export interface ToasterProps {
  /** App content. Toasts render in a fixed viewport alongside it. */
  children?: ReactNode;
  /** Optional CSS class for the viewport */
  className?: string;
  /** Max visible toasts before older ones are limited (default 3) */
  limit?: number;
  /** Default auto-dismiss delay in ms (default 5000) */
  timeout?: number;
  /** Provide your own manager instead of the shared `toastManager` */
  toastManager?: ToastManager;
}

export type ToastManager = ReturnType<typeof ToastPrimitive.createToastManager>;
export type ToastProviderProps = ComponentProps<typeof ToastPrimitive.Provider>;
export type ToastViewportProps = Omit<
  ComponentProps<typeof ToastPrimitive.Viewport>,
  "className"
> & { className?: string };
export type ToastRootProps = Omit<
  ComponentProps<typeof ToastPrimitive.Root>,
  "className" | "render"
> & { className?: string };
export type ToastContentProps = Omit<
  ComponentProps<typeof ToastPrimitive.Content>,
  "className"
> & { className?: string };
export type ToastTitleProps = Omit<
  ComponentProps<typeof ToastPrimitive.Title>,
  "className"
> & { className?: string };
export type ToastDescriptionProps = Omit<
  ComponentProps<typeof ToastPrimitive.Description>,
  "className"
> & { className?: string };
export type ToastCloseProps = Omit<
  ComponentProps<typeof ToastPrimitive.Close>,
  "className"
> & { className?: string };
export type ToastActionProps = Omit<
  ComponentProps<typeof ToastPrimitive.Action>,
  "className"
> & { className?: string };

// Numeric `scale` / `y` (not a `transform` string): Motion springs froze a
// string transform ~5% into the tween, leaving shown toasts scaled and shifted.
const TOAST_HIDDEN = { opacity: 0, scale: 0.97, y: 8 };
const TOAST_SHOWN = { opacity: 1, scale: 1, y: 0 };

/** Shared manager so `toast()` works from anywhere (event handlers, utils). */
export const toastManager: ToastManager = ToastPrimitive.createToastManager();

/** Base UI hook: `{ toasts, add, close, update, promise }` for the nearest provider. */
export const { useToastManager } = ToastPrimitive;

const add = (input: string | ToastOptions, extra?: ToastOptions) =>
  toastManager.add(
    typeof input === "string" ? { title: input, ...extra } : input
  );

/**
 * Imperative helper. `toast("Saved")`, `toast({ title, description })`,
 * `toast.success()`, `toast.error()`, `toast.promise()`, `toast.close()`.
 */
export const toast = Object.assign(add, {
  close: (id?: string) => toastManager.close(id),
  error: (title: string, options?: ToastOptions) =>
    add({ ...options, title, type: "error" }),
  promise: toastManager.promise,
  success: (title: string, options?: ToastOptions) =>
    add({ ...options, title, type: "success" }),
  update: toastManager.update,
});

export const ToastProvider = (props: ToastProviderProps) => (
  <ToastPrimitive.Provider toastManager={toastManager} {...props} />
);

/** Fixed bottom-right stack. Newest toast sits closest to the corner. */
export const ToastViewport = ({ className, ...props }: ToastViewportProps) => (
  <ToastPrimitive.Viewport
    className={cn(
      "pointer-events-none fixed right-0 bottom-0 z-[100] flex w-full max-w-sm flex-col-reverse gap-2 p-4 outline-none",
      className
    )}
    data-slot="toast-viewport"
    {...props}
  />
);

/**
 * Toast surface. Enter/exit use Motion (opacity + transform); swipe movement is
 * applied through the independent CSS `translate` property so both compose.
 */
export const ToastRoot = ({ className, ...props }: ToastRootProps) => {
  const shouldReduceMotion = useReducedMotion();
  const isEnding = props.toast.transitionStatus === "ending";

  return (
    <ToastPrimitive.Root
      className={cn(
        "pointer-events-auto relative w-full min-w-0 touch-none select-none rounded-lg border bg-popover p-4 text-popover-foreground shadow-lg outline-none [translate:var(--toast-swipe-movement-x,0px)_var(--toast-swipe-movement-y,0px)] data-[type=error]:border-destructive/50 data-[type=loading]:border-border data-[type=success]:border-emerald-500/50 data-[type=loading]:bg-muted/40",
        className
      )}
      data-slot="toast"
      render={
        <motion.div
          animate={isEnding ? TOAST_HIDDEN : TOAST_SHOWN}
          initial={shouldReduceMotion ? TOAST_SHOWN : TOAST_HIDDEN}
          transition={shouldReduceMotion ? { duration: 0 } : SPRING_DEFAULT}
        />
      }
      {...props}
    />
  );
};

export const ToastContent = ({ className, ...props }: ToastContentProps) => (
  <ToastPrimitive.Content
    className={cn("flex min-w-0 items-start gap-3", className)}
    data-slot="toast-content"
    {...props}
  />
);

export const ToastTitle = ({ className, ...props }: ToastTitleProps) => (
  <ToastPrimitive.Title
    className={cn("font-medium text-sm leading-5", className)}
    data-slot="toast-title"
    {...props}
  />
);

export const ToastDescription = ({
  className,
  ...props
}: ToastDescriptionProps) => (
  <ToastPrimitive.Description
    className={cn("text-muted-foreground text-sm leading-5", className)}
    data-slot="toast-description"
    {...props}
  />
);

export const ToastAction = ({ className, ...props }: ToastActionProps) => (
  <ToastPrimitive.Action
    className={cn(
      "mt-2 inline-flex h-7 items-center rounded-md border border-input bg-background px-2.5 font-medium text-xs outline-none transition-colors hover:bg-accent focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
      className
    )}
    data-slot="toast-action"
    {...props}
  />
);

export const ToastClose = ({
  className,
  children,
  ...props
}: ToastCloseProps) => (
  <ToastPrimitive.Close
    aria-label="Close notification"
    className={cn(
      "-mt-1 -mr-1 ml-auto inline-flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50",
      className
    )}
    data-slot="toast-close"
    {...props}
  >
    {children ?? (
      <svg
        aria-hidden="true"
        fill="none"
        height="14"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="14"
      >
        <path d="M18 6 6 18M6 6l12 12" />
      </svg>
    )}
  </ToastPrimitive.Close>
);

/** Renders every active toast from the nearest provider. */
export const ToastList = () => {
  const { toasts } = useToastManager();

  return toasts.map((item) => (
    <ToastRoot key={item.id} toast={item}>
      <ToastContent>
        <div className="min-w-0 flex-1">
          <ToastTitle />
          <ToastDescription />
          <ToastAction />
        </div>
        <ToastClose />
      </ToastContent>
    </ToastRoot>
  ));
};

/**
 * SmoothUI Toast — Base UI only (Radix Toast has a different, non-manager API).
 * Convenience: Provider + children + Viewport + ToastList. Mount once near the root.
 */
export default function Toaster({
  children,
  className,
  limit = 3,
  timeout,
  toastManager: manager,
}: ToasterProps) {
  return (
    <ToastPrimitive.Provider
      limit={limit}
      timeout={timeout}
      toastManager={manager ?? toastManager}
    >
      {children}
      <ToastPrimitive.Portal>
        <ToastViewport className={className}>
          <ToastList />
        </ToastViewport>
      </ToastPrimitive.Portal>
    </ToastPrimitive.Provider>
  );
}
