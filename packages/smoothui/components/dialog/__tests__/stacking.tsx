import { Dialog } from "radix-ui";
import type { ReactNode } from "react";

/**
 * jsdom loads no Tailwind, so the utility the primitives rely on is declared
 * here. Without it a popup that lost its `z-50` would compute to "auto".
 */
const STACKING_CSS = ".z-50 { position: relative; z-index: 50; }";

export const installStackingCss = (): (() => void) => {
  const style = document.createElement("style");
  style.textContent = STACKING_CSS;
  document.head.appendChild(style);
  return () => style.remove();
};

/** A non-modal Dialog at the same layer the real Dialog uses (`z-50`). */
export const DialogHost = ({ children }: { children: ReactNode }) => (
  <Dialog.Root modal={false} open>
    <Dialog.Content aria-describedby={undefined} className="z-50">
      <Dialog.Title>Host</Dialog.Title>
      {children}
    </Dialog.Content>
  </Dialog.Root>
);

export const dialogLayer = (): number =>
  Number(
    getComputedStyle(document.querySelector('[role="dialog"]') as Element)
      .zIndex
  );

export const layerOf = (el: Element | null | undefined): number =>
  Number(el ? getComputedStyle(el).zIndex : Number.NaN);
