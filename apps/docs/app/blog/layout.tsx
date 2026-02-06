import { BlogFloatNav } from "@docs/components/blog-float-nav";
import { BlurMagic } from "@docs/components/blurmagic/blurmagic";
import { BgLines } from "@docs/components/landing/bg-lines";
import Divider from "@docs/components/landing/divider";
import Footer from "@docs/components/landing/footer";
import Navbar from "@docs/components/landing/navbar/navbar";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative isolate bg-primary transition">
      <BgLines />
      <main className="relative mx-auto min-h-screen w-full max-w-7xl">
        <BlurMagic
          background="var(--color-background)"
          blur="4px"
          className="left-1/2! z-20 h-[120px]! w-full! max-w-[inherit]! -translate-x-1/2!"
          side="top"
          stop="50%"
        />
        <Navbar className="mx-auto max-w-7xl" />
        <Divider orientation="vertical" />
        <Divider className="right-auto left-0" orientation="vertical" />
        <section className="flex flex-col bg-background pt-24 pb-16">
          {children}
        </section>
        <BlurMagic
          background="var(--color-background)"
          className="left-1/2! z-20 h-[120px]! w-full! max-w-[inherit]! -translate-x-1/2!"
          side="bottom"
        />
        <BlogFloatNav />
      </main>
      <Footer />
    </div>
  );
}
