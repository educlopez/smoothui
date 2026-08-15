import { FloatNav } from "@docs/components/float-nav";
import { BgLines } from "@docs/components/landing/bg-lines";
import Navbar from "@docs/components/landing/navbar/navbar";

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <div className="relative isolate bg-primary transition">
      <BgLines />
      <main className="relative min-h-screen w-full">
        <Navbar className="mx-auto max-w-7xl" />
        {children}
        <FloatNav />
      </main>
    </div>
  );
}
