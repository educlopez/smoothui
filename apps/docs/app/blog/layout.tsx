import { BlogFloatNav } from "@docs/components/blog-float-nav";
import { BlurMagic } from "@docs/components/blurmagic/blurmagic";
import Footer from "@docs/components/landing/footer";
import Navbar from "@docs/components/landing/navbar/navbar";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
        <section className="flex flex-col overflow-hidden pt-24 pb-16">
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
