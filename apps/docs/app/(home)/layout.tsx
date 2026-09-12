import { BlurMagic } from "@docs/components/blurmagic/blurmagic";
import { FloatNav } from "@docs/components/float-nav";
import Navbar from "@docs/components/landing/navbar/navbar";
export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <div className="relative isolate bg-background transition">
      <main className="relative min-h-screen w-full overflow-y-auto">
        <BlurMagic
          background="var(--color-background)"
          blur="4px"
          className="left-1/2! z-20 h-[120px]! w-full! max-w-[inherit]! -translate-x-1/2!"
          side="top"
          stop="50%"
        />
        <Navbar className="mx-auto max-w-7xl" />
        <section className="flex flex-col overflow-hidden">{children}</section>
        <BlurMagic
          background="var(--color-background)"
          className="left-1/2! z-20 h-[120px]! w-full! max-w-[inherit]! -translate-x-1/2!"
          side="bottom"
        />
        <FloatNav />
      </main>
    </div>
  );
}
