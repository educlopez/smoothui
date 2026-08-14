import { BlurMagic } from "@docs/components/blurmagic/blurmagic";
import { FloatNav } from "@docs/components/float-nav";
import Divider from "@docs/components/landing/divider";
import Navbar from "@docs/components/landing/navbar/navbar";

/**
 * The width limit lives on the sections, not on `main`.
 *
 * It used to sit on `main`, which meant nothing could ever be wider than the
 * content column — a `w-screen` breakout just got clipped by the container it
 * was trying to escape. Sections now opt into `max-w-7xl` themselves (see the
 * `ContentColumn` wrapper in the page), which lets a section like the
 * components canvas run full-bleed.
 *
 * The two vertical rails and the blur bands used to inherit their width from
 * `main`, so they are pinned to their own 7xl column here to keep marking the
 * content edges rather than the viewport edges.
 */
export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <div className="relative isolate bg-primary transition">
      <main className="relative min-h-screen w-full overflow-y-auto overflow-x-clip">
        <BlurMagic
          background="var(--color-background)"
          blur="4px"
          className="left-1/2! z-20 h-[120px]! w-full! max-w-7xl! -translate-x-1/2!"
          side="top"
          stop="50%"
        />
        <Navbar className="mx-auto max-w-7xl" />
        <div className="pointer-events-none absolute inset-y-0 left-1/2 z-1 w-full max-w-7xl -translate-x-1/2">
          <Divider orientation="vertical" />
          <Divider className="right-auto left-0" orientation="vertical" />
        </div>
        <section className="flex flex-col overflow-x-clip">{children}</section>
        <BlurMagic
          background="var(--color-background)"
          className="left-1/2! z-20 h-[120px]! w-full! max-w-7xl! -translate-x-1/2!"
          side="bottom"
        />
        <FloatNav />
      </main>
    </div>
  );
}
