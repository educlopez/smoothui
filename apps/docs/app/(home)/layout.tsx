import { BlurMagic } from "@docs/components/blurmagic/blurmagic";
import { FloatNav } from "@docs/components/float-nav";
import { BgLines } from "@docs/components/landing/bg-lines";
import Divider from "@docs/components/landing/divider";
import Navbar from "@docs/components/landing/navbar/navbar";

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <div className="relative isolate bg-primary transition">
      <BgLines />
      <main className="relative mx-auto min-h-screen w-full max-w-7xl overflow-y-auto">
        <BlurMagic
          background="var(--color-background)"
          blur="4px"
          className="-translate-x-1/2! left-1/2! z-20 h-[120px]! w-full! max-w-[inherit]!"
          side="top"
          stop="50%"
        />
        <Navbar className="mx-auto max-w-7xl" />
        <Divider orientation="vertical" />
        <Divider className="right-auto left-0" orientation="vertical" />
        <section className="flex flex-col overflow-hidden">{children}</section>
        <BlurMagic
          background="var(--color-background)"
          className="-translate-x-1/2! left-1/2! z-20 h-[120px]! w-full! max-w-[inherit]!"
          side="bottom"
        />
        <FloatNav />
      </main>
    </div>
  );
}
