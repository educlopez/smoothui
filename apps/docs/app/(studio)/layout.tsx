import { FloatNav } from "@docs/components/float-nav";
import Navbar from "@docs/components/landing/navbar/navbar";

// Full-bleed layout for studio-style screens (no max-w container, unlike
// the (home) landing layout): the canvas must reach the viewport edges.
export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <div className="relative isolate min-h-screen bg-primary transition">
      <Navbar className="mx-auto max-w-7xl" />
      {children}
      <FloatNav />
    </div>
  );
}
